-- Example permission grant for watchlists domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON watchlists.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA watchlists TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA watchlists TO ;

-- Add comment
COMMENT ON GRANT SELECT ON watchlists.example TO  IS 'Grant CRUD permissions on example table';
