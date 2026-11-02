// watchlists validators - parse + check an incoming watchlist entry body.
import type { WatchlistEntry } from '@popcornpicks/types';
import { ValidationError } from '../../../common/index.js';

const KINDS = new Set(['movie', 'series']);

/** Validates a POST body into a WatchlistEntry; throws ValidationError otherwise. */
export function parseWatchlistEntry(raw: unknown): WatchlistEntry {
  const body = (raw ?? {}) as Record<string, unknown>;
  const tmdbId = Number(body.tmdbId);
  const kind = body.kind;
  const title = body.title;

  if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
    throw new ValidationError('"tmdbId" must be a positive integer.');
  }
  if (typeof kind !== 'string' || !KINDS.has(kind)) {
    throw new ValidationError('"kind" must be "movie" or "series".');
  }
  if (typeof title !== 'string' || !title.trim()) {
    throw new ValidationError('"title" is required.');
  }
  const posterPath =
    typeof body.posterPath === 'string' && body.posterPath ? body.posterPath : null;
  const voteAverage = Number.isFinite(Number(body.voteAverage)) ? Number(body.voteAverage) : 0;
  const releaseDate = typeof body.releaseDate === 'string' ? body.releaseDate : '';

  return {
    tmdbId,
    kind: kind as 'movie' | 'series',
    title: title.trim(),
    posterPath,
    voteAverage,
    releaseDate,
  };
}

/** Parses a tmdb_id route param, or throws ValidationError. */
export function parseTmdbId(raw: unknown): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('Invalid tmdb id.');
  }
  return id;
}
