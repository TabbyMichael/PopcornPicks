-- ============================================================================
-- ltree uninstall.sql
-- Remove the ltree extension.
-- NOTE: Fails if dependent objects exist.
-- ============================================================================

DROP EXTENSION IF EXISTS ltree CASCADE;
