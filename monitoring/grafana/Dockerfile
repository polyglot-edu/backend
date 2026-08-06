# Matches the gamification-hub pattern: dashboards live alongside the provider
# config inside provisioning/, so a single COPY captures both.
#
# Configuration is baked in rather than bind-mounted because a relative bind
# mount that fails to resolve under Coolify is silently replaced by an empty
# directory — Grafana then starts healthy with no datasources and no dashboards,
# and logs nothing.
#
# /etc/grafana is also outside /var/lib/grafana, where the grafana-data volume
# is mounted, so the volume cannot mask an updated image.

FROM grafana/grafana:11.2.0

COPY provisioning /etc/grafana/provisioning
