import { catalogApi } from "@popcornpicks/api-client";
import type { Genre, Movie, TitlePage } from "@popcornpicks/types";

/**
 * Search domain service. The only seam between the search feature and the
 * PopcornPicks API - normalized camelCase DTOs only (ADR-0003).
 */
export async function searchMovies(query: string, page = 1): Promise<TitlePage<Movie>> {
  if (!query.trim()) {
    return { page: 1, totalPages: 0, totalResults: 0, results: [] };
  }
  return catalogApi.movies.search(query, page);
}

export async function fetchMovieGenres(): Promise<Genre[]> {
  const data = await catalogApi.movies.genres();
  return data.genres;
}

export type { Genre, Movie };
