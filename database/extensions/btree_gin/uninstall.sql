-- ============================================================================
-- btree_gin uninstall.sql
-- Remove the btree_gin extension.
-- NOTE: Fails if dependent objects exist.
-- ============================================================================

DROP EXTENSION IF EXISTS btree_gin CASCADE;
