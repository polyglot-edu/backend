import express, { NextFunction, Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import {
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Registry,
} from "prom-client";
import { METRICS_PORT } from "../utils/secrets";

/**
 * Prometheus instrumentation.
 *
 * Served on its own port (METRICS_PORT), never on the application port. Traefik
 * routes *every* path for the public hostname, so a /metrics endpoint on the
 * main port would be world-readable. This port gets no Traefik route, so only
 * containers on the internal network — i.e. Prometheus — can reach it.
 */

export const registry = new Registry();

registry.setDefaultLabels({ service: "polyglot-backend" });

// Event-loop lag, heap, GC, CPU, handles.
collectDefaultMetrics({ register: registry });

// Default buckets top out at 10s, but the AI-generation endpoints proxy to
// external services and routinely run longer, so extend the tail.
const DURATION_BUCKETS = [
  0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30, 60,
];

const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: DURATION_BUCKETS,
  registers: [registry],
});

const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [registry],
});

const httpRequestsInFlight = new Gauge({
  name: "http_requests_in_flight",
  help: "HTTP requests currently being handled",
  registers: [registry],
});

new Gauge({
  name: "mongodb_connection_state",
  help: "Mongoose connection readyState (0=disconnected 1=connected 2=connecting 3=disconnecting)",
  registers: [registry],
  collect() {
    this.set(mongoose.connection.readyState);
  },
});

/**
 * Resolves the Express *route pattern* for a request, e.g. `/api/flows/:id`.
 *
 * Labelling by `req.path` would mint a new time series per UUID and eventually
 * take Prometheus down — these paths are full of ids. `req.route` is only
 * populated once routing has matched, hence reading it on response finish.
 *
 * Requests that matched nothing are bucketed as `unmatched` rather than
 * labelled with the raw path, so scanner traffic can't inflate cardinality.
 */
const resolveRoute = (req: Request): string => {
  const routePath = (req as Request & { route?: { path?: string } }).route?.path;
  if (!routePath) return "unmatched";

  const base = req.baseUrl || "";
  const full = `${base}${routePath === "/" ? "" : routePath}`;
  return full || "/";
};

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const endTimer = httpRequestDuration.startTimer();
  httpRequestsInFlight.inc();

  res.on("finish", () => {
    httpRequestsInFlight.dec();
    const labels = {
      method: req.method,
      route: resolveRoute(req),
      status_code: String(res.statusCode),
    };
    endTimer(labels);
    httpRequestsTotal.inc(labels);
  });

  next();
}

/**
 * Starts the metrics listener. Returns the server so tests can close it.
 */
export function startMetricsServer(): http.Server {
  const app = express();

  app.get("/metrics", async (_req, res) => {
    try {
      res.set("Content-Type", registry.contentType);
      res.end(await registry.metrics());
    } catch (err) {
      res.status(500).end(String(err));
    }
  });

  // Lets Prometheus' own health checking distinguish "scrape failed" from
  // "process is gone" without pulling the full metrics payload.
  app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok" }));

  // console rather than winston: the logger's console transport is pinned to
  // `error` level in production, so an info line would never surface.
  const server = app.listen(METRICS_PORT, () => {
    console.log(`  Metrics exposed on :${METRICS_PORT}/metrics`);
  });

  return server;
}
