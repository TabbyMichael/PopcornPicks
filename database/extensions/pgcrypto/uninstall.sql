-- ============================================================================
-- pgcrypto uninstall.sql
-- Remove the pgcrypto extension.
-- NOTE: Fails if dependent objects exist.
-- ============================================================================

DROP EXTENSION IF EXISTS pgcrypto CASCADE;
