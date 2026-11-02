import { Movie } from "@/features/movies/components/MovieCard";

/** A curated recommendation section rendered on the recommendations page. */
export interface RecommendationSection {
  title: string;
  reason: string;
  icon: React.ComponentType<{ className?: string }>;
  movies: Movie[];
}
