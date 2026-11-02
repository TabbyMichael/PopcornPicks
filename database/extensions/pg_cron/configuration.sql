-- ============================================================================
-- pg_cron configuration.sql
-- Configure pg_cron for scheduled jobs.
-- ============================================================================

-- pg_cron requires shared_preload_libraries = 'pg_cron' in postgresql.conf.
-- This is configured in the Docker image (docker/configs/postgresql.conf).

-- Example scheduled jobs (defined per-domain in src/domains/<capability>/cron/):
--   SELECT cron.schedule('job_refresh_mv_analytics', '0 2 * * *', 'CALL analytics.refresh_mv_analytics()');
--   SELECT cron.schedule('job_cleanup_orphans', '0 3 * * *', 'CALL system.cleanup_orphaned_rows()');
--   SELECT cron.schedule('job_sync_tmdb', '0 4 * * *', 'CALL movies.sync_tmdb()');
--   SELECT cron.schedule('job_refresh_recommendations', '0 5 * * *', 'CALL recommendations.refresh_cache()');

-- View scheduled jobs:
--   SELECT * FROM cron.job;