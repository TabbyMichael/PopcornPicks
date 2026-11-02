# Database Security

## Overview

Security is enforced at the data layer. The database is the enforcement point, not the application. Every table uses Row Level Security (RLS) with SELECT, INSERT, UPDATE, and DELETE policies.

## Row Level Security

Every table must:

1. Enable RLS: `ALTER TABLE <schema>.<table> ENABLE ROW LEVEL SECURITY;`
2. Define a SELECT policy
3. Define an INSERT policy
4. Define an UPDATE policy
5. Define a DELETE policy

Policies are defined in each domain's `schema/policies/` folder.

## Roles

Roles are defined per domain in `schema/roles/`. Common roles:

| Role | Purpose |
| --- | --- |
| `role_app_user` | Authenticated application user |
| `role_app_admin` | Administrator |
| `role_app_service` | Service-to-service access |
| `role_app_anon` | Anonymous access (public data) |

## Reusable Security Functions

`platform/security/` provides reusable functions:

- `current_user_id()` — returns the current user's UUID from JWT/session claims
- `current_user_role()` — returns the current user's role
- `is_admin()` — checks if the current user is an administrator
- `is_owner(record_owner_id)` — checks if the current user owns a record

## Permissions

Permissions are granted per domain in `schema/permissions/`. Grants follow least-privilege:

- `GRANT SELECT, INSERT, UPDATE, DELETE ON <table> TO role_app_user;`
- `GRANT USAGE ON SCHEMA <domain> TO role_app_user;`
- `GRANT EXECUTE ON FUNCTION <fn> TO role_app_user;`

## Secrets

- Passwords hashed with `pgcrypto` (`crypt()` / `gen_salt('bf')`)
- API keys stored hashed
- Tokens stored hashed
- Never store plaintext secrets

## Encryption

- `pgcrypto` for hashing and encryption
- `pgcrypto` for `gen_random_uuid()` UUID generation

## Auditing

- Audit tables per important entity
- Audit trigger functions record who, what, when
- See `platform/audit/`