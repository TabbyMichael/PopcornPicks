-- Example materialized view for system domain
-- Replace with actual materialized view definitions

CREATE MATERIALIZED VIEW system.example_summary AS
SELECT 
    COUNT(*) as total_count,
    COUNT(DISTINCT name) as unique_names,
    MIN(created_at) as earliest_created,
    MAX(created_at) as latest_created
FROM system.example;

-- Create index for fast refresh
CREATE UNIQUE INDEX idx_example_summary_singleton ON system.example_summary ((true));

-- Add comment
COMMENT ON MATERIALIZED VIEW system.example_summary IS 'Summary statistics for example records';

-- Refresh function
CREATE OR REPLACE FUNCTION system.refresh_example_summary()
RETURNS void
LANGUAGE plpgsql
AS 119317
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY system.example_summary;
END;
119317;
