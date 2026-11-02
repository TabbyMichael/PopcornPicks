# Docker Monitoring

## Purpose
Monitoring and observability infrastructure for Docker services using Prometheus and Grafana.

## Monitoring Stack

### Prometheus
- **Purpose**: Metrics collection and storage
- **Port**: 9090
- **Retention**: 15 days (default)
- **Scrape Interval**: 15s
- **Evaluation Interval**: 15s

### Grafana
- **Purpose**: Visualization and dashboards
- **Port**: 3000
- **Authentication**: Admin credentials
- **Data Sources**: Prometheus
- **Dashboards**: Pre-configured dashboards

### PostgreSQL Exporter
- **Purpose**: PostgreSQL metrics
- **Port**: 9187
- **Metrics**: Connections, queries, performance, replication

### Node Exporter
- **Purpose**: System metrics
- **Port**: 9100
- **Metrics**: CPU, memory, disk, network

## Key Metrics

### System Metrics
- CPU usage (user, system, idle)
- Memory usage (used, free, cached, buffers)
- Disk usage (space, I/O)
- Network traffic (in, out, errors)
- Load average

### Application Metrics (Future)
- Request rate
- Response time (p50, p95, p99)
- Error rate
- Active connections
- Queue depth

### Database Metrics
- Connection count
- Query performance
- Transaction rate
- Cache hit ratio
- Lock contention
- Replication lag

### Container Metrics
- Container CPU usage
- Container memory usage
- Container network I/O
- Container block I/O
- Container health status

## Dashboards

### System Overview
- CPU, memory, disk, network metrics
- Container resource usage
- System load

### PostgreSQL Overview
- Connection metrics
- Query performance
- Transaction metrics
- Cache statistics

### Application Overview (Future)
- Request rate and latency
- Error rate
- Active users
- API endpoints

### Infrastructure Overview
- All services health
- Resource utilization
- Network traffic
- Storage capacity

## Alerts

### Critical Alerts
- PostgreSQL down
- Backend service down
- Frontend service down
- High error rate (> 5%)
- Disk space critical (< 5%)

### Warning Alerts
- High CPU usage (> 80%)
- High memory usage (> 90%)
- Low disk space (< 10%)
- Slow queries detected
- High connection count

### Info Alerts
- Service restarted
- Configuration changed
- Backup completed
- Deployment completed

## Alert Routing

### Critical
- Immediate notification
- PagerDuty / SMS
- Email to on-call
- Slack channel

### Warning
- Email notification
- Slack channel
- No immediate action required

### Info
- Slack channel
- Daily digest
- For awareness only

## Monitoring Configuration

### Prometheus
Configuration: `docker/configs/monitoring/prometheus.yml`

Key settings:
- Scrape intervals
- Evaluation intervals
- Alert rules
- Storage retention

### Grafana
Configuration: `docker/configs/monitoring/grafana/`

Key settings:
- Data sources
- Dashboards
- Users and permissions
- Alert notifications

## Usage

### Start Monitoring Stack
```bash
docker compose -f docker/compose/compose.prod.yml -f docker/compose/compose.monitoring.yml up -d
```

### Access Grafana
- URL: http://localhost:3000
- Default credentials: admin/admin
- Change password on first login

### Access Prometheus
- URL: http://localhost:9090
- No authentication (internal network only)

### Query Metrics
```bash
# PostgreSQL connection count
pg_stat_activity_count

# CPU usage
rate(process_cpu_seconds_total[5m])

# Memory usage
process_resident_memory_bytes / node_memory_MemTotal_bytes
```

## Best Practices

1. **Dashboard Design**: Keep dashboards simple and focused
2. **Alert Thresholds**: Set appropriate thresholds to avoid alert fatigue
3. **Metric Naming**: Use consistent naming conventions
4. **Label Usage**: Use labels for dimensional data
5. **Retention**: Configure appropriate retention based on storage
6. **High Availability**: Run monitoring stack with redundancy
7. **Backup**: Backup Grafana dashboards and configurations
8. **Testing**: Test alerts regularly
9. **Documentation**: Document metrics and dashboards
10. **Review**: Regularly review and update dashboards

## Future Enhancements

- [ ] Application metrics (custom exporters)
- [ ] Distributed tracing (Jaeger/Zipkin)
- [ ] Log aggregation (Loki/ELK)
- [ ] Synthetic monitoring
- [ ] Real user monitoring (RUM)
- [ ] Business metrics
- [ ] Anomaly detection
- [ ] Predictive alerting
- [ ] Cost monitoring
- [ ] Capacity planning
