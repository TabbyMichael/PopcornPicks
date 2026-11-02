import { catalogApi } from "@popcornpicks/api-client";
import type {
  Credit,
  Movie,
  MovieDetails,
  TitlePage,
  Video,
} from "@popcornpicks/types";

/**
 * Movie domain service. The only seam between the movies feature and the
 * PopcornPicks API - normalized camelCase DTOs only (ADR-0003). These throw
 * on failure; callers handle errors.
 */
export function fetchMovieDetails(id: number): Promise<MovieDetails> {
  return catalogApi.movies.details(id);
}

export async function fetchMovieCredits(id: number): Promise<Credit[]> {
  const { credits } = await catalogApi.movies.credits(id);
  return credits;
}

export async function fetchMovieVideos(id: number): Promise<Video[]> {
  const { videos } = await catalogApi.movies.videos(id);
  return videos;
}

export function fetchSimilarMovies(id: number): Promise<TitlePage<Movie>> {
  return catalogApi.movies.similar(id);
}

export function fetchMovieRecommendations(id: number): Promise<TitlePage<Movie>> {
  return catalogApi.movies.recommendations(id);
}

export type { Credit, Movie, MovieDetails, TitlePage, Video };
