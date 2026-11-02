# Database Architecture

## Overview

PopcornPicks treats PostgreSQL as a complete application platform. The database owns persistence, business rules, security, search, scheduling, messaging, analytics, vector search, geospatial queries, auditing, reporting, and background jobs. The application layer is a thin orchestration layer.

## Layering

```
┌─────────────────────────────────────────────┐
│  Application Layer (thin orchestration)     │
│  apps/backend, apps/frontend, apps/admin     │
├─────────────────────────────────────────────┤
│  Platform Layer (cross-cutting)             │
│  security, messaging, scheduler, audit,     │
│  vector, geospatial, monitoring, performance │
├─────────────────────────────────────────────┤
│  Domain Layer (business capabilities)       │
│  movies, users, authentication, watchlists,   │
│  favorites, reviews, ratings, recommendations│
│  search, notifications, analytics, admin,    │
│  system                                      │
├─────────────────────────────────────────────┤
│  Shared Layer (types, helpers, constants)    │
├─────────────────────────────────────────────┤
│  Extension Layer                             │
│  pgvector, postgis, pg_trgm, pg_cron, pgmq,  │
│  uuid-ossp, pgcrypto, citext, hstore,        │
│  btree_gin, btree_gist, tablefunc, ltree,    │
│  intarray, pg_stat_statements                │
└─────────────────────────────────────────────┘
```

## Domain-Driven Design

The database is organized by **business capability**, not by object type. Each domain owns its complete vertical slice: tables, constraints, indexes, functions, procedures, views, materialized views, triggers, policies, roles, permissions, queues, events, cron jobs, and tests.

This mirrors the frontend (`apps/frontend/src/features/`) and backend (`apps/backend/src/modules/`) organization, creating a consistent vertical-slice architecture across all three layers.

## Domain Map

| Domain | Responsibility |
| --- | --- |
| `movies` | Movie catalog, genres, actors, directors, collections, TMDB sync |
| `users` | User profiles, preferences, account data |
| `authentication` | Auth sessions, tokens, credentials, MFA |
| `watchlists` | User watchlists, list items |
| `favorites` | User favorites |
| `reviews` | User reviews, review moderation |
| `ratings` | User ratings, rating aggregates |
| `recommendations` | Recommendation engine, vector similarity, cache |
| `search` | Full-text search, trigram search, search indexes |
| `notifications` | Notifications, email queue, in-app alerts |
| `analytics` | Materialized views, rollups, reporting |
| `administration` | Admin roles, permissions, moderation, settings |
| `system` | System metadata, health, background jobs, TMDB import |

## Platform Layer

Cross-cutting infrastructure shared by all domains:

- **security/** — RLS helper functions, role definitions, permission grants
- **messaging/** — pgmq queue creation, LISTEN/NOTIFY channel definitions
- **scheduler/** — pg_cron job definitions (MV refresh, cleanup, TMDB sync, analytics)
- **audit/** — audit table template, audit trigger function, history table pattern
- **vector/** — embedding storage helpers, similarity search functions
- **geospatial/** — PostGIS helpers for cinemas, cities, countries, radius queries
- **monitoring/** — pg_stat_statements views, health check functions
- **performance/** — index maintenance, vacuum/analyze configuration
- **backup/** — backup procedures
- **restore/** — restore procedures

## Shared Layer

Reusable types, helpers, common functions, utilities, and constants used across domains.

## Extension Layer

Each extension is isolated in `extensions/<name>/` with `README.md`, `install.sql`, `configuration.sql`, and `uninstall.sql`. Extensions are installed during bootstrap (`bootstrap/001_extensions.sql`).

## Security Model

- Row Level Security (RLS) on every table
- SELECT / INSERT / UPDATE / DELETE policies per table
- Reusable security functions in `platform/security/`
- Roles defined per domain in `schema/roles/`
- Permissions granted per domain in `schema/permissions/`

## Messaging Model

- pgmq queues for async work (notifications, emails, recommendations, imports, background jobs)
- LISTEN/NOTIFY for real-time events
- No Redis, no Kafka, no RabbitMQ

## Scheduling Model

- pg_cron for scheduled jobs
- Materialized view refresh, cleanup, TMDB sync, analytics refresh

## Search Model

- Full-text search via `tsvector` / `tsquery`
- Fuzzy search via `pg_trgm`
- GIN indexes
- No Elasticsearch

## Vector Search Model

- pgvector for embeddings
- Nearest-neighbour queries
- Recommendation engine functions

## Geospatial Model

- PostGIS for geospatial data
- Countries, cities, cinemas
- Radius queries, bounding boxes, distance calculations, nearest neighbours

## Audit Model

- Audit tables per important entity
- Audit trigger functions
- History table pattern

## Testing

- SQL test suites per domain (`tests/`)
- Tests for functions, policies, constraints, views, indexes, performance, security
- See `docs/testing.md`