// tmdb service - the single place that knows TMDB's contract (ADR-0003).
// Exposes normalized Movie/Show DTOs (from @popcornpicks/types) to the rest of the backend.
import type {
  Credit,
  Genre,
  Movie,
  MovieDetails,
  Show,
  TitlePage,
  Video,
} from '@popcornpicks/types';
import { NotFoundError, UpstreamError } from '../../../common/index.js';
import { config } from '../../../config/index.js';

// Re-exported so module barrels keep their public type surface.
export type { Credit, Genre, Movie, MovieDetails, Show, TitlePage, Video };

interface TmdbRawTitle {
  id: number;
  title?: string; // movie
  name?: string; // tv
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string; // movie
  first_air_date?: string; // tv
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  popularity: number;
  original_language: string;
  adult?: boolean;
  original_title?: string;
  video?: boolean;
}

interface TmdbRawMovieDetails extends TmdbRawTitle {
  runtime: number | null;
  status: string;
  tagline: string | null;
  budget: number;
  revenue: number;
  homepage?: string | null;
  imdb_id?: string | null;
  production_companies?: { id: number; name: string; logo_path: string | null }[];
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
}

interface TmdbRawCredit {
  id: number;
  name: string;
  character?: string;
  job?: string;
  department?: string;
  profile_path: string | null;
  popularity: number;
  order?: number;
}

interface TmdbRawVideo {
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at?: string;
}

interface TmdbRawShowDetails extends TmdbRawTitle {
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  episode_run_time?: number[];
}

const IMAGE_SIZES = new Set(['w200', 'w500', 'original', 'w185']);

function imageUrl(path: string | null, size: string): string | null {
  if (!path) return null;
  const safeSize = IMAGE_SIZES.has(size) ? size : 'w500';
  return `${config.tmdbImageBaseUrl}/${safeSize}${path}`;
}

function baseFields(raw: TmdbRawTitle) {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? '',
    overview: raw.overview ?? '',
    posterUrl: imageUrl(raw.poster_path, 'w500'),
    backdropUrl: imageUrl(raw.backdrop_path, 'original'),
    releaseDate: raw.release_date ?? raw.first_air_date ?? '',
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    popularity: raw.popularity,
    language: raw.original_language,
    genreIds: raw.genre_ids ?? raw.genres?.map((g) => g.id) ?? [],
    genres: raw.genres ?? [],
    hasTrailer: raw.video === true,
  };
}

function mapMovie(raw: TmdbRawTitle | TmdbRawMovieDetails): Movie {
  const details = raw as TmdbRawMovieDetails;
  return {
    kind: 'movie',
    ...baseFields(raw),
    runtimeMinutes: details.runtime ?? null,
    status: details.status ?? null,
  };
}

function mapShow(raw: TmdbRawTitle | TmdbRawShowDetails): Show {
  const details = raw as TmdbRawShowDetails;
  return {
    kind: 'series',
    ...baseFields(raw),
    numberOfSeasons: details.number_of_seasons ?? null,
    numberOfEpisodes: details.number_of_episodes ?? null,
    status: details.status ?? null,
    episodeRuntimeMinutes: details.episode_run_time ?? null,
  };
}

function mapMovieDetails(raw: TmdbRawMovieDetails): MovieDetails {
  return {
    ...mapMovie(raw),
    tagline: raw.tagline ?? null,
    budget: raw.budget ?? null,
    revenue: raw.revenue ?? null,
    homepage: raw.homepage ?? null,
    imdbId: raw.imdb_id ?? null,
    productionCompanies: (raw.production_companies ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      logoUrl: imageUrl(c.logo_path, 'w185'),
    })),
    belongsToCollection: raw.belongs_to_collection
      ? {
          id: raw.belongs_to_collection.id,
          name: raw.belongs_to_collection.name,
          posterUrl: imageUrl(raw.belongs_to_collection.poster_path, 'w500'),
          backdropUrl: imageUrl(raw.belongs_to_collection.backdrop_path, 'w500'),
        }
      : null,
  };
}

function mapCredit(raw: TmdbRawCredit): Credit {
  return {
    id: raw.id,
    name: raw.name,
    character: raw.character ?? null,
    job: raw.job ?? null,
    department: raw.department ?? null,
    profileUrl: imageUrl(raw.profile_path, 'w185'),
    popularity: raw.popularity,
    order: raw.order ?? null,
  };
}

function mapVideo(raw: TmdbRawVideo): Video {
  return {
    key: raw.key,
    name: raw.name,
    site: raw.site,
    type: raw.type,
    official: raw.official,
    publishedAt: raw.published_at ?? null,
  };
}

interface TmdbPagedResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

