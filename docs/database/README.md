# Database

PostgreSQL-first (see [ADR-0002](../decisions/0002-postgresql-first.md)). Today the
backend runs on **one Postgres 16 instance** with a small, versioned schema applied
through **`node-pg-migrate`**. The long-term ambition (RLS everywhere, `pgvector`,
`pgmq`, `postgis`, per-domain slices under `database/src/domains/`) is described in
[`database/README.md`](../../database/README.md) and is **not yet built** - this page
documents what actually exists and runs.

## Running Postgres locally

Docker Compose at the repo root brings up the database:

```
docker compose up -d          # postgres:16-alpine, container "popcornpicks-db"
```

The container maps **host 5433 -> container 5432** so it coexists with a local Postgres
already on 5432. Point the backend at it:

```
DATABASE_URL=postgres://popcornpicks:popcornpicks@localhost:5433/popcornpicks
```

Credentials (`popcornpicks` / `popcornpicks`, db `popcornpicks`) come from
`docker-compose.yml`; a named volume `popcornpicks-pgdata` persists data.

## Migrations

Migrations live in `database/migrations` and are driven from the `@popcornpicks/backend`
workspace:

```
npm run db:migrate   -w @popcornpicks/backend   # node-pg-migrate up
npm run db:rollback  -w @popcornpicks/backend   # node-pg-migrate down
npm run db:seed      -w @popcornpicks/backend
```

### Applied schema

**`users`** (auth) - `id uuid PK (gen_random_uuid())`, `email text UNIQUE NOT NULL`,
`password_hash text NOT NULL`, `created_at timestamptz NOT NULL DEFAULT now()`. Emails
are normalized to lowercase in the auth service, so uniqueness is effectively
case-insensitive at the application layer.

**`watchlist_items`** - `id uuid PK`, `user_id uuid NOT NULL REFERENCES users(id) ON DELETE
CASCADE`, `tmdb_id integer NOT NULL`, `kind text NOT NULL`, `title text NOT NULL`,
`poster_path text`, `added_at timestamptz NOT NULL DEFAULT now()`, plus
`vote_average double precision NOT NULL DEFAULT 0` and `release_date text NOT NULL
DEFAULT ''` (added in `0002`). Constraints: `UNIQUE (user_id, tmdb_id, kind)` (idempotent
add), `CHECK (kind IN ('movie','series'))`, and an index on `user_id`.

| Migration | What it does |
| --- | --- |
| `0001_init-users-watchlist` | Creates `users` + `watchlist_items` with FK, unique, kind CHECK, and the `user_id` index. |
| `0002_watchlist-display-fields` | Adds `vote_average` and `release_date` so watchlist cards render consistently across devices. |

Design rules already followed: UUID primary keys via `gen_random_uuid()`, `snake_case`
columns, `timestamptz` defaults to `now()`, explicit FK/CHECK/UNIQUE constraints.

## Next step: make Postgres do the searching (`pg_trgm`)

Search currently round-trips to TMDB on every query (`search` -> `tmdb` module). The
planned improvement - deliberately **not built during the hardening work** - is to
cache titles locally and let Postgres serve fuzzy search:

1. Sync a slice of the catalogue into a local table (e.g. `titles(id, tmdb_id, kind,
   title, overview, ...)`) via a `pg_cron` job or on-demand upsert.
2. `CREATE EXTENSION IF NOT EXISTS pg_trgm;` and add a GIN trigram index
   (`CREATE INDEX ... USING gin (title gin_trgm_ops);`).
3. Serve typo-tolerant search from SQL (`similarity()` / `%` operator) and fall back to
   the TMDB round-trip only for cache misses.

This keeps the architecture PostgreSQL-first and turns the external API into a
synchronizing backend rather than a per-request dependency. It is tracked as future
work, not part of the current endpoints.
