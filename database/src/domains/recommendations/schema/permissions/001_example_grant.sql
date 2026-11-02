-- Example permission grant for recommendations domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON recommendations.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA recommendations TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA recommendations TO ;

-- Add comment
COMMENT ON GRANT SELECT ON recommendations.example TO  IS 'Grant CRUD permissions on example table';