async function tmdbGet<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${config.tmdbBaseUrl}${path}`);
  url.searchParams.set('api_key', config.tmdbApiKey);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (cause) {
    throw new UpstreamError(`TMDB request failed: ${path}`, { cause });
  }
  if (response.status === 404) {
    throw new NotFoundError(`Not found (TMDB): ${path}`);
  }
  if (!response.ok) {
    throw new UpstreamError(`TMDB request failed: ${response.status} ${response.statusText} (${path})`);
  }
  return (await response.json()) as T;
}

type Catalogue = 'movie' | 'tv';

async function listPage<T>(
  catalogue: Catalogue,
  path: string,
  params: Record<string, string | number>,
  map: (raw: TmdbRawTitle) => T,
): Promise<TitlePage<T>> {
  const data = await tmdbGet<TmdbPagedResponse<TmdbRawTitle>>(`/${catalogue}${path}`, params);
  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map((raw) => map(raw)),
  };
}

const movieList = (path: string, params: Record<string, string | number> = {}) =>
  listPage<Movie>('movie', path, params, mapMovie);
const showList = (path: string, params: Record<string, string | number> = {}) =>
  listPage<Show>('tv', path, params, mapShow);

// TMDB search lives at /search/{movie|tv}, a different shape than the list endpoints.
async function searchPage<T>(
  catalogue: Catalogue,
  query: string,
  page: number,
  map: (raw: TmdbRawTitle) => T,
): Promise<TitlePage<T>> {
  const data = await tmdbGet<TmdbPagedResponse<TmdbRawTitle>>(`/search/${catalogue}`, {
    query,
    page,
    include_adult: 'false',
  });
  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map((raw) => map(raw)),
  };
}

export const tmdbService = {
  // ---- Movies ----
  getTrendingMovies(window: 'day' | 'week' = 'week'): Promise<TitlePage<Movie>> {
    return tmdbGet<TmdbPagedResponse<TmdbRawTitle>>(`/trending/movie/${window}`).then(
      (data) => ({
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
        results: data.results.map(mapMovie),
      }),
    );
  },
  getPopularMovies: (page = 1) => movieList('/popular', { page }),
  getTopRatedMovies: (page = 1) => movieList('/top_rated', { page }),
  getUpcomingMovies: (page = 1) => movieList('/upcoming', { page }),
  searchMovies: (query: string, page = 1) => searchPage('movie', query, page, mapMovie),
  async getMovieById(id: number): Promise<Movie> {
    const data = await tmdbGet<TmdbRawMovieDetails>(`/movie/${id}`);
    return mapMovie(data);
  },

  // ---- Normalized detail endpoints (Task 17) - typed DTOs, no snake_case leaks ----
  async getMovieDetails(id: number): Promise<MovieDetails> {
    const data = await tmdbGet<TmdbRawMovieDetails>(`/movie/${id}`);
    return mapMovieDetails(data);
  },
  async getMovieCredits(id: number): Promise<Credit[]> {
    const data = await tmdbGet<{ cast?: TmdbRawCredit[]; crew?: TmdbRawCredit[] }>(
      `/movie/${id}/credits`,
    );
    // Cast first: `order` only exists on cast entries.
    return [...(data.cast ?? []), ...(data.crew ?? [])].map(mapCredit);
  },
  async getMovieVideos(id: number): Promise<Video[]> {
    const data = await tmdbGet<{ results?: TmdbRawVideo[] }>(`/movie/${id}/videos`);
    return (data.results ?? []).map(mapVideo);
  },
  getMovieSimilar(id: number, page = 1): Promise<TitlePage<Movie>> {
    return movieList(`/${id}/similar`, { page });
  },
  getMovieRecommendations(id: number, page = 1): Promise<TitlePage<Movie>> {
    return movieList(`/${id}/recommendations`, { page });
  },
  async getMovieGenres(): Promise<Genre[]> {
    const data = await tmdbGet<{ genres: Genre[] }>('/genre/movie/list');
    return data.genres;
  },

  // ---- Series (TV) ----
  getTrendingShows(window: 'day' | 'week' = 'week'): Promise<TitlePage<Show>> {
    return tmdbGet<TmdbPagedResponse<TmdbRawTitle>>(`/trending/tv/${window}`).then((data) => ({
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results: data.results.map(mapShow),
    }));
  },
  getPopularShows: (page = 1) => showList('/popular', { page }),
  getTopRatedShows: (page = 1) => showList('/top_rated', { page }),
  searchShows: (query: string, page = 1) => searchPage('tv', query, page, mapShow),
  async getShowById(id: number): Promise<Show> {
    const data = await tmdbGet<TmdbRawShowDetails>(`/tv/${id}`);
    return mapShow(data);
  },

  // ---- Combined search (movies + series in one call) ----
  async searchAll(query: string, page = 1): Promise<TitlePage<Movie | Show>> {
    const [movies, shows] = await Promise.all([
      this.searchMovies(query, page),
      this.searchShows(query, page),
    ]);
    const results = [...movies.results, ...shows.results].sort(
      (a, b) => b.popularity - a.popularity,
    );
    return {
      page,
      totalPages: Math.max(movies.totalPages, shows.totalPages),
      totalResults: movies.totalResults + shows.totalResults,
      results,
    };
  },
};
