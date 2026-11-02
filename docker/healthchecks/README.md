# Docker Healthchecks

## Purpose
Health check scripts for Docker services to monitor service health and enable automatic recovery.

## Health Check Scripts

### frontend.sh
- **Purpose**: Check if the frontend service is responding
- **Endpoint**: http://localhost:5173
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

### backend.sh
- **Purpose**: Check if the backend API is responding
- **Endpoint**: http://localhost:3001/health
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

### postgres.sh
- **Purpose**: Check if PostgreSQL is ready and extensions are installed
- **Checks**: pg_isready, extension availability
- **Interval**: 10s (dev), 30s (prod)
- **Timeout**: 5s (dev), 10s (prod)
- **Retries**: 5

### worker.sh
- **Purpose**: Check if the background worker is running
- **Checks**: Process existence, database connectivity
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

### scheduler.sh
- **Purpose**: Check if the scheduler is running
- **Checks**: Process existence, database connectivity
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

## Usage

Health checks are integrated into Docker compose files:

```yaml
healthcheck:
  test: ["CMD", "/path/to/healthcheck.sh"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Best Practices

1. **Fast Execution**: Health checks should complete quickly (< 5s)
2. **Idempotent**: Multiple checks should not cause side effects
3. **Consistent**: Same behavior across environments
4. **Comprehensive**: Check both process and critical dependencies
5. **Logging**: Log failures for debugging

## Manual Testing

```bash
# Test health check manually
docker exec <container> /path/to/healthcheck.sh

# Check health status
docker inspect --format='{{.State.Health.Status}}' <container>
```

## Health States

- **starting**: Container is starting, health check not yet run
- **healthy**: Health check passed
- **unhealthy**: Health check failed (triggering restart)
- **none**: No health check configured
