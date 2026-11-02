-- Example permission grant for users domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON users.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA users TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA users TO ;

-- Add comment
COMMENT ON GRANT SELECT ON users.example TO  IS 'Grant CRUD permissions on example table';
