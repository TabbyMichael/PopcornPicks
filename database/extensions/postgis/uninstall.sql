-- ============================================================================
-- postgis uninstall.sql
-- Remove the PostGIS extension.
-- NOTE: Fails if dependent objects (geometry columns, indexes) exist.
-- ============================================================================

DROP EXTENSION IF EXISTS postgis CASCADE;