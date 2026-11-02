# Database Conventions

## Naming

- `snake_case` for all identifiers (tables, columns, functions, indexes, constraints)
- Singular table names (`movie`, not `movies`)
- Plural schema modules only when appropriate (e.g., `domains/` is a folder, not a schema)
- Clear, descriptive function names (`get_movie_by_id`, not `get_movie`)
- Descriptive constraint names (`fk_movie_genre_movie`, `chk_movie_release_year`)
- Consistent index names (`idx_movie_title_trgm`, `idx_movie_genre_movie_id`)

## Table Design

- UUID primary keys via `gen_random_uuid()` (pgcrypto)
- `citext` for case-insensitive text columns (e.g., email, username)
- JSONB only when relational modeling is inappropriate
- Normalized schemas
- Foreign keys with descriptive names
- CHECK constraints for domain validation
- NOT NULL by default; nullable only when justified
- Avoid duplicated data
- Generated columns where appropriate

## Indexes

- Composite indexes for multi-column query patterns
- Partial indexes for filtered subsets
- GIN indexes for full-text search (`tsvector`) and trigram (`pg_trgm`)
- GiST indexes for geospatial (PostGIS) and vector (pgvector)
- Consistent naming: `idx_<table>_<columns>`

## Functions

- Prefer SQL functions over PL/pgSQL
- PL/pgSQL only when procedural logic is required
- Functions must be small and single-responsibility
- Every function requires documentation, tests, and comments

## Procedures

- Long-running operations belong in procedures
- Examples: TMDB sync, recommendation cache refresh, materialized view refresh, archive, cleanup

## Triggers

- Use triggers sparingly
- Only for: audit, timestamps, derived aggregates, notifications
- Never hide business logic unnecessarily

## Security

- Row Level Security (RLS) on every table
- Every table defines SELECT, INSERT, UPDATE, DELETE policies
- Reusable security functions in `platform/security/`
- Roles defined per domain in `schema/roles/`
- Permissions granted per domain in `schema/permissions/`

## File Organization

- Each domain owns its complete vertical slice
- Files are numbered: `001_<name>.sql`, `002_<name>.sql`, ...
- Migrations are versioned: `001_<description>.sql`, `002_<description>.sql`, ...
- Rollback migrations mirror forward migrations