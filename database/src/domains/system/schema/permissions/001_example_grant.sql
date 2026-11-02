-- Example permission grant for system domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON system.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA system TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA system TO ;

-- Add comment
COMMENT ON GRANT SELECT ON system.example TO  IS 'Grant CRUD permissions on example table';
