# Database Tests

SQL test suites for the database platform. Tests cover functions, policies, constraints, views, indexes, performance, and security.

## Structure

- `test_functions.sql` — function behavior tests
- `test_policies.sql` — RLS policy tests
- `test_constraints.sql` — constraint tests
- `test_views.sql` — view tests
- `test_indexes.sql` — index usage tests
- `test_performance.sql` — query plan / performance tests
- `test_security.sql` — security and role tests

## Running Tests

```bash
./scripts/test.sh
```

## Rules

- Tests use transactions with ROLLBACK to avoid polluting the database.
- Tests must be deterministic.
- Fixtures in `../fixtures/` provide sample data.
- Domain-specific tests live in `src/domains/<capability>/tests/`.