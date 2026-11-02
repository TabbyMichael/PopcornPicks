-- Example cron job for administration domain
-- Replace with actual pg_cron job definitions

-- Schedule job to run every hour
SELECT cron.schedule(
    'administration_hourly_job',
    '0 * * * *', -- Every hour at minute 0
    119317SELECT administration.sync_external_data();119317
);

-- Add comment
COMMENT ON SCHEDULE administration_hourly_job IS 'Hourly job for administration domain';

-- Schedule job to run daily at 2 AM
SELECT cron.schedule(
    'administration_daily_job',
    '0 2 * * *', -- Every day at 2 AM
    119317SELECT administration.refresh_example_summary();119317
);

-- Add comment
COMMENT ON SCHEDULE administration_daily_job IS 'Daily job for administration domain';
