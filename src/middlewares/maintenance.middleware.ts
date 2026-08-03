import { NextFunction, Request, Response } from "express";
import { MAINTENANCE_SECRET } from "../utils/secrets";

/**
 * Gate for the destructive `serverClean` maintenance routes.
 *
 * These previously compared a hardcoded string taken from the URL path, on
 * unauthenticated GET routes — which meant the secret was public (the repo is
 * open source), landed in every access log, and could be triggered by anything
 * that follows a link.
 *
 * The secret now comes from the environment and travels in a header. When it is
 * unset the routes report 404 rather than 403, so a deployment that never
 * configures it does not advertise that they exist.
 *
 * Note this is the real gate: `checkAuth` alone is not sufficient, because with
 * TEST_MODE=true every request resolves to the shared `guest` user.
 */
export function requireMaintenanceSecret(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!MAINTENANCE_SECRET) {
    return res.status(404).json({ error: "Not found" });
  }

  const provided = req.headers["x-maintenance-secret"];

  if (typeof provided !== "string" || provided !== MAINTENANCE_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }

  return next();
}
