import { useState, useEffect } from "react";
import {
  fetchTrendingMovies,
  fetchMovieGenres,
  getGenreName,
} from "@/features/home/services/home.service";
import type { Genre, Movie as NormalizedMovie } from "@popcornpicks/types";
import { posterPathFromUrl } from "@/utils/normalized-poster";
import { Movie } from "@/features/movies/components/MovieCard";

/**
 * Loads the trending movies shown on the home page together with the
 * available genres used to resolve genre display names.
 */
export function useTrendingMovies() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch genres and movies concurrently
        const [moviesData, genresData] = await Promise.all([
          fetchTrendingMovies(),
          fetchMovieGenres(),
        ]);

        setGenres(genresData);

        // Map normalized DTOs to our Movie card interface with genre names
        const mappedMovies: Movie[] = moviesData.results.map((movie: NormalizedMovie) => ({
          id: movie.id,
          title: movie.title,
          poster_path: posterPathFromUrl(movie.posterUrl),
          backdrop_path: posterPathFromUrl(movie.backdropUrl),
          vote_average: movie.voteAverage,
          release_date: movie.releaseDate,
          genre_ids: movie.genreIds,
          genreName: getGenreName(movie.genreIds, genresData),
          video: movie.hasTrailer,
        }));

        setTrendingMovies(mappedMovies);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load movies. Please check your API configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { trendingMovies, genres, loading, error };
}
