// Config - environment loading and typed app configuration.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Minimal .env loader so we avoid pulling in dotenv for now. */
function loadDotEnv(): void {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  tmdbApiKey: process.env.TMDB_API_KEY ?? '',
  tmdbBaseUrl: process.env.TMDB_BASE_URL ?? 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: process.env.TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p',
  // Postgres connection (optional until db-backed modules are used).
  databaseUrl: process.env.DATABASE_URL ?? '',
  // JWT signing secret for the auth module (Task 14).
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  // Comma-separated origin whitelist for CORS (frontend dev server by default).
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:8080')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};

export function assertConfig(): void {
  if (!config.tmdbApiKey) {
    throw new Error(
      'TMDB_API_KEY is not set. Copy apps/backend/.env.example to .env and add your key.',
    );
  }
}
