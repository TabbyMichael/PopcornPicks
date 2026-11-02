-- Example permission grant for notifications domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON notifications.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA notifications TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA notifications TO ;

-- Add comment
COMMENT ON GRANT SELECT ON notifications.example TO  IS 'Grant CRUD permissions on example table';
