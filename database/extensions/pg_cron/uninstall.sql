-- ============================================================================
-- pg_cron uninstall.sql
-- Remove the pg_cron extension.
-- NOTE: Fails if scheduled jobs exist.
-- ============================================================================

DROP EXTENSION IF EXISTS pg_cron CASCADE;