// @popcornpicks/types - shared contracts between backend, frontend and admin.
// One source of truth for the normalized catalog DTOs (ADR-0003: these are the
// shapes our API serves; TMDB's raw snake_case shape never leaks past the backend).

export interface Movie {
  id: number;
  kind: 'movie';
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  language: string;
  genreIds: number[];
  genres: { id: number; name: string }[];
  runtimeMinutes: number | null;
  status: string | null;
  /** True when TMDB reports at least one video (trailer/teaser) for this title. */
  hasTrailer: boolean;
}

export interface Show {
  id: number;
  kind: 'series';
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  language: string;
  genreIds: number[];
  genres: { id: number; name: string }[];
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  status: string | null;
  episodeRuntimeMinutes: number[] | null;
  /** True when TMDB reports at least one video (trailer/teaser) for this title. */
  hasTrailer: boolean;
}

export type Title = Movie | Show;

// ---- Normalized detail payloads (Task 17) - served by /api/movies/:id/* ----

export interface MovieDetails extends Movie {
  tagline: string | null;
  budget: number | null;
  revenue: number | null;
  homepage: string | null;
  imdbId: string | null;
  productionCompanies: { id: number; name: string; logoUrl: string | null }[];
  belongsToCollection: {
    id: number;
    name: string;
    posterUrl: string | null;
    backdropUrl: string | null;
  } | null;
}

export interface Credit {
  id: number;
  name: string;
  character: string | null;
  job: string | null;
  department: string | null;
  profileUrl: string | null;
  popularity: number;
  order: number | null;
}

export interface Video {
  key: string;
  name: string;
  site: string;
  type: 'Trailer' | 'Teaser' | string;
  official: boolean;
  publishedAt: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TitlePage<T> {
  page: number;
  totalPages: number;
  totalResults: number;
  results: T[];
}

// ---- Auth (JWT email+password, Task 14) ----

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ---- Watchlist (persisted slice, Task 15) ----

export type TitleKind = 'movie' | 'series';

export interface WatchlistItem {
  id: string;
  userId: string;
  tmdbId: number;
  kind: TitleKind;
  title: string;
  posterPath: string | null;
  // Display fields persisted so cards render correctly on any device.
  voteAverage: number;
  releaseDate: string;
  addedAt: string;
}

// Body accepted by POST /api/watchlists/items.
export interface WatchlistEntry {
  tmdbId: number;
  kind: TitleKind;
  title: string;
  posterPath?: string | null;
  voteAverage?: number;
  releaseDate?: string;
}
