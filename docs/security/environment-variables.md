# Environment Variables Management

## Overview

This document describes how environment variables are managed across the PopcornPicks project.

## File Structure

### `.env.example` (Template - Committed to Git)

This file serves as a template for required environment variables. It should contain placeholder values only.

**Location**: Root of project

**Example**:
```bash
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/popcornpicks

# TMDB API
TMDB_API_KEY=your_tmdb_api_key_here

# JWT
JWT_SECRET=your_jwt_secret_here

# Frontend
VITE_API_URL=http://localhost:3001
```

### `.env.local` (Local Development - Gitignored)

This file contains actual values for local development. Never commit this file.

**Location**: Root of project (or per app directory)

**Example**:
```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://popcornpicks:dev_password@localhost:5432/popcornpicks_dev
TMDB_API_KEY=702fa7f8bb878164af3765a2d83aeb6f
JWT_SECRET=abc123def456
VITE_API_URL=http://localhost:3001
```

### `.env.production` (Production - Gitignored)

This file contains production values. Never commit this file. In production, these should be set in the deployment platform's environment variable management.

**Location**: Root of project (or deployment platform)

**Example**:
```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:secure_password@prod-db:5432/popcornpicks
TMDB_API_KEY=production_api_key
JWT_SECRET=production_jwt_secret
VITE_API_URL=https://api.popcornpicks.com
```

## Required Environment Variables

### Backend Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Application environment | `development`, `production` |
| `PORT` | Yes | Server port | `3001` |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `TMDB_API_KEY` | Yes | TMDB API key | Get from TMDB settings |
| `JWT_SECRET` | Yes | JWT signing secret | Random 32+ character string |

### Frontend Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `http://localhost:3001` |
| `VITE_TMDB_API_KEY` | No | TMDB API key (temporary, will be removed) | Get from TMDB settings |

## Accessing Environment Variables

### Frontend (Vite)

Variables prefixed with `VITE_` are available in client-side code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;
```

### Backend (Node.js)

Variables are available via `process.env`:

```typescript
const port = process.env.PORT || 3001;
const dbUrl = process.env.DATABASE_URL;
```

## Environment-Specific Configuration

### Development

**Setup**:
1. Copy `.env.example` to `.env.local`
2. Fill in actual values
3. Do not commit `.env.local`

**Database**:
- Use local PostgreSQL or Docker
- Use development database name
- Use development credentials

**API Keys**:
- Use development API keys when available
- Otherwise use production keys (with caution)

### Production

**Setup**:
1. Set environment variables in deployment platform
2. Do not commit `.env.production`
3. Use strong, unique secrets

**Database**:
- Use managed PostgreSQL service
- Use production database name
- Use strong, unique credentials
- Enable SSL/TLS

**API Keys**:
- Use production API keys
- Rotate regularly
- Monitor usage

### Testing

**Setup**:
1. Create `.env.test.local`
2. Use test database
3. Use test API keys (if available)

**Database**:
- Use separate test database
- Reset between test runs
- Use test data fixtures

## Git Ignore Configuration

Ensure `.gitignore` includes:

```
# Environment
.env
.env.local
.env.*.local
.env.production
.env.development
.env.test
```

## Security Best Practices

1. **Never commit `.env` files**
   - All `.env` files except `.env.example` must be gitignored
   - Use `.env.example` as template only

2. **Use strong secrets**
   - JWT secrets: 32+ random characters
   - Database passwords: 16+ random characters
   - API keys: Rotate regularly

3. **Limit exposure**
   - Frontend: Only expose `VITE_` prefixed variables
   - Backend: Never log environment variables
   - Production: Use secret management services

4. **Regular rotation**
   - API keys: Quarterly
   - Database credentials: Quarterly
   - JWT secrets: Annually

5. **Audit regularly**
   - Review environment variable usage
   - Remove unused variables
   - Update documentation

## Validation

### Backend Validation

Use Zod to validate environment variables on startup:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
  TMDB_API_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32)
});

const env = envSchema.parse(process.env);
```

### Frontend Validation

Check for required variables:

```typescript
const requiredEnvVars = ['VITE_API_URL'];
const missing = requiredEnvVars.filter(
  var => !import.meta.env[var]
);

if (missing.length > 0) {
  throw new Error(`Missing env vars: ${missing.join(', ')}`);
}
```

## Migration Guide

### Adding New Environment Variables

1. Add to `.env.example` with placeholder
2. Add to environment variable documentation
3. Add validation if backend variable
4. Update all deployment configurations
5. Test in all environments

### Removing Environment Variables

1. Remove from `.env.example`
2. Remove from code
3. Remove from documentation
4. Remove from deployment configurations
5. Test in all environments

## Troubleshooting

### Variables Not Loading

**Frontend**:
- Check prefix is `VITE_`
- Restart dev server
- Check `.env.local` exists in correct location

**Backend**:
- Check variable name matches exactly
- Check `.env.local` is loaded
- Check spelling/case sensitivity

### Variables in Wrong Environment

**Issue**: Development variables in production

**Solution**:
- Check deployment platform configuration
- Verify `.env` files are gitignored
- Use environment-specific files

### Secrets Exposed

**Issue**: Secrets committed to Git

**Solution**:
- Immediately rotate compromised secrets
- Remove from Git history (see security policy)
- Update `.gitignore`
- Review commit history for other secrets

## Documentation

Keep this document updated:
- When adding new variables
- When removing variables
- When changing variable requirements
- When updating deployment process

---

**Last Updated**: 2024-08-07
