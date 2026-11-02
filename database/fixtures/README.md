# Fixtures

Reusable test fixtures. Fixtures provide sample data for tests without polluting the database.

## Convention

- `001_<name>.sql`
- `002_<name>.sql`
- ...

## Rules

- Fixtures are loaded inside test transactions and rolled back.
- Fixtures must be deterministic (fixed UUIDs, fixed timestamps).
- Fixtures are used by `scripts/test.sh`.

## Example

```
001_fixture_movies.sql
002_fixture_users.sql
003_fixture_reviews.sql
004_fixture_ratings.sql
005_fixture_watchlists.sql
```
