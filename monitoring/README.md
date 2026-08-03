# Monitoring

Prometheus + Grafana for the Polyglot backend and the edge proxy, deployed as a
**separate Coolify resource** from the backend itself.

```
backend        :9091/metrics ──┐
coolify-proxy  :8082/metrics ──┼──► Prometheus ──► Grafana ──► tunnel ──► Cloudflare Access
editor       (via Traefik) ────┘      15d              │
                                                  provisioned
                                              datasource + dashboards
```

Two independent viewpoints, and you want both:

- **Traefik** answers *is it slow or failing?* — measured where users are, and it
  sees requests that never reach an application at all.
- **prom-client** answers *why?* — per-route latency, event-loop lag, heap, GC,
  CPU and Mongo connection state.

---

## 1. Enable Traefik metrics

Coolify UI → **Servers → your server → Proxy → Configuration**. Add to the
`command:` list on the `traefik` service:

```yaml
- '--entrypoints.metrics.address=:8082'
- '--metrics.prometheus=true'
- '--metrics.prometheus.entryPoint=metrics'
- '--metrics.prometheus.addRoutersLabels=true'
- '--metrics.prometheus.addServicesLabels=true'
- '--metrics.prometheus.addEntryPointsLabels=true'
```

Restart the proxy. Port 8082 is never given a Traefik router, so metrics are
reachable only from inside the Docker network.

> **Coolify can regenerate this file on proxy upgrades.** If the edge dashboard
> goes blank after a Coolify update, re-apply these flags first. The same applies
> to any `--accesslog` flags you added while debugging.

## 2. Deploy this stack

New Coolify resource:

| Setting | Value |
|---|---|
| Build pack | **Docker Compose** |
| Base Directory | `/backend/monitoring` |
| Compose file | `docker-compose.yml` |
| Domain | on the **`grafana`** service only |

Prometheus deliberately gets **no domain** — it has no authentication of its own.

### Environment variables

```
BACKEND_METRICS_TARGET=backend-<resource-uuid>:9091
TRAEFIK_METRICS_TARGET=coolify-proxy:8082
GRAFANA_ROOT_URL=https://polyglot-grafana.createlab-univaq.it
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=<generate one>
```

Find the backend's container name — Coolify names compose containers
`<service>-<resource-uuid>`:

```bash
docker ps --format '{{.Names}}' | grep backend
```

Prometheus does not expand environment variables in its own config, so
`prometheus/prometheus.yml` is a **template**: the compose entrypoint renders the
`__*_TARGET__` placeholders with `sed` at start-up. This avoids both hardcoding a
per-environment container name into the repo and mounting the Docker socket for
service discovery — the latter would hand Prometheus full control of the daemon.

## 3. Put Grafana behind Cloudflare Access

Add the Grafana hostname as a Public Hostname on the tunnel, then create an
Access application for it so no Grafana login page is exposed to the internet.

Grafana is still configured with anonymous access off, sign-up off, and an admin
password — Access is the perimeter, not the only control.

## 4. Verify

```bash
# Targets should all be UP
#   (Prometheus has no domain, so port-forward or exec in)
docker exec <prometheus-container> wget -qO- 'http://127.0.0.1:9090/api/v1/targets?state=active'

# The backend is exporting
docker exec <backend-container> wget -qO- http://127.0.0.1:9091/metrics | head

# /metrics is NOT publicly reachable — this must NOT return metrics
curl -s -o /dev/null -w '%{http_code}\n' https://polyglot-backend.createlab-univaq.it/metrics
```

In Grafana, the **Polyglot** folder should contain two dashboards, provisioned
read-only.

---

## Dashboards

| Dashboard | Answers |
|---|---|
| **Polyglot backend** | RED metrics, latency percentiles, slowest routes, event-loop lag, heap, Mongo connectivity |
| **Polyglot edge (Traefik)** | Per-service throughput and latency at the proxy, status-class breakdown, per-router rates |

They are provisioned with `allowUiUpdates: false`, so UI edits are discarded on
restart. Change the JSON in git — that keeps the dashboards reviewable and
reproducible. Set it to `true` in
`grafana/provisioning/dashboards/dashboards.yml` if you would rather iterate in
the browser.

### Design conventions

Worth preserving if you add panels:

- **Single numbers are stat tiles, not charts.** A one-value time series wastes a
  panel.
- **One unit per panel — never two y-axes.** Two measures of different scale go in
  two panels. If you need throughput next to latency, that is two panels.
- **4xx is separated from 5xx.** Right now `TEST_MODE=true` means almost no 401s;
  once Google auth is live, 401s become routine traffic and a combined error panel
  would look like a permanent incident.
- **Status colours (green/yellow/red) are reserved for thresholds** — health,
  error rate, latency budget — and never used to tell two series apart. Series
  identity comes from Grafana's categorical palette in its fixed order.
- **`route` labels are Express patterns** (`/api/flows/:id`), never raw paths.
  Labelling by raw path would create one time series per UUID and eventually
  exhaust Prometheus. Unmatched requests are bucketed as `unmatched` so scanner
  traffic cannot inflate cardinality either.

## Cost

Retention is 15 days (`--storage.tsdb.retention.time=15d`). The dominant driver is
`http_request_duration_seconds_bucket`: 13 buckets × ~71 route/method pairs ×
status codes. Bounded, but not free — check volume growth after a week and adjust
retention or drop buckets if needed.

## Not included

Log aggregation. Loki and Alloy already run for gamification-engine, so
correlating request logs with these metrics is a natural next step rather than
something to duplicate here.
