-- ============================================================================
-- uuid-ossp uninstall.sql
-- Remove the uuid-ossp extension.
-- NOTE: Fails if dependent objects exist.
-- ============================================================================

DROP EXTENSION IF EXISTS uuid-ossp CASCADE;
