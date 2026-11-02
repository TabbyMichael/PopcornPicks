import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Movie } from "@popcornpicks/types";
import { posterPathFromUrl } from "@/utils/normalized-poster";
import { fetchMovieGenres, searchMovies } from "@/features/search/services/search.service";

type SearchMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  video?: boolean;
  rating: number;
  year: number;
  genre: string;
};

/**
 * Owns the entire search-page state: URL query params, search query, filters
 * (genre / rating / year), genres metadata and the filtered result set.
 */
export function useMovieSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [yearRange, setYearRange] = useState([2000, 2024]);
  const [filteredMovies, setFilteredMovies] = useState<SearchMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genreMap, setGenreMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    const getGenres = async () => {
      const tmdbGenres = await fetchMovieGenres();
      setGenres(tmdbGenres);
      const map = new Map<number, string>();
      tmdbGenres.forEach((genre: { id: number; name: string }) => {
        map.set(genre.id, genre.name);
      });
      setGenreMap(map);
    };
    getGenres();
  }, []);

  // Initialize search from URL params
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const fetchAndFilterMovies = async () => {
      setLoading(true);
      let movies: Movie[] = [];
      if (searchQuery) {
        try {
          const page = await searchMovies(searchQuery);
          movies = page.results;
        } catch (error) {
          console.error("Error searching movies:", error);
          movies = [];
        }
      }

      let filtered = movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        // Recover the CDN path so MovieCard can pick its own image size.
        poster_path: posterPathFromUrl(movie.posterUrl),
        vote_average: movie.voteAverage,
        release_date: movie.releaseDate,
        genre_ids: movie.genreIds,
        video: movie.hasTrailer,
        rating: movie.voteAverage ? parseFloat(movie.voteAverage.toFixed(1)) : 0,
        year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 0,
        genre:
          movie.genreIds && movie.genreIds.length > 0
            ? movie.genreIds
                .map((id: number) => genreMap.get(id))
                .filter(Boolean)
                .join(", ")
            : "N/A",
      }));

      // Filter by genre
      if (selectedGenre !== "all") {
        filtered = filtered.filter((movie) => movie.genre.includes(selectedGenre));
      }

      // Filter by rating
      filtered = filtered.filter(
        (movie) => movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1]
      );

      // Filter by year
      filtered = filtered.filter((movie) => {
        const movieYear = movie.year;
        return movieYear >= yearRange[0] && movieYear <= yearRange[1];
      });

      setFilteredMovies(filtered);
      setLoading(false);
    };

    fetchAndFilterMovies();
  }, [searchQuery, selectedGenre, ratingRange, yearRange, genreMap]);

  const handleSearch = () => {
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    ratingRange,
    setRatingRange,
    yearRange,
    setYearRange,
    filteredMovies,
    loading,
    genres,
    handleSearch,
  };
}
