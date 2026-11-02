-- ============================================================================
-- tablefunc uninstall.sql
-- Remove the tablefunc extension.
-- NOTE: Fails if dependent objects exist.
-- ============================================================================

DROP EXTENSION IF EXISTS tablefunc CASCADE;
