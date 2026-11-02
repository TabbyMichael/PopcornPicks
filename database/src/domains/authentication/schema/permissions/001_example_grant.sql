-- Example permission grant for authentication domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON authentication.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA authentication TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA authentication TO ;

-- Add comment
COMMENT ON GRANT SELECT ON authentication.example TO  IS 'Grant CRUD permissions on example table';
