-- Example cron job for users domain
-- Replace with actual pg_cron job definitions

-- Schedule job to run every hour
SELECT cron.schedule(
    'users_hourly_job',
    '0 * * * *', -- Every hour at minute 0
    119317SELECT users.sync_external_data();119317
);

-- Add comment
COMMENT ON SCHEDULE users_hourly_job IS 'Hourly job for users domain';

-- Schedule job to run daily at 2 AM
SELECT cron.schedule(
    'users_daily_job',
    '0 2 * * *', -- Every day at 2 AM
    119317SELECT users.refresh_example_summary();119317
);

-- Add comment
COMMENT ON SCHEDULE users_daily_job IS 'Daily job for users domain';
