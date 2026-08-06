# Baked in rather than bind-mounted, for the same reason as the Grafana image:
# a relative bind mount that fails to resolve under Coolify is silently
# replaced with an empty directory.
#
# This diverges from gamification-hub, which still bind-mounts its prometheus.yml.
# That works there because its compose sits at the repo root, so the path
# resolves; polyglot's compose is in a subdirectory, which is what broke it.
# Baking it in removes the dependency on how Coolify resolves relative paths.
#
# The file is a template — the compose entrypoint substitutes the __*_TARGET__
# placeholders at start-up, because Prometheus does not expand env vars itself.

FROM prom/prometheus:v2.54.1

COPY prometheus.yml /etc/prometheus/prometheus.template.yml
