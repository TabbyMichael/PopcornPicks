# Naming Conventions

## Identifiers

All database identifiers use `snake_case`.

| Object | Convention | Example |
| --- | --- | --- |
| Table | singular `snake_case` | `movie`, `user`, `review` |
| Column | `snake_case` | `release_year`, `created_at` |
| Primary key | `id` (UUID) | `id` |
| Foreign key | `<singular_table>_id` | `movie_id`, `user_id` |
| Index | `idx_<table>_<columns>` | `idx_movie_title_trgm` |
| Constraint (FK) | `fk_<table>_<referenced>` | `fk_review_movie` |
| Constraint (CHECK) | `chk_<table>_<rule>` | `chk_movie_release_year` |
| Constraint (UNIQUE) | `uq_<table>_<columns>` | `uq_user_email` |
| Constraint (PK) | `pk_<table>` | `pk_movie` |
| Function | `verb_<noun>_by_<criteria>` | `get_movie_by_id` |
| Procedure | `verb_<noun>` | `sync_tmdb`, `refresh_recommendations` |
| Trigger | `trg_<table>_<action>` | `trg_movie_audit` |
| View | `v_<name>` | `v_movie_with_ratings` |
| Materialized view | `mv_<name>` | `mv_movie_analytics` |
| Policy | `pol_<table>_<action>` | `pol_movie_select` |
| Role | `role_<name>` | `role_app_user`, `role_app_admin` |
| Queue | `q_<name>` | `q_notifications`, `q_emails` |
| Event channel | `evt_<name>` | `evt_movie_created` |
| Cron job | `job_<name>` | `job_refresh_mv_analytics` |

## Schema Naming

- Each domain owns a schema named after the domain: `movies`, `users`, `authentication`, etc.
- Platform schemas: `platform_security`, `platform_messaging`, `platform_audit`, etc.
- Shared schema: `shared`

## File Naming

- SQL files are numbered: `001_<name>.sql`, `002_<name>.sql`, ...
- Migrations: `001_<description>.sql`
- Rollback migrations: `001_<description>.sql` (mirroring forward)
- Tests: `test_<name>.sql`