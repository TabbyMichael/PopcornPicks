# Docker Logging

## Purpose
Centralized logging configuration and management for Docker services.

## Logging Strategy

### JSON File Logging (Default)
- Docker's default JSON file driver
- Logs stored in `/var/lib/docker/containers/`
- Managed by Docker daemon
- Automatic rotation configured

### Service-Specific Logging

#### Frontend
- **Location**: Console stdout/stderr
- **Format**: JSON
- **Level**: info
- **Rotation**: Managed by Docker

#### Backend
- **Location**: Console stdout/stderr
- **Format**: JSON
- **Level**: info (dev), warn (prod)
- **Rotation**: Managed by Docker

#### PostgreSQL
- **Location**: Console stdout/stderr + `/var/log/postgresql`
- **Format**: CSV
- **Level**: warning
- **Rotation**: PostgreSQL log rotation

#### Worker
- **Location**: Console stdout/stderr
- **Format**: JSON
- **Level**: info
- **Rotation**: Managed by Docker

#### Scheduler
- **Location**: Console stdout/stderr
- **Format**: JSON
- **Level**: info
- **Rotation**: Managed by Docker

## Log Rotation

### Docker JSON Driver
Configure in `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

### PostgreSQL Log Rotation
Configure in PostgreSQL:
- `log_rotation_age = 1d`
- `log_rotation_size = 100MB`
- `log_truncate_on_rotation = on`

## Log Aggregation (Future)

### Centralized Logging Options
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Loki**: Grafana Loki (lightweight)
- **CloudWatch**: AWS CloudWatch Logs
- **Papertrail**: Cloud logging service
- **Datadog**: Monitoring + logging

### Recommended Setup
1. Development: Docker logs only
2. Production: Loki + Grafana
3. Enterprise: ELK Stack

## Log Analysis

### Viewing Logs
```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend

# View last 100 lines
docker compose logs --tail=100 backend

# View logs since timestamp
docker compose logs --since=2024-01-01T00:00:00 backend
```

### Filtering Logs
```bash
# Filter by level
docker compose logs backend | grep ERROR

# Filter by pattern
docker compose logs backend | grep "user.*login"
```

## Log Levels

- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARN**: Warning messages for potentially harmful situations
- **ERROR**: Error events that might still allow the application to continue
- **FATAL**: Severe error events that will presumably lead the application to abort

## Best Practices

1. **Structured Logging**: Use JSON format for easy parsing
2. **Correlation IDs**: Include request IDs for tracing
3. **Sensitive Data**: Never log passwords, tokens, or PII
4. **Log Level**: Use appropriate levels for production
5. **Performance**: Avoid excessive logging in hot paths
6. **Sampling**: Sample high-frequency logs in production
7. **Context**: Include relevant context (user, request, service)

## Log Security

1. **Access Control**: Restrict log access to authorized personnel
2. **Encryption**: Encrypt logs at rest in production
3. **Retention**: Define and enforce retention policies
4. **PII**: Scrub or mask personally identifiable information
5. **Audit**: Log access to logs themselves

## Monitoring

### Key Metrics
- Log volume per service
- Error rate by service
- Log latency
- Storage usage
- Alert on error spikes

### Alerts
- High error rate (> 5%)
- Log service down
- Storage capacity warning
- Unusual log patterns
