# Scheduler Service

## Purpose
The scheduler service manages scheduled jobs using PostgreSQL pg_cron. It triggers recurring tasks such as materialized view refreshes, data cleanup, analytics calculations, and periodic data synchronization.

## Responsibilities
- Manage pg_cron scheduled jobs
- Trigger materialized view refreshes
- Schedule data cleanup tasks
- Periodic analytics calculations
- TMDB data synchronization
- Backup verification
- Maintenance tasks

## Configuration
- **Networks**: backend
- **Dependencies**: postgres
- **Environment Variables**:
  - `NODE_ENV`: development|production
  - `DATABASE_URL`: PostgreSQL connection string

## Scheduled Jobs
- `refresh_mv_recommendations`: Refresh recommendation materialized views (hourly)
- `refresh_mv_analytics`: Refresh analytics materialized views (daily)
- `cleanup_old_data`: Remove old/soft-deleted data (weekly)
- `tmdb_full_sync`: Full TMDB data synchronization (daily)
- `tmdb_incremental_sync`: Incremental TMDB updates (hourly)
- `backup_verification`: Verify backup integrity (daily)
- `index_maintenance`: Rebuild and analyze indexes (weekly)
- `statistics_update`: Update table statistics (daily)

## Job Management
- Jobs defined in database/src/domains/*/cron/
- Job execution monitored and logged
- Failed jobs trigger alerts
- Job history maintained
- Manual job triggering capability

## Deployment
- Built with multi-stage Dockerfile
- Production: Optimized Node.js build
- Single instance (coordination via pg_cron)

## Monitoring
- Job execution logs
- Success/failure rates
- Execution duration metrics
- Job overlap detection

## Error Handling
- Job failure logging
- Alert on repeated failures
- Manual retry capability
- Job dependency management

## Time Zones
- All jobs in UTC
- Consistent scheduling across environments
- Daylight saving time handled
