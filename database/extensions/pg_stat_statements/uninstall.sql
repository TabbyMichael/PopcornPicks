-- ============================================================================
-- pg_stat_statements uninstall.sql
-- Remove the pg_stat_statements extension.
-- NOTE: Fails if dependent objects exist.
-- ============================================================================

DROP EXTENSION IF EXISTS pg_stat_statements CASCADE;
