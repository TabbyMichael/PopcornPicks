-- ============================================================================
-- citext uninstall.sql
-- Remove the citext extension.
-- NOTE: Fails if dependent objects exist.
-- ============================================================================

DROP EXTENSION IF EXISTS citext CASCADE;
