-- Example materialized view for administration domain
-- Replace with actual materialized view definitions

CREATE MATERIALIZED VIEW administration.example_summary AS
SELECT 
    COUNT(*) as total_count,
    COUNT(DISTINCT name) as unique_names,
    MIN(created_at) as earliest_created,
    MAX(created_at) as latest_created
FROM administration.example;

-- Create index for fast refresh
CREATE UNIQUE INDEX idx_example_summary_singleton ON administration.example_summary ((true));

-- Add comment
COMMENT ON MATERIALIZED VIEW administration.example_summary IS 'Summary statistics for example records';

-- Refresh function
CREATE OR REPLACE FUNCTION administration.refresh_example_summary()
RETURNS void
LANGUAGE plpgsql
AS 119317
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY administration.example_summary;
END;
119317;
