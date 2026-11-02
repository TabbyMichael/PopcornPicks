-- Example permission grant for analytics domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON analytics.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA analytics TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA analytics TO ;

-- Add comment
COMMENT ON GRANT SELECT ON analytics.example TO  IS 'Grant CRUD permissions on example table';
