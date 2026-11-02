import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos,
  fetchSimilarMovies,
  fetchMovieRecommendations,
} from "@/features/movies/services/movie.service";
import type {
  Credit,
  Movie,
  MovieDetails,
  Video,
} from "@popcornpicks/types";

/**
 * Loads all data for a single movie detail view (details, credits, videos,
 * similar movies and recommendations) from the normalized API and derives the
 * trailer key + director.
 */
export function useMovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credit[] | null>(null);
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const movieId = parseInt(id);
        if (isNaN(movieId)) {
          throw new Error("Invalid movie ID");
        }

        const [movieData, creditsData, videosData, similarData, recommendationsData] =
          await Promise.all([
            fetchMovieDetails(movieId),
            fetchMovieCredits(movieId),
            fetchMovieVideos(movieId),
            fetchSimilarMovies(movieId),
            fetchMovieRecommendations(movieId),
          ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData);
        setSimilarMovies(similarData.results);
        setRecommendations(recommendationsData.results);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError(err instanceof Error ? err.message : "Failed to load movie data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Main trailer video key (prefers an official YouTube trailer).
  const getTrailerKey = (): string | null => {
    if (!videos || videos.length === 0) return null;
    const trailer = videos.find((video) => video.type === "Trailer" && video.site === "YouTube");
    return trailer?.key || videos[0]?.key || null;
  };

  // Director from the flat credits list (crew entries carry `job`).
  const getDirector = (): string => {
    if (!credits) return "Unknown";
    const director = credits.find((person) => person.job === "Director");
    return director?.name || "Unknown";
  };

  return {
    id,
    movie,
    credits,
    videos,
    similarMovies,
    recommendations,
    loading,
    error,
    getTrailerKey,
    getDirector,
  };
}
