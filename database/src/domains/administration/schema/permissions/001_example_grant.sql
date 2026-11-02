-- Example permission grant for administration domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON administration.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA administration TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA administration TO ;

-- Add comment
COMMENT ON GRANT SELECT ON administration.example TO  IS 'Grant CRUD permissions on example table';
