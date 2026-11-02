-- Example permission grant for search domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON search.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA search TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA search TO ;

-- Add comment
COMMENT ON GRANT SELECT ON search.example TO  IS 'Grant CRUD permissions on example table';
