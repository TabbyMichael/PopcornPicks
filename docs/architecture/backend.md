# Backend Architecture

The backend is a **modular monolith** in `apps/backend`: one process, one PostgreSQL
database, many bounded-context modules. Any module can be extracted into a service
later without rewriting the schema or its public surface. It implements
[ADR-0001 (modular monolith)](../decisions/0001-modular-monolith.md),
[ADR-0002 (PostgreSQL-first)](../decisions/0002-postgresql-first.md) and
[ADR-0003 (backend hides external APIs)](../decisions/0003-backend-hides-external-apis.md).

## Runtime & tooling

- **Node + Express 4**, authored as **ESM** with NodeNext-style `./foo.js` import
  specifiers that resolve to `./foo.ts` sources.
- **`tsx`** runs the code directly in dev (`npm run dev`) and start (`npm run start`);
  **`tsc -p tsconfig.build.json`** emits the production build to `dist/`.
- Type-only shared contracts come from the `@popcornpicks/types` workspace.

## Directory layout (`apps/backend/src`)

```
src/
├── main.ts        # process entrypoint - the ONLY place that opens a listening socket
├── bootstrap/     # createApp(): express wiring, CORS, routers, /health, error middleware
├── common/        # typed AppError subclasses + asyncRoute/parse* helpers
├── config/        # env loading + typed `config` object, assertConfig()
├── db/            # singleton pg Pool + query()/pingDatabase()/closePool()
└── modules/       # one folder per bounded context (see below)
```

`createApp()` is exported **without** a start side-effect so tests can build the app
and drive it with supertest; `main.ts` imports `startServer()` and calls it.

## Modules & the public-API rule

Modules: `movies`, `shows`, `search`, `tmdb`, `auth`, `watchlists`, plus scaffolded
contexts (`users`, `reviews`, `ratings`, `recommendations`, `notifications`,
`analytics`, `admin`, `ai`).

**Cross-module imports go only through a module's barrel `index.ts`.** Reaching into
another module's `services/`, `controllers/`, etc. is forbidden and is enforced in CI
by dependency-cruiser:

```
apps/backend/.dependency-cruiser.cjs   # rule: no-cross-module-deep-import (error)
npm run lint:boundaries                # fails the build on a violation
```

Each module keeps the same internal folders (`controllers/ services/ repositories/
validators/ dto/ entities/ events/ jobs/ tests/`); only the barrel is public.

## Data normalization (ADR-0003)

The `tmdb` module is the **only** place that knows TMDB's snake_case contract. It maps
raw TMDB JSON into the typed camelCase DTOs exported from `@popcornpicks/types`
(`Movie`, `Show`, `TitlePage`, `MovieDetails`, `Credit`, `Video`, `Genre`). The old raw
`/api/proxy` passthrough has been deleted; the frontend consumes normalized
`/api/movies/*` and `/api/search` endpoints exclusively, and the TMDB API key never
leaves the server.

## Typed errors

`common/` defines `AppError` (base, carries `status`) with `ValidationError` (400),
`UnauthorizedError` (401), `ConflictError` (409), `NotFoundError` (404) and
`UpstreamError` (502). Services **throw classes**, never status strings; the central
error handler in `bootstrap` maps `instanceof AppError` to the HTTP status and returns
`{ error: message }`. Non-`AppError` failures log and return a generic 500.

## Database

PostgreSQL via a single lazy `pg` pool (`src/db`). Schema changes are versioned
`node-pg-migrate` migrations under `database/migrations`. See
[docs/database](../database/README.md) for the applied tables and tooling.

## Auth

Email + password. Passwords are hashed with Node's built-in **`scrypt`** (no bcrypt
dependency, self-describing `scrypt$<salt>$<hash>` format) and sessions are stateless
**JWTs** (`jsonwebtoken`, `JWT_SECRET`). `requireAuth` guards protected routes and is
reused by the `watchlists` module.

## Environment variables

Copy `apps/backend/.env.example` to `.env`. `assertConfig()` fails fast if `TMDB_API_KEY`
is missing. The DB/JWT-dependent modules only connect when actually exercised.

| Variable             | Required | Default                            | Used by                                   |
| -------------------- | -------- | ---------------------------------- | ----------------------------------------- |
| `PORT`               | no       | `4000`                             | `main.ts` listen port                     |
| `TMDB_API_KEY`       | **yes**  | _(none - startup fails)_           | `tmdb` service upstream calls             |
| `TMDB_BASE_URL`      | no       | `https://api.themoviedb.org/3`     | `tmdb` service                            |
| `TMDB_IMAGE_BASE_URL`| no       | `https://image.tmdb.org/t/p`       | `tmdb` image URL builder                  |
| `DATABASE_URL`       | for DB   | _(none)_                           | `db` pool - auth & watchlist modules      |
| `JWT_SECRET`         | for auth | _(none - signing throws)_          | `auth` service token sign/verify          |
| `JWT_EXPIRES_IN`     | no       | `7d`                               | `auth` service                            |
| `ALLOWED_ORIGINS`    | no       | `http://localhost:8080`            | CORS whitelist (comma-separated)          |

`DATABASE_URL` points at the Docker Postgres (host port **5433** to coexist with a
local Postgres on 5432): `postgres://popcornpicks:popcornpicks@localhost:5433/popcornpicks`.

## Quality gates

- `npm run typecheck` - `tsc` over `src`, `tests` and the vitest config.
- `npm run lint` - ESLint flat config built on the shared `@popcornpicks/config/eslint`.
- `npm run lint:boundaries` - dependency-cruiser public-API discipline check.
- `npm test` - **Vitest** suite: TMDB normalization (mocked `fetch`), auth crypto,
  watchlist validators, common parsers/errors, and supertest HTTP tests against
  `createApp()`.
- CI (`.github/workflows/ci.yml`) runs typecheck → lint → boundaries → build → test for
  the backend, and lint → build for the frontend.
