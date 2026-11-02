# Migrations

Versioned forward migrations. Each migration is a numbered SQL file applied in order.

## Convention

- `001_<description>.sql`
- `002_<description>.sql`
- ...

## Rules

- Migrations are forward-only. Rollback migrations live in `../rollback/`.
- Migrations must be idempotent where possible (`IF NOT EXISTS`).
- Each migration should be small and focused on one change.
- Migrations are applied via `scripts/apply.sh`.

## Example

```
001_create_movie_table.sql
002_create_genre_table.sql
003_create_movie_genre_table.sql
004_add_movie_search_index.sql
005_create_movie_audit_trigger.sql
```
