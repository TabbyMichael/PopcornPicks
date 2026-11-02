// HTTP controller tests via supertest against createApp(). These exercise route
// wiring, input validation, the typed-error -> status mapping, and normalized
// JSON - all without a database or real TMDB (fetch is mocked). The bootstrap
// auto-start was moved to src/main.ts precisely so createApp() can be imported here.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { createApp } from '../src/bootstrap/index.js';

const app = createApp();

function mockJson(payload: unknown, init: { status?: number; ok?: boolean; statusText?: string } = {}) {
  const status = init.status ?? 200;
  return {
    ok: init.ok ?? (status >= 200 && status < 300),
    status,
    statusText: init.statusText ?? 'OK',
    json: async () => payload,
  } as unknown as Response;
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('GET /health', () => {
  it('responds 200 with an ok status and a db connectivity flag', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body.status).toBe('ok');
    // db reflects whether a reachable Postgres is configured - environment-dependent
    // ("ok" against Docker, "not-configured"/"down" in a DB-less CI), but never a crash.
    expect(['ok', 'not-configured']).toContain(res.body.db);
  });
});

describe('GET /api/movies/trending', () => {
  it('returns a normalized TitlePage (camelCase, no snake_case leaks)', async () => {
    fetchMock.mockResolvedValue(
      mockJson({
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [
          {
            id: 550,
            title: 'Fight Club',
            overview: 'x',
            poster_path: '/p.png',
            backdrop_path: null,
            release_date: '1999-10-15',
            vote_average: 8.4,
            vote_count: 1,
            popularity: 1,
            original_language: 'en',
            genre_ids: [18],
          },
        ],
      }),
    );

    const res = await request(app).get('/api/movies/trending').expect(200);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0]).toMatchObject({ id: 550, title: 'Fight Club', kind: 'movie', voteAverage: 8.4 });
    expect(res.body.results[0]).not.toHaveProperty('poster_path');
  });

  it('maps an upstream 500 to a 502 via the typed-error middleware', async () => {
    fetchMock.mockResolvedValue(mockJson({}, { status: 500, ok: false, statusText: 'Boom' }));
    const res = await request(app).get('/api/movies/trending').expect(502);
    expect(res.body).toHaveProperty('error');
  });

  it('maps a TMDB 404 to a 404', async () => {
    fetchMock.mockResolvedValue(mockJson({}, { status: 404, ok: false, statusText: 'No Peanuts' }));
    const res = await request(app).get('/api/movies/999999').expect(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('input validation (before any upstream call)', () => {
  it('rejects a non-numeric movie id with 400', async () => {
    const res = await request(app).get('/api/movies/not-a-number/details').expect(400);
    expect(res.body.error).toMatch(/invalid movie id/i);
  });

  it('requires a query for search', async () => {
    const res = await request(app).get('/api/movies/search').expect(400);
    expect(res.body.error).toMatch(/required/i);
    // fetch must never have been attempted for an invalid request.
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('auth guard + fallback 404', () => {
  it('returns 401 for watchlist routes without a bearer token', async () => {
    const res = await request(app).get('/api/watchlists/items').expect(401);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 401 (not 403) for a malformed bearer token', async () => {
    const res = await request(app)
      .get('/api/watchlists/items')
      .set('Authorization', 'Bearer garbage.token.value')
      .expect(401);
    expect(res.body).toHaveProperty('error');
  });

  it('falls through to the /api 404 handler for unknown API routes', async () => {
    const res = await request(app).get('/api/does-not-exist').expect(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});
