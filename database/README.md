# PopcornPicks Database Platform

PostgreSQL as an **application platform** — not merely a database.

This database owns persistence, business rules, security, search, scheduling, messaging, analytics, vector search, geospatial queries, auditing, reporting, and background jobs. The application layer is a thin orchestration layer over this platform.

## Architecture Philosophy

1. **PostgreSQL First** — Whenever PostgreSQL (or an official extension) can solve a problem, we use it. We do **not** introduce Redis, MongoDB, RabbitMQ, Kafka, Elasticsearch, Algolia, Pinecone, Weaviate, Qdrant, Meilisearch, InfluxDB, Neo4j, Consul, BullMQ, Celery, or Sidekiq.
2. **Domain-Driven Design** — The database is organized by **business capability**, not by object type. Each domain owns its tables, constraints, indexes, functions, procedures, views, triggers, policies, queues, events, cron jobs, and tests.
3. **Modular Monolith** — One database, many bounded contexts. Each domain can later be extracted into a standalone service without rewriting the schema.
4. **Security at the data layer** — Row Level Security (RLS) on every table. The database is the enforcement point, not the application.

## Supported Extensions

| Extension | Purpose |
| --- | --- |
| `pgvector` | Vector search, embeddings, nearest-neighbour |
| `postgis` | Geospatial queries, radius, bounding boxes, nearest neighbours |
| `pg_trgm` | Fuzzy text search, trigram indexes |
| `pg_cron` | Scheduled jobs (MV refresh, cleanup, TMDB sync, analytics) |
| `pgmq` | Message queues (notifications, emails, recommendations, imports, jobs) |
| `uuid-ossp` | UUID generation |
| `pgcrypto` | Hashing, encryption |
| `citext` | Case-insensitive text |
| `hstore` | Key-value storage (where relational modeling is inappropriate) |
| `btree_gin` | Composite GIN indexes |
| `btree_gist` | Composite GiST indexes |
| `tablefunc` | Crosstab / pivot analytics |
| `ltree` | Hierarchical data |
| `intarray` | Integer array operations |
| `pg_stat_statements` | Query performance monitoring |

Each extension lives in `extensions/<name>/` with `README.md`, `install.sql`, `configuration.sql`, `uninstall.sql`.

## Directory Structure

```
database/
├── README.md
├── docs/                    # architecture, conventions, naming, security, testing
├── bootstrap/               # 000_bootstrap.sql, 001_extensions.sql, 002_roles.sql, 003_schemas.sql
├── migrations/              # versioned forward migrations
├── rollback/                # paired rollback migrations
├── seeds/                   # idempotent reference data
├── fixtures/                # test fixtures
├── tests/                   # SQL test suites
├── scripts/                 # apply, rollback, seed, test, backup
├── extensions/               # per-extension setup (README, install, configuration, uninstall)
└── src/
    ├── platform/            # cross-cutting infrastructure (security, messaging, scheduler, audit, vector, geospatial, monitoring, performance, backup, restore)
    ├── shared/              # shared types, helpers, common functions, utilities, constants
    └── domains/             # business capabilities (DDD)
        ├── movies/
        ├── users/
        ├── authentication/
        ├── watchlists/
        ├── favorites/
        ├── reviews/
        ├── ratings/
        ├── recommendations/
        ├── search/
        ├── notifications/
        ├── analytics/
        ├── administration/
        └── system/
```

## Domain Ownership

Each domain owns its complete vertical slice:

```
domains/<capability>/
├── README.md
├── docs/                    # architecture.md, schema.md, security.md, functions.md, testing.md
├── schema/
│   ├── tables/              # 001_<table>.sql
│   ├── constraints/         # 001_<constraint>.sql
│   ├── indexes/             # 001_<index>.sql
│   ├── functions/           # 001_<function>.sql
│   ├── procedures/          # 001_<procedure>.sql
│   ├── views/               # 001_<view>.sql
│   ├── materialized_views/  # 001_<mv>.sql
│   ├── triggers/            # 001_<trigger>.sql
│   ├── policies/            # 001_<policy>.sql
│   ├── roles/               # 001_<role>.sql
│   └── permissions/         # 001_<grant>.sql
├── queues/                  # pgmq queue definitions
├── events/                  # NOTIFY event definitions
├── cron/                    # pg_cron job definitions
└── tests/                   # domain-specific SQL tests
```

## Design Rules

- UUID primary keys (`gen_random_uuid()`)
- `snake_case` naming
- `citext` for case-insensitive text columns
- JSONB only where relational modeling is inappropriate
- Foreign keys, CHECK constraints, NOT NULL by default
- Composite, partial, GIN, GiST indexes
- Generated columns where appropriate
- RLS on every table (SELECT / INSERT / UPDATE / DELETE policies)
- SQL functions preferred; PL/pgSQL only for procedural logic
- Functions are small, single-responsibility, documented, and tested

## Usage

Migrations and seeds are applied via `scripts/apply.sh` and `scripts/seed.sh`.
See `docs/architecture.md` for the full architectural rationale.