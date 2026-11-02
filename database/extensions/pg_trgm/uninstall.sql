-- ============================================================================
-- pg_trgm uninstall.sql
-- Remove the pg_trgm extension.
-- NOTE: Fails if dependent objects (trigram indexes) exist.
-- ============================================================================

DROP EXTENSION IF EXISTS pg_trgm CASCADE;