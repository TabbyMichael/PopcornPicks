import { catalogApi } from "@popcornpicks/api-client";
import type { MovieDetails } from "@popcornpicks/types";

/**
 * Watchlist domain service. The only seam between the watchlist feature and
 * the PopcornPicks API - normalized camelCase DTOs only (ADR-0003).
 */
export function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  return catalogApi.movies.details(movieId);
}
