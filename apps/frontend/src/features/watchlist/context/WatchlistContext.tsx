import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { ApiError, watchlistApi } from '@popcornpicks/api-client';
import type { WatchlistItem } from '@popcornpicks/types';

import { storage } from '@/core/storage';
import { useAuth } from '@/features/authentication/context/AuthContext';

import { Movie } from '@/features/movies/components/MovieCard';

interface WatchlistContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

const LOCAL_WATCHLIST_KEY = 'watchlist';
const MERGE_FLAG_PREFIX = 'pp.watchlist.merged';

/** Maps a persisted backend item onto the legacy card shape consumers expect. */
function toMovie(item: WatchlistItem): Movie {
  return {
    id: item.tmdbId,
    title: item.title,
    poster_path: item.posterPath,
    backdrop_path: null,
    vote_average: item.voteAverage,
    release_date: item.releaseDate,
  };
}

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  const { status, token } = useAuth();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  // Keeps async callbacks from reading a stale token after logout.
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const isAuthed = status === 'authenticated' && !!token;

  // Load watchlist from localStorage on initial render (anonymous experience).
  useEffect(() => {
    if (isAuthed) return; // server state replaces local state once logged in
    const savedWatchlist = localStorage.getItem(LOCAL_WATCHLIST_KEY);
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Failed to parse watchlist from localStorage:', error);
        localStorage.removeItem(LOCAL_WATCHLIST_KEY);
      }
    }
  }, [isAuthed]);

  // Save watchlist to localStorage whenever it changes (anonymous experience).
  useEffect(() => {
    if (isAuthed) return;
    localStorage.setItem(LOCAL_WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist, isAuthed]);

  // Logged in: fetch the server watchlist, importing any local items once per account.
  useEffect(() => {
    if (!isAuthed || !token) return;
    let active = true;

    const mergeLocalItems = async (): Promise<boolean> => {
      // One-time import of the device's anonymous watchlist for this account.
      const flagKey = `${MERGE_FLAG_PREFIX}:${token}`;
      if (storage.readJson<boolean>(flagKey, false)) return false;
      const local = storage.readJson<Movie[]>(LOCAL_WATCHLIST_KEY, []);
      for (const movie of local) {
        try {
          await watchlistApi.add(token, {
            tmdbId: movie.id,
            kind: 'movie',
            title: movie.title,
            posterPath: movie.poster_path,
            voteAverage: movie.vote_average,
            releaseDate: movie.release_date,
          });
        } catch (err) {
          // Duplicate/conflict is fine - the server copy wins.
          console.warn('Watchlist import skipped one item:', err);
        }
      }
      storage.writeJson(flagKey, true);
      return local.length > 0;
    };

    const load = async () => {
      try {
        await mergeLocalItems();
        const res = await watchlistApi.list(token);
        if (active) setWatchlist(res.items.map(toMovie));
      } catch (err) {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) {
          // Expired/revoked token: fall back to local state; AuthContext clears it next boot.
          setWatchlist(storage.readJson<Movie[]>(LOCAL_WATCHLIST_KEY, []));
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [isAuthed, token]);

  /** Replaces local state with the server's view after a mutation. */
  const refresh = useCallback(async () => {
    const current = tokenRef.current;
    if (!current) return;
    try {
      const res = await watchlistApi.list(current);
      setWatchlist(res.items.map(toMovie));
    } catch {
      /* optimistic state stays; next load will reconcile */
    }
  }, []);

  const addToWatchlist = (movie: Movie) => {
    if (isAuthed && token) {
      // Optimistic insert; the server response reconciles the list.
      setWatchlist((prev) =>
        prev.some((item) => item.id === movie.id) ? prev : [...prev, movie],
      );
      void watchlistApi
        .add(token, {
          tmdbId: movie.id,
          kind: 'movie',
          title: movie.title,
          posterPath: movie.poster_path,
          voteAverage: movie.vote_average,
          releaseDate: movie.release_date,
        })
        .then(refresh)
        .catch(() => void refresh());
      return;
    }
    setWatchlist((prev) => {
      if (prev.some((item) => item.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    if (isAuthed && token) {
      setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
      void watchlistApi
        .remove(token, movieId, 'movie')
        .then(refresh)
        .catch(() => void refresh());
      return;
    }
    setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((movie) => movie.id === movieId);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
