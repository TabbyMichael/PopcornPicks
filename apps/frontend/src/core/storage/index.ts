/**
 * core/storage - thin, typed wrapper over browser localStorage.
 * Only non-secret, client-safe values belong here (auth token, feature flags).
 */
const TOKEN_KEY = 'pp.auth.token';
const WATCHLIST_KEY = 'watchlist';

export const storage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable (SSR / private mode) - ignore */
    }
  },
  clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
  /** Reads a JSON value, returning the fallback when absent or malformed. */
  readJson<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  writeJson(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
};

export const WATCHLIST_STORAGE_KEY = WATCHLIST_KEY;
