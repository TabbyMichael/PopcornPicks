-- Example role for authentication domain
-- Replace with actual role definitions

-- Create application role
CREATE ROLE ;

-- Grant connect on database
GRANT CONNECT ON DATABASE popcornpicks TO ;

-- Grant usage on schema
GRANT USAGE ON SCHEMA authentication TO ;

-- Grant select on tables
GRANT SELECT ON ALL TABLES IN SCHEMA authentication TO ;

-- Add comment
COMMENT ON ROLE  IS 'Application role for authentication domain';
