-- ============================================================================
-- hstore uninstall.sql
-- Remove the hstore extension.
-- NOTE: Fails if dependent objects exist.
-- ============================================================================

DROP EXTENSION IF EXISTS hstore CASCADE;
