// db - PostgreSQL access foundation (ADR-0002: PostgreSQL-first).
// One shared connection pool for the whole monolith; modules use query().
import { Pool, type QueryResult, type QueryResultRow } from 'pg';
import { config } from '../config/index.js';

let pool: Pool | null = null;

/** Returns the singleton pool, creating it on first use. Throws when unset. */
export function getPool(): Pool {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is not configured - database modules are unavailable.');
  }
  if (!pool) {
    pool = new Pool({ connectionString: config.databaseUrl, max: 10 });
  }
  return pool;
}

/** Runs a single parameterized query against the shared pool. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: readonly unknown[] = [],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params as unknown[]);
}

/** True when a SELECT 1 succeeds against the configured database. */
export async function pingDatabase(): Promise<boolean> {
  if (!config.databaseUrl) return false;
  try {
    await query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

/** Closes the pool - called on graceful shutdown. */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
