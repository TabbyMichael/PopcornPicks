-- Example cron job for search domain
-- Replace with actual pg_cron job definitions

-- Schedule job to run every hour
SELECT cron.schedule(
    'search_hourly_job',
    '0 * * * *', -- Every hour at minute 0
    119317SELECT search.sync_external_data();119317
);

-- Add comment
COMMENT ON SCHEDULE search_hourly_job IS 'Hourly job for search domain';

-- Schedule job to run daily at 2 AM
SELECT cron.schedule(
    'search_daily_job',
    '0 2 * * *', -- Every day at 2 AM
    119317SELECT search.refresh_example_summary();119317
);

-- Add comment
COMMENT ON SCHEDULE search_daily_job IS 'Daily job for search domain';
