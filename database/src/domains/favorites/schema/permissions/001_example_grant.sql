-- Example permission grant for favorites domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON favorites.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA favorites TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA favorites TO ;

-- Add comment
COMMENT ON GRANT SELECT ON favorites.example TO  IS 'Grant CRUD permissions on example table';
