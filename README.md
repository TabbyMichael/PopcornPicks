# PopcornPicks

A movie recommendation platform, structured as an enterprise-grade **Modular Monolith**:
one repository, one frontend, one backend, one PostgreSQL database - organised into
many independent modules that can each be extracted into a microservice later
**without rewriting the project**.

## Architecture at a glance

```
.
|-- apps/
|   |-- frontend/   React + TypeScript SPA (feature-based)    <- active
|   |-- backend/    Modular Monolith API (Express + TMDB proxy)  <- active
|   `-- admin/      Admin console (placeholder)
|-- packages/       shared ui / config / constants / utils / hooks / types / shared
|-- database/       PostgreSQL-first: schema, migrations, seeds,
|                   functions, triggers, views, materialized views, policies,
|                   extensions (pgvector, postgis, pg_trgm, pg_cron, pgmq, uuid)
|                   Platform modules (security, messaging, scheduler, vector, geospatial, audit, monitoring, performance, backup, restore)
|                   Domain modules (movies, users, authentication, watchlists, favorites, reviews, ratings, recommendations, search, notifications, analytics, administration, system)
|-- docker/         Complete Docker platform with compose files, images, scripts, monitoring, CI/CD
|-- docs/           architecture, api, database, deployment, decisions (ADRs), contributing
|-- scripts/        repo automation (placeholder)
`-- tools/          developer tooling (placeholder)
```

### Design decisions (see `docs/decisions/`)

- **Modular Monolith over microservices** (ADR-0001)
- **PostgreSQL-first** single data store - no Redis / MongoDB / Elasticsearch / Kafka (ADR-0002)
- **All external APIs (TMDB, AI) are hidden behind the backend** (ADR-0003)
- **Feature-based frontend modules** with `@/` path aliases (ADR-0004)

## Prerequisites

- Node.js >= 18 & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A TMDB API key, used **only by the backend** (see `docs/tmdb-setup.md`)

## Getting started

### Development with Docker

```sh
# 1. Copy environment file
cp docker/configs/.env.example .env

# 2. Start all services (PostgreSQL, backend, frontend, admin)
docker/scripts/start.sh dev

# 3. Access services
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
# Admin: http://localhost:5174
# pgAdmin: http://localhost:5050 (optional)
```

### Development without Docker

```sh
# 1. Install dependencies (installs all apps/* and packages/* workspaces)
npm install

# 2. Configure + start the backend (http://localhost:4000)
cp apps/backend/.env.example apps/backend/.env   # then set TMDB_API_KEY
npm run dev:backend

# 3. Start the frontend dev server (http://localhost:8080)
npm run dev

# 4. Build the frontend
npm run build

# 5. Lint
npm run lint
```

> The frontend never talks to TMDB directly - all catalog data is served by the
> backend proxy at `/api/*` so the TMDB key stays server-side (ADR-0003).

## Tech stack (frontend)

Vite - React - TypeScript - react-router - TanStack Query - Tailwind CSS - shadcn/ui

## Documentation

- [Architecture](docs/architecture/README.md)
- [Database](docs/database/README.md)
- [API](docs/api/README.md)
- [Deployment](docs/deployment/README.md)
- [Architecture Decision Records](docs/decisions/README.md)
- [Contributing / conventions](docs/contributing/README.md)
