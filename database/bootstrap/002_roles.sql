-- ============================================================================
-- 002_roles.sql
-- Create application roles.
-- Roles are the foundation of Row Level Security and least-privilege access.
-- ============================================================================

-- Application roles
DO $$
BEGIN
    -- Anonymous role: public read-only access
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'role_app_anon') THEN
        CREATE ROLE role_app_anon NOLOGIN;
    END IF;

    -- Authenticated user role
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'role_app_user') THEN
        CREATE ROLE role_app_user NOLOGIN;
    END IF;

    -- Administrator role
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'role_app_admin') THEN
        CREATE ROLE role_app_admin NOLOGIN;
    END IF;

    -- Service-to-service role
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'role_app_service') THEN
        CREATE ROLE role_app_service NOLOGIN;
    END IF;

    -- Background worker role (pgmq consumers, pg_cron jobs)
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'role_app_worker') THEN
        CREATE ROLE role_app_worker NOLOGIN;
    END IF;
END $$;

-- Role hierarchy: admin inherits user; user inherits anon
GRANT role_app_anon TO role_app_user;
GRANT role_app_user TO role_app_admin;
GRANT role_app_user TO role_app_service;
GRANT role_app_user TO role_app_worker;

-- Domain-specific roles are defined in each domain's schema/roles/ folder.
-- See src/domains/<capability>/schema/roles/.