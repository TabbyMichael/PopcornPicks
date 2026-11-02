import { useState, useEffect } from "react";
import { fetchMovieDetails } from "@/features/watchlist/services/watchlist.service";
import { useWatchlist } from "@/features/watchlist/context/WatchlistContext";
import { WatchlistMovie } from "@/features/watchlist/types";

/**
 * Owns all watchlist-page state: fetches live details for each watchlist
 * entry, exposes filtering/sorting/rating/watched toggles, and derives the
 * watched/unwatched lists and summary stats.
 */
export function useWatchlistPage() {
  const [movies, setMovies] = useState<WatchlistMovie[]>([]);
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      try {
        setLoading(true);

        if (watchlist.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }

        const fetchedMovies = await Promise.all(
          watchlist.map(async (watchlistMovie) => {
            // Detail fetch can fail per-title; degrade gracefully to stored fields.
            const movie = await fetchMovieDetails(watchlistMovie.id).catch(() => null);
            return {
              id: watchlistMovie.id,
              title: watchlistMovie.title,
              poster: watchlistMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${watchlistMovie.poster_path}`
                : "https://via.placeholder.com/500x750/1f2937/9ca3af?text=No+Image",
              backdrop: movie?.backdropUrl,
              rating: watchlistMovie.vote_average
                ? parseFloat(watchlistMovie.vote_average.toFixed(1))
                : 0,
              year: watchlistMovie.release_date
                ? new Date(watchlistMovie.release_date).getFullYear()
                : 0,
              genre:
                movie?.genres && movie.genres.length > 0
                  ? movie.genres[0].name
                  : "N/A",
              userRating: 0,
              dateAdded: new Date().toISOString(),
              watched: false,
              runtime: movie?.runtimeMinutes || 0,
              overview: movie?.overview || "",
            };
          })
        );

        setMovies(fetchedMovies.filter(Boolean) as WatchlistMovie[]);
      } catch (error) {
        console.error("Error fetching watchlist movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistMovies();
  }, [watchlist]);

  const handleRemoveFromWatchlist = (movieId: number) => {
    removeFromWatchlist(movieId);
  };

  const updateRating = (movieId: number, rating: number) => {
    setMovies(
      movies.map((movie) =>
        movie.id === movieId ? { ...movie, userRating: rating } : movie
      )
    );
  };

  const toggleWatched = (movieId: number) => {
    setMovies(
      movies.map((movie) =>
        movie.id === movieId ? { ...movie, watched: !movie.watched } : movie
      )
    );
  };

  const filteredAndSortedMovies = movies
    .filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "watched" && movie.watched) ||
        (filterBy === "unwatched" && !movie.watched) ||
        (filterBy === "rated" && movie.userRating > 0);
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "unwatched" && !movie.watched) ||
        (activeTab === "watched" && movie.watched);
      return matchesSearch && matchesFilter && matchesTab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return b.year - a.year;
        case "rating":
          return b.rating - a.rating;
        case "userRating":
          return b.userRating - a.userRating;
        case "dateAdded":
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

  const watchedMovies = movies.filter((movie) => movie.watched);
  const unwatchedMovies = movies.filter((movie) => !movie.watched);
  const totalWatchTime = watchedMovies.reduce(
    (total, movie) => total + (movie.runtime || 0),
    0
  );
  const averageRating =
    movies.length > 0
      ? movies.reduce((sum, movie) => sum + movie.userRating, 0) / movies.length
      : 0;

  return {
    movies,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    viewMode,
    setViewMode,
    loading,
    activeTab,
    setActiveTab,
    filteredAndSortedMovies,
    watchedMovies,
    unwatchedMovies,
    totalWatchTime,
    averageRating,
    handleRemoveFromWatchlist,
    updateRating,
    toggleWatched,
  };
}
