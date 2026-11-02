// watchlists service - thin business layer over the repository. All access is
// scoped to the authenticated user id passed by the controller.
import type { WatchlistEntry, WatchlistItem } from '@popcornpicks/types';
import { NotFoundError } from '../../../common/index.js';
import { watchlistRepository } from '../repositories/index.js';

export const watchlistService = {
  list(userId: string): Promise<WatchlistItem[]> {
    return watchlistRepository.list(userId);
  },

  add(userId: string, entry: WatchlistEntry): Promise<WatchlistItem> {
    return watchlistRepository
      .add(userId, {
        tmdbId: entry.tmdbId,
        kind: entry.kind,
        title: entry.title,
        posterPath: entry.posterPath ?? null,
        voteAverage: entry.voteAverage ?? 0,
        releaseDate: entry.releaseDate ?? '',
      })
      .then((item) => {
        if (!item) throw new Error('Failed to add watchlist item.');
        return item;
      });
  },

  async remove(userId: string, tmdbId: number, kind: 'movie' | 'series'): Promise<void> {
    const removed = await watchlistRepository.remove(userId, tmdbId, kind);
    if (!removed) {
      throw new NotFoundError('That title is not in your watchlist.');
    }
  },
};
