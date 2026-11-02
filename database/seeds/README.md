# Seeds

Idempotent reference data. Seeds populate lookup tables and reference data that the application depends on.

## Convention

- `001_<name>.sql`
- `002_<name>.sql`
- ...

## Rules

- Seeds must be idempotent (`ON CONFLICT DO NOTHING` or `ON CONFLICT DO UPDATE`).
- Seeds are applied via `scripts/seed.sh`.
- Seeds are safe to re-run.

## Example

```
001_seed_genres.sql
002_seed_countries.sql
003_seed_cities.sql
004_seed_roles.sql
005_seed_permissions.sql
```
