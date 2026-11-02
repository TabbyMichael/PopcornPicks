# Users Domain

User profiles, preferences, account data

This domain owns its complete vertical slice: tables, constraints, indexes, functions, procedures, views, materialized views, triggers, policies, roles, permissions, queues, events, cron jobs, and tests.

## Structure

- `docs/` — architecture, schema, security, functions, testing documentation
- `schema/tables/` — table definitions
- `schema/constraints/` — CHECK, UNIQUE, FK constraints
- `schema/indexes/` — composite, partial, GIN, GiST indexes
- `schema/functions/` — SQL/PLpgSQL functions
- `schema/procedures/` — long-running procedures
- `schema/views/` — read-model views
- `schema/materialized_views/` — cached aggregations
- `schema/triggers/` — audit, timestamp, derived aggregate triggers
- `schema/policies/` — RLS policies (SELECT/INSERT/UPDATE/DELETE)
- `schema/roles/` — domain-specific roles
- `schema/permissions/` — permission grants
- `queues/` — pgmq queue definitions
- `events/` — LISTEN/NOTIFY event definitions
- `cron/` — pg_cron job definitions
- `tests/` — domain-specific SQL tests
