-- Example cron job for system domain
-- Replace with actual pg_cron job definitions

-- Schedule job to run every hour
SELECT cron.schedule(
    'system_hourly_job',
    '0 * * * *', -- Every hour at minute 0
    119317SELECT system.sync_external_data();119317
);

-- Add comment
COMMENT ON SCHEDULE system_hourly_job IS 'Hourly job for system domain';

-- Schedule job to run daily at 2 AM
SELECT cron.schedule(
    'system_daily_job',
    '0 2 * * *', -- Every day at 2 AM
    119317SELECT system.refresh_example_summary();119317
);

-- Add comment
COMMENT ON SCHEDULE system_daily_job IS 'Daily job for system domain';
