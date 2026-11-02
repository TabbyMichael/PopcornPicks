-- Example role for ratings domain
-- Replace with actual role definitions

-- Create application role
CREATE ROLE ;

-- Grant connect on database
GRANT CONNECT ON DATABASE popcornpicks TO ;

-- Grant usage on schema
GRANT USAGE ON SCHEMA ratings TO ;

-- Grant select on tables
GRANT SELECT ON ALL TABLES IN SCHEMA ratings TO ;

-- Add comment
COMMENT ON ROLE  IS 'Application role for ratings domain';
