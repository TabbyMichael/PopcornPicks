-- ============================================================================
-- intarray uninstall.sql
-- Remove the intarray extension.
-- NOTE: Fails if dependent objects exist.
-- ============================================================================

DROP EXTENSION IF EXISTS intarray CASCADE;
