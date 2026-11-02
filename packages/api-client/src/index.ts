// @popcornpicks/api-client - typed client for the PopcornPicks backend API.
// ADR-0003: every data request goes through our own API, never TMDB directly.
import type {
  AuthResponse,
  AuthUser,
  Credit,
  Genre,
  LoginRequest,
  RegisterRequest,
  Movie,
  MovieDetails,
  Show,
  Title,
  TitlePage,
  Video,
  WatchlistEntry,
  WatchlistItem,
} from '@popcornpicks/types';

const DEFAULT_API_BASE = 'http://localhost:4000';

function resolveApiBase(): string {
  // Vite replaces import.meta.env in apps; fallback keeps the package usable in plain Node too.
  const viteEnv = (import.meta as { env?: Record<string, string | undefined> }).env;
  const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  // `VITE_API_URL=` (empty) is a legitimate value meaning "same origin, use
  // the dev-server proxy", so we check for undefined rather than nullish.
  if (viteEnv && 'VITE_API_URL' in viteEnv) return viteEnv.VITE_API_URL ?? '';
  if (nodeEnv && 'API_URL' in nodeEnv) return nodeEnv.API_URL ?? '';
  return DEFAULT_API_BASE;
}

/** Error carrying the HTTP status so callers can branch (e.g. 401 -> logout). */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { params?: Record<string, string>; method?: string; body?: unknown; token?: string } = {},
): Promise<T> {
  const base = resolveApiBase();
  // When base is empty/relative (dev proxy mode) resolve against the browser
  // origin so `new URL()` works; in plain Node the base is always absolute.
  const browserOrigin = (globalThis as { location?: { origin?: string } }).location?.origin;
  const url = new URL(
    `${base}${path}`,
    base.startsWith('http') ? undefined : (browserOrigin ?? DEFAULT_API_BASE),
  );
  for (const [key, value] of Object.entries(options.params ?? {})) {
    url.searchParams.set(key, value);
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) return undefined as T;
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(
      body?.error ?? `API error: ${response.status} ${response.statusText}`,
      response.status,
    );
  }
  return (await response.json()) as T;
}

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  return request<T>(path, { params });
}

const pageParams = (extra: Record<string, string> = {}, page = 1) => ({
  ...extra,
  page: String(page),
});

export const catalogApi = {
  movies: {
    trending: (window: 'day' | 'week' = 'week') =>
      get<TitlePage<Movie>>('/api/movies/trending', { window }),
    popular: (page = 1) => get<TitlePage<Movie>>('/api/movies/popular', pageParams({}, page)),
    topRated: (page = 1) => get<TitlePage<Movie>>('/api/movies/top-rated', pageParams({}, page)),
    upcoming: (page = 1) => get<TitlePage<Movie>>('/api/movies/upcoming', pageParams({}, page)),
    search: (query: string, page = 1) =>
      get<TitlePage<Movie>>('/api/movies/search', pageParams({ q: query }, page)),
    genres: () => get<{ genres: Genre[] }>('/api/movies/genres'),
    byId: (id: number) => get<Movie>(`/api/movies/${id}`),
    // Normalized detail payloads (Task 17/20) - camelCase DTOs, no snake_case leaks.
    details: (id: number) => get<MovieDetails>(`/api/movies/${id}/details`),
    credits: (id: number) => get<{ credits: Credit[] }>(`/api/movies/${id}/credits`),
    videos: (id: number) => get<{ videos: Video[] }>(`/api/movies/${id}/videos`),
    similar: (id: number, page = 1) =>
      get<TitlePage<Movie>>(`/api/movies/${id}/similar`, pageParams({}, page)),
    recommendations: (id: number, page = 1) =>
      get<TitlePage<Movie>>(`/api/movies/${id}/recommendations`, pageParams({}, page)),
  },
  shows: {
    trending: (window: 'day' | 'week' = 'week') =>
      get<TitlePage<Show>>('/api/shows/trending', { window }),
    popular: (page = 1) => get<TitlePage<Show>>('/api/shows/popular', pageParams({}, page)),
    topRated: (page = 1) => get<TitlePage<Show>>('/api/shows/top-rated', pageParams({}, page)),
    search: (query: string, page = 1) =>
      get<TitlePage<Show>>('/api/shows/search', pageParams({ q: query }, page)),
    byId: (id: number) => get<Show>(`/api/shows/${id}`),
  },
  search: {
    all: (query: string, page = 1) =>
      get<TitlePage<Title>>('/api/search', pageParams({ q: query }, page)),
    movies: (query: string, page = 1) =>
      get<TitlePage<Movie>>('/api/search/movies', pageParams({ q: query }, page)),
    shows: (query: string, page = 1) =>
      get<TitlePage<Show>>('/api/search/shows', pageParams({ q: query }, page)),
  },
};

export const authApi = {
  register: (body: RegisterRequest) =>
    request<AuthResponse>('/api/auth/register', { method: 'POST', body }),
  login: (body: LoginRequest) =>
    request<AuthResponse>('/api/auth/login', { method: 'POST', body }),
  me: (token: string) => request<{ user: AuthUser }>('/api/auth/me', { token }),
};

export const watchlistApi = {
  list: (token: string) =>
    request<{ items: WatchlistItem[] }>('/api/watchlists/items', { token }),
  add: (token: string, entry: WatchlistEntry) =>
    request<WatchlistItem>('/api/watchlists/items', { method: 'POST', body: entry, token }),
  remove: (token: string, tmdbId: number, kind: 'movie' | 'series') =>
    request<void>(`/api/watchlists/items/${tmdbId}`, {
      method: 'DELETE',
      params: { kind },
      token,
    }),
};
