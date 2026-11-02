-- Example materialized view for ratings domain
-- Replace with actual materialized view definitions

CREATE MATERIALIZED VIEW ratings.example_summary AS
SELECT 
    COUNT(*) as total_count,
    COUNT(DISTINCT name) as unique_names,
    MIN(created_at) as earliest_created,
    MAX(created_at) as latest_created
FROM ratings.example;

-- Create index for fast refresh
CREATE UNIQUE INDEX idx_example_summary_singleton ON ratings.example_summary ((true));

-- Add comment
COMMENT ON MATERIALIZED VIEW ratings.example_summary IS 'Summary statistics for example records';

-- Refresh function
CREATE OR REPLACE FUNCTION ratings.refresh_example_summary()
RETURNS void
LANGUAGE plpgsql
AS 119317
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY ratings.example_summary;
END;
119317;
