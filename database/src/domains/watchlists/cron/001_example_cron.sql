-- Example cron job for watchlists domain
-- Replace with actual pg_cron job definitions

-- Schedule job to run every hour
SELECT cron.schedule(
    'watchlists_hourly_job',
    '0 * * * *', -- Every hour at minute 0
    119317SELECT watchlists.sync_external_data();119317
);

-- Add comment
COMMENT ON SCHEDULE watchlists_hourly_job IS 'Hourly job for watchlists domain';

-- Schedule job to run daily at 2 AM
SELECT cron.schedule(
    'watchlists_daily_job',
    '0 2 * * *', -- Every day at 2 AM
    119317SELECT watchlists.refresh_example_summary();119317
);

-- Add comment
COMMENT ON SCHEDULE watchlists_daily_job IS 'Daily job for watchlists domain';
