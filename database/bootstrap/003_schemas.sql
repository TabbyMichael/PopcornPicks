-- ============================================================================
-- 003_schemas.sql
-- Create all domain, platform, and shared schemas.
-- ============================================================================

-- Shared schema
CREATE SCHEMA IF NOT EXISTS shared;

-- Platform schemas
CREATE SCHEMA IF NOT EXISTS platform_security;
CREATE SCHEMA IF NOT EXISTS platform_messaging;
CREATE SCHEMA IF NOT EXISTS platform_scheduler;
CREATE SCHEMA IF NOT EXISTS platform_audit;
CREATE SCHEMA IF NOT EXISTS platform_vector;
CREATE SCHEMA IF NOT EXISTS platform_geospatial;
CREATE SCHEMA IF NOT EXISTS platform_monitoring;
CREATE SCHEMA IF NOT EXISTS platform_performance;
CREATE SCHEMA IF NOT EXISTS platform_backup;
CREATE SCHEMA IF NOT EXISTS platform_restore;

-- Domain schemas
CREATE SCHEMA IF NOT EXISTS movies;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS authentication;
CREATE SCHEMA IF NOT EXISTS watchlists;
CREATE SCHEMA IF NOT EXISTS favorites;
CREATE SCHEMA IF NOT EXISTS reviews;
CREATE SCHEMA IF NOT EXISTS ratings;
CREATE SCHEMA IF NOT EXISTS recommendations;
CREATE SCHEMA IF NOT EXISTS search;
CREATE SCHEMA IF NOT EXISTS notifications;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS administration;
CREATE SCHEMA IF NOT EXISTS system;

-- Schema ownership and permissions are defined per-domain in schema/permissions/.
-- See src/domains/<capability>/schema/permissions/.