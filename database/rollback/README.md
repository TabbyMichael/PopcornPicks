# Rollback Migrations

Paired rollback migrations that reverse forward migrations.

## Convention

- `001_<description>.sql` mirrors `../migrations/001_<description>.sql`
- Each rollback reverses the corresponding forward migration

## Rules

- Rollbacks must be safe to run in reverse order.
- Rollbacks should be tested before deployment.
- Applied via `scripts/rollback.sh`.

## Example

```
001_drop_movie_audit_trigger.sql
002_drop_movie_search_index.sql
003_drop_movie_genre_table.sql
004_drop_genre_table.sql
005_drop_movie_table.sql
```
