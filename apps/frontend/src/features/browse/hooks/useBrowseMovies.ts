import { useState, useEffect } from "react";
import {
  TrendingUp as TrendingUpIcon,
  Flame as FlameIcon,
  Award as AwardIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchMovieGenres,
  getGenreName,
} from "@/features/browse/services/browse.service";
import type { Genre, Movie as NormalizedMovie } from "@popcornpicks/types";
import { posterPathFromUrl } from "@/utils/normalized-poster";
import { Movie } from "@/features/movies/components/MovieCard";
import { MovieSection } from "@/features/browse/types";

/**
 * Owns all browse-page state: loads the movie sections (trending, popular,
 * top rated, upcoming) plus genres, then keeps `filteredMovies` in sync with
 * the active tab, search query and selected genre.
 */
export function useBrowseMovies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("trending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [movieSections, setMovieSections] = useState<MovieSection[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  // Fetch all data
  useEffect(() => {
    const convertMovie = (movie: NormalizedMovie, genreList: Genre[]): Movie => ({
      id: movie.id || 0,
      title: movie.title || "Unknown Title",
      // Recover the CDN path from the absolute URL so cards pick their own size.
      poster_path: posterPathFromUrl(movie.posterUrl),
      backdrop_path: posterPathFromUrl(movie.backdropUrl),
      vote_average: movie.voteAverage || 0,
      release_date: movie.releaseDate || "",
      genre_ids: movie.genreIds || [],
      genreName: getGenreName(movie.genreIds, genreList),
      video: movie.hasTrailer,
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch genres first
        const genresData = await fetchMovieGenres();
        setGenres(genresData);

        // Fetch all movie categories (normalized pages from our API)
        const [trending, popular, topRated, upcoming] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchUpcomingMovies(),
        ]);

        const sections: MovieSection[] = [
          {
            title: "Trending Now",
            movies: trending.results.slice(0, 20).map((m) => convertMovie(m, genresData)),
            icon: TrendingUpIcon,
            description: "What everyone's watching right now",
          },
          {
            title: "Popular Movies",
            movies: popular.results.slice(0, 20).map((m) => convertMovie(m, genresData)),
            icon: FlameIcon,
            description: "Most loved by audiences worldwide",
          },
          {
            title: "Top Rated",
            movies: topRated.results.slice(0, 20).map((m) => convertMovie(m, genresData)),
            icon: AwardIcon,
            description: "Critics' choice and highest rated films",
          },
          {
            title: "Coming Soon",
            movies: upcoming.results.slice(0, 20).map((m) => convertMovie(m, genresData)),
            icon: CalendarIcon,
            description: "Upcoming releases to look forward to",
          },
        ];

        setMovieSections(sections);
        setFilteredMovies(sections[0].movies);
      } catch (err) {
        console.error("Error fetching browse data:", err);
        setError("Failed to load movies. Please check your API configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update filtered movies when tab or genre changes
  useEffect(() => {
    const currentSection = movieSections.find((section) => {
      switch (activeTab) {
        case "trending":
          return section.title === "Trending Now";
        case "popular":
          return section.title === "Popular Movies";
        case "top-rated":
          return section.title === "Top Rated";
        case "upcoming":
          return section.title === "Coming Soon";
        default:
          return section.title === "Trending Now";
      }
    });

    if (currentSection) {
      let filtered = currentSection.movies;

      if (searchQuery) {
        filtered = filtered.filter((movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedGenre !== "all") {
        filtered = filtered.filter(
          (movie) => (movie.genreName ?? "").toLowerCase().includes(selectedGenre.toLowerCase())
        );
      }

      setFilteredMovies(filtered);
    }
  }, [activeTab, searchQuery, selectedGenre, movieSections]);

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    loading,
    error,
    movieSections,
    genres,
    filteredMovies,
  };
}
