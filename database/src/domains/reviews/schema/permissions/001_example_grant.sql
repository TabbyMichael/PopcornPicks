-- Example permission grant for reviews domain
-- Replace with actual permission grants

-- Grant specific permissions on table
GRANT SELECT, INSERT, UPDATE ON reviews.example TO ;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA reviews TO ;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA reviews TO ;

-- Add comment
COMMENT ON GRANT SELECT ON reviews.example TO  IS 'Grant CRUD permissions on example table';
