import { useState, useEffect } from "react";
import { TrendingUp, Heart, Trophy, Sparkles } from "lucide-react";
import {
  fetchTrendingMovies,
  fetchMovieGenres,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  getGenreName,
} from "@/features/recommendations/services/recommendation.service";
import type { Genre, Movie as NormalizedMovie } from "@popcornpicks/types";
import { posterPathFromUrl } from "@/utils/normalized-poster";
import { Movie } from "@/features/movies/components/MovieCard";
import { RecommendationSection } from "@/features/recommendations/types";

/**
 * Loads the recommendation sections (trending, popular, top rated, upcoming)
 * plus genres, and exposes a refresh action.
 */
export function useRecommendations() {
  const [recommendationSections, setRecommendationSections] = useState<
    RecommendationSection[]
  >([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const convertMovie = (movie: NormalizedMovie): Movie => ({
    id: movie.id,
    title: movie.title,
    poster_path: posterPathFromUrl(movie.posterUrl),
    backdrop_path: posterPathFromUrl(movie.backdropUrl),
    vote_average: movie.voteAverage,
    release_date: movie.releaseDate,
    genre_ids: movie.genreIds,
    genreName: getGenreName(movie.genreIds, genres),
    video: movie.hasTrailer,
  });

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const [trending, popular, topRated, upcoming] = await Promise.all([
        fetchTrendingMovies(),
        fetchPopularMovies(),
        fetchTopRatedMovies(),
        fetchUpcomingMovies(),
      ]);

      const sections: RecommendationSection[] = [
        {
          title: "Trending This Week",
          reason: "What everyone's watching",
          icon: TrendingUp,
          movies: trending.results.slice(0, 8).map(convertMovie),
        },
        {
          title: "Popular Right Now",
          reason: "Crowd favorites",
          icon: Heart,
          movies: popular.results.slice(0, 8).map(convertMovie),
        },
        {
          title: "Critics' Choice",
          reason: "Highest rated movies",
          icon: Trophy,
          movies: topRated.results.slice(0, 8).map(convertMovie),
        },
        {
          title: "Coming Soon",
          reason: "Upcoming releases",
          icon: Sparkles,
          movies: upcoming.results.slice(0, 8).map(convertMovie),
        },
      ];

      const validSections = sections.filter((section) => section.movies.length > 0);
      setRecommendationSections(validSections);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch genres
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const tmdbGenres = await fetchMovieGenres();
        setGenres(tmdbGenres);
      } catch (err) {
        console.error("Error loading genres:", err);
      }
    };
    loadGenres();
  }, []);

  // Fetch recommendations once genres are available
  useEffect(() => {
    if (genres.length > 0) {
      fetchRecommendations();
    }
  }, [genres]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  return {
    recommendationSections,
    genres,
    loading,
    error,
    refreshing,
    handleRefresh,
  };
}
