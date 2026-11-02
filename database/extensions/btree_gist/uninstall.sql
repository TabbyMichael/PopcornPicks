-- ============================================================================
-- btree_gist uninstall.sql
-- Remove the btree_gist extension.
-- NOTE: Fails if dependent objects exist.
-- ============================================================================

DROP EXTENSION IF EXISTS btree_gist CASCADE;
