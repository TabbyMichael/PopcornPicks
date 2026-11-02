-- Example permission grant for movies domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON movies.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA movies TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA movies TO ;

-- Add comment
COMMENT ON GRANT SELECT ON movies.example TO  IS 'Grant CRUD permissions on example table';
