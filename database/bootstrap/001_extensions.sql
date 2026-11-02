-- ============================================================================
-- 001_extensions.sql
-- Install all supported extensions.
-- Each extension has its own install/configuration/uninstall in extensions/.
-- ============================================================================

-- Core extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;          -- Hashing, encryption, gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;            -- Case-insensitive text
CREATE EXTENSION IF NOT EXISTS hstore;            -- Key-value storage
CREATE EXTENSION IF NOT EXISTS ltree;             -- Hierarchical data
CREATE EXTENSION IF NOT EXISTS intarray;          -- Integer array operations
CREATE EXTENSION IF NOT EXISTS tablefunc;         -- Crosstab / pivot analytics

-- Index extensions
CREATE EXTENSION IF NOT EXISTS btree_gin;         -- Composite GIN indexes
CREATE EXTENSION IF NOT EXISTS btree_gist;        -- Composite GiST indexes

-- Search extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;           -- Fuzzy text search, trigram indexes

-- Vector search
CREATE EXTENSION IF NOT EXISTS vector;            -- pgvector: embeddings, nearest-neighbour

-- Geospatial
CREATE EXTENSION IF NOT EXISTS postgis;           -- PostGIS: geospatial queries

-- Scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;           -- Scheduled jobs

-- Messaging
CREATE EXTENSION IF NOT EXISTS pgmq;              -- Message queues

-- Monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements; -- Query performance monitoring

-- Configuration is applied per-extension in extensions/<name>/configuration.sql.
-- See extensions/README.md for details.