-- ============================================================================
-- pgmq configuration.sql
-- Configure pgmq queues.
-- ============================================================================

-- Queues are created per-domain in src/domains/<capability>/queues/.
-- Example queue creation:
--   SELECT pgmq.create('q_notifications');
--   SELECT pgmq.create('q_emails');
--   SELECT pgmq.create('q_recommendations');
--   SELECT pgmq.create('q_imports');
--   SELECT pgmq.create('q_background_jobs');

-- Queue naming convention: q_<name>
-- See docs/naming.md for details.

-- Grant queue access to application roles:
--   GRANT USAGE ON SCHEMA pgmq TO role_app_user;
--   GRANT ALL ON ALL TABLES IN SCHEMA pgmq TO role_app_worker;