-- ============================================================================
-- 000_bootstrap.sql
-- Bootstrap the database platform.
-- Creates the base infrastructure: extensions, roles, schemas.
-- This is the entry point for database initialization.
-- ============================================================================

-- Extensions are installed in 001_extensions.sql (isolated for clarity).
-- Roles are created in 002_roles.sql.
-- Schemas are created in 003_schemas.sql.

-- Ensure we are running as a superuser or a role with CREATEDB/CREATEROLE.
DO $$
BEGIN
    RAISE NOTICE 'Bootstrap started. Run 001_extensions.sql, 002_roles.sql, 003_schemas.sql in order.';
END $$;