-- Example role for recommendations domain
-- Replace with actual role definitions

-- Create application role
CREATE ROLE ;

-- Grant connect on database
GRANT CONNECT ON DATABASE popcornpicks TO ;

-- Grant usage on schema
GRANT USAGE ON SCHEMA recommendations TO ;

-- Grant select on tables
GRANT SELECT ON ALL TABLES IN SCHEMA recommendations TO ;

-- Add comment
COMMENT ON ROLE  IS 'Application role for recommendations domain';
