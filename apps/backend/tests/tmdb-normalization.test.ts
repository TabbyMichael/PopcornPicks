// tmdb service normalization - the single seam where TMDB's snake_case contract
// becomes our typed camelCase DTOs (ADR-0003). `fetch` is mocked so this runs in
// CI with no network and no real API key.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { config } from '../src/config/index.js';
import { NotFoundError, UpstreamError } from '../src/common/index.js';
import { tmdbService } from '../src/modules/tmdb/index.js';

// A minimal paged envelope mirroring TMDB's list shape.
function paged(results: unknown[], overrides: Record<string, unknown> = {}) {
  return {
    page: 1,
    total_pages: 1,
    total_results: results.length,
    results,
    ...overrides,
  };
}

const rawMovie = {
  id: 550,
  title: 'Fight Club',
  overview: 'A ticking-time-bomb insomniac.',
  poster_path: '/p1th01.png',
  backdrop_path: '/bg.png',
  release_date: '1999-10-15',
  vote_average: 8.4,
  vote_count: 25000,
  popularity: 61.2,
  original_language: 'en',
  genre_ids: [18, 53],
};

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

describe('tmdbService.getTrendingMovies', () => {
  it('normalizes the paged envelope into a TitlePage<Movie>', async () => {
    fetchMock.mockResolvedValue(mockJson(paged([rawMovie])));

    const result = await tmdbService.getTrendingMovies('week');

    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.totalResults).toBe(1);
    expect(result.results).toHaveLength(1);

    const movie = result.results[0];
    expect(movie.kind).toBe('movie');
    expect(movie.id).toBe(550);
    expect(movie.title).toBe('Fight Club');
    expect(movie.releaseDate).toBe('1999-10-15');
    expect(movie.voteAverage).toBe(8.4);
    expect(movie.genreIds).toEqual([18, 53]);
    // No snake_case leaks: TMDB keys must not survive onto the DTO.
    expect(movie).not.toHaveProperty('poster_path');
    expect(movie).not.toHaveProperty('vote_average');
    // Poster URL is built from the configured image base + size + path.
    expect(movie.posterUrl).toBe(`${config.tmdbImageBaseUrl}/w500/p1th01.png`);
    expect(movie.backdropUrl).toBe(`${config.tmdbImageBaseUrl}/original/bg.png`);
  });

  it('hits the trending path with the api_key from config', async () => {
    fetchMock.mockResolvedValue(mockJson(paged([])));
    await tmdbService.getTrendingMovies('day');

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain(`/trending/movie/day`);
    expect(url).toContain(`api_key=${config.tmdbApiKey}`);
  });
});

describe('tmdbService.getPopularMovies', () => {
  it('maps an array of raw titles and preserves pagination', async () => {
    fetchMock.mockResolvedValue(
      mockJson(paged([rawMovie], { page: 3, total_pages: 10, total_results: 200 })),
    );

    const result = await tmdbService.getPopularMovies(3);
    expect(result.page).toBe(3);
    expect(result.totalPages).toBe(10);
    expect(result.results[0].runtimeMinutes).toBeNull();
  });
});

describe('tmdbService.getMovieDetails', () => {
  it('maps detail fields + production companies + collection', async () => {
    const rawDetails = {
      ...rawMovie,
      runtime: 139,
      status: 'Released',
      tagline: 'Mischief. Mayhem. Soap.',
      budget: 63000000,
      revenue: 100853753,
      homepage: 'http://thefightclub.com',
      imdb_id: 'tt0137523',
      production_companies: [{ id: 508, name: 'Regency Enterprises', logo_path: '/logo.png' }],
      belongs_to_collection: {
        id: 1,
        name: 'Fight Club Collection',
        poster_path: '/c.jpg',
        backdrop_path: '/cb.jpg',
      },
    };
    fetchMock.mockResolvedValue(mockJson(rawDetails));

    const details = await tmdbService.getMovieDetails(550);
    expect(details.runtimeMinutes).toBe(139);
    expect(details.tagline).toBe('Mischief. Mayhem. Soap.');
    expect(details.budget).toBe(63000000);
    expect(details.imdbId).toBe('tt0137523');
    expect(details.productionCompanies[0].logoUrl).toBe(`${config.tmdbImageBaseUrl}/w185/logo.png`);
    expect(details.belongsToCollection?.posterUrl).toBe(`${config.tmdbImageBaseUrl}/w500/c.jpg`);
  });
});

describe('tmdbService.getMovieCredits', () => {
  it('concatenates cast then crew and maps to Credit[]', async () => {
    fetchMock.mockResolvedValue(
      mockJson({
        cast: [{ id: 1, name: 'Brad Pitt', character: 'Tyler', profile_path: '/b.jpg', popularity: 5, order: 0 }],
        crew: [{ id: 2, name: 'David Fincher', job: 'Director', department: 'Directing', profile_path: null }],
      }),
    );

    const credits = await tmdbService.getMovieCredits(550);
    expect(credits).toHaveLength(2);
    expect(credits[0]).toMatchObject({ name: 'Brad Pitt', character: 'Tyler', order: 0 });
    expect(credits[1]).toMatchObject({ name: 'David Fincher', job: 'Director', profileUrl: null });
  });
});

describe('tmdbService.getMovieVideos', () => {
  it('maps results into Video[] with publishedAt normalization', async () => {
    fetchMock.mockResolvedValue(
      mockJson({
        results: [
          { key: 'abc', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true, published_at: '2020-01-01' },
          { key: 'def', name: 'Teaser', site: 'YouTube', type: 'Teaser', official: false },
        ],
      }),
    );

    const videos = await tmdbService.getMovieVideos(550);
    expect(videos).toHaveLength(2);
    expect(videos[0]).toMatchObject({ key: 'abc', type: 'Trailer', official: true, publishedAt: '2020-01-01' });
    expect(videos[1].publishedAt).toBeNull();
  });
});

describe('error mapping', () => {
  it('turns a TMDB 404 into a NotFoundError', async () => {
    fetchMock.mockResolvedValue(mockJson({}, { status: 404, ok: false, statusText: 'Not Found' }));
    await expect(tmdbService.getMovieById(999999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('turns a non-OK response into an UpstreamError', async () => {
    fetchMock.mockResolvedValue(mockJson({}, { status: 500, ok: false, statusText: 'Server Error' }));
    await expect(tmdbService.getPopularMovies()).rejects.toBeInstanceOf(UpstreamError);
  });

  it('wraps a network failure as an UpstreamError', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'));
    await expect(tmdbService.getTopRatedMovies()).rejects.toBeInstanceOf(UpstreamError);
  });
});
