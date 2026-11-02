-- ============================================================================
-- pgvector uninstall.sql
-- Remove the pgvector extension.
-- NOTE: Fails if dependent objects (vector columns, indexes) exist.
-- ============================================================================

DROP EXTENSION IF EXISTS vector CASCADE;