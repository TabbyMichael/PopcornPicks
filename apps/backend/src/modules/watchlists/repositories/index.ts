// watchlists repository - SQL access to watchlist_items, always scoped by user.
import type { WatchlistItem } from '@popcornpicks/types';
import { query } from '../../../db/index.js';

interface WatchlistRow {
  id: string;
  user_id: string;
  tmdb_id: number;
  kind: 'movie' | 'series';
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  added_at: string;
}

function toWatchlistItem(row: WatchlistRow): WatchlistItem {
  return {
    id: row.id,
    userId: row.user_id,
    tmdbId: row.tmdb_id,
    kind: row.kind,
    title: row.title,
    posterPath: row.poster_path,
    voteAverage: row.vote_average,
    releaseDate: row.release_date,
    addedAt: row.added_at,
  };
}

export const watchlistRepository = {
  list(userId: string): Promise<WatchlistItem[]> {
    return query<WatchlistRow>(
      'SELECT * FROM watchlist_items WHERE user_id = $1 ORDER BY added_at DESC',
      [userId],
    ).then((r) => r.rows.map(toWatchlistItem));
  },

  /** Idempotent insert: existing (user,tmdb,kind) refreshes the stored display fields. */
  add(
    userId: string,
    entry: {
      tmdbId: number;
      kind: 'movie' | 'series';
      title: string;
      posterPath: string | null;
      voteAverage: number;
      releaseDate: string;
    },
  ): Promise<WatchlistItem | null> {
    return query<WatchlistRow>(
      `INSERT INTO watchlist_items
         (user_id, tmdb_id, kind, title, poster_path, vote_average, release_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, tmdb_id, kind) DO UPDATE
         SET title = EXCLUDED.title,
             poster_path = EXCLUDED.poster_path,
             vote_average = EXCLUDED.vote_average,
             release_date = EXCLUDED.release_date
       RETURNING *`,
      [
        userId,
        entry.tmdbId,
        entry.kind,
        entry.title,
        entry.posterPath,
        entry.voteAverage,
        entry.releaseDate,
      ],
    ).then((r) => (r.rows[0] ? toWatchlistItem(r.rows[0]) : null));
  },

  /** Deletes by tmdb_id + kind for the user; returns true if a row went away. */
  remove(userId: string, tmdbId: number, kind: 'movie' | 'series'): Promise<boolean> {
    return query(
      'DELETE FROM watchlist_items WHERE user_id = $1 AND tmdb_id = $2 AND kind = $3',
      [userId, tmdbId, kind],
    ).then((r) => r.rowCount !== null && r.rowCount > 0);
  },
};
