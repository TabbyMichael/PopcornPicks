# Database Testing

## Overview

Every domain owns its SQL test suites in `domains/<capability>/tests/`. Tests cover functions, policies, constraints, views, indexes, performance, and security.

## Test Categories

| Category | Purpose | Location |
| --- | --- | --- |
| Functions | Verify function behavior, inputs, outputs, edge cases | `tests/test_<function>.sql` |
| Policies | Verify RLS policies enforce correct access | `tests/test_<policy>.sql` |
| Constraints | Verify CHECK, UNIQUE, FK constraints | `tests/test_<constraint>.sql` |
| Views | Verify view output and joins | `tests/test_<view>.sql` |
| Indexes | Verify index usage via `EXPLAIN` | `tests/test_<index>.sql` |
| Performance | Verify query plans, index usage, no seq scans | `tests/test_performance.sql` |
| Security | Verify RLS, role permissions, secret hashing | `tests/test_security.sql` |

## Test Framework

Tests use plain SQL with assertion-style checks. A lightweight test harness in `scripts/test.sh` runs each test file and reports pass/fail.

Example test structure:

```sql
-- test_movie_get_by_id.sql
BEGIN;

-- Setup
INSERT INTO movies.movie (id, title, release_year) VALUES (...);

-- Assert
SELECT plan(1);
SELECT is(
    (SELECT title FROM movies.get_movie_by_id('<uuid>')),
    'Expected Title',
    'get_movie_by_id returns correct title'
);

ROLLBACK;
```

## Running Tests

```bash
./scripts/test.sh
```

## Test Data

- `fixtures/` contains reusable test fixtures
- `seeds/` contains idempotent reference data
- Tests use transactions with `ROLLBACK` to avoid polluting the database

## Performance Testing

- Use `EXPLAIN ANALYZE` to verify index usage
- Assert no sequential scans on hot paths
- Verify composite indexes are used for multi-column queries
- Verify GIN indexes for full-text and trigram search
- Verify GiST indexes for geospatial and vector queries