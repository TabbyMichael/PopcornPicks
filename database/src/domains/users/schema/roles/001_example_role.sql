-- Example role for users domain
-- Replace with actual role definitions

-- Create application role
CREATE ROLE ;

-- Grant connect on database
GRANT CONNECT ON DATABASE popcornpicks TO ;

-- Grant usage on schema
GRANT USAGE ON SCHEMA users TO ;

-- Grant select on tables
GRANT SELECT ON ALL TABLES IN SCHEMA users TO ;

-- Add comment
COMMENT ON ROLE  IS 'Application role for users domain';
