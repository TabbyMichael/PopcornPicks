import { catalogApi } from "@popcornpicks/api-client";
import type { Genre, Movie, TitlePage } from "@popcornpicks/types";

/**
 * Home domain service. The only seam between the home feature and the
 * PopcornPicks API - normalized camelCase DTOs only (ADR-0003).
 */
export async function fetchTrendingMovies(): Promise<TitlePage<Movie>> {
  return catalogApi.movies.trending("week");
}

export async function fetchMovieGenres(): Promise<Genre[]> {
  const data = await catalogApi.movies.genres();
  return data.genres;
}

// Helper function to get the primary genre name from genre IDs
export const getGenreName = (genreIds: number[], allGenres: Genre[]): string => {
  if (!genreIds || genreIds.length === 0) return "Unknown";
  const genre = allGenres.find((g) => g.id === genreIds[0]);
  return genre ? genre.name : "Unknown";
};
