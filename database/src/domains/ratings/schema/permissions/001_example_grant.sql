-- Example permission grant for ratings domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON ratings.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA ratings TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ratings TO ;

-- Add comment
COMMENT ON GRANT SELECT ON ratings.example TO  IS 'Grant CRUD permissions on example table';
