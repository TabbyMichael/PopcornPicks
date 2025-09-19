
import { useState, useEffect } from "react";
import { fetchMovieGenres, searchMovies } from "@/lib/tmdb";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import MovieCard from "@/components/MovieCard";

// Remove duplicate import since it's already imported above

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [yearRange, setYearRange] = useState([2000, 2024]);
  const [filteredMovies, setFilteredMovies] = useState([]);
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
      // Trigger search immediately when URL has a query parameter
      console.log('Initializing search from URL parameter:', queryParam);
      // Force a search when URL parameter is present
      handleSearch();
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchAndFilterMovies = async () => {
      setLoading(true);
      let movies = [];
      if (searchQuery) {
        console.log('Searching for:', searchQuery);
        movies = await searchMovies(searchQuery);
        console.log('Search results:', movies);
        console.log('Search results count:', movies.length);
        if (movies.length === 0) {
          console.log('No movies found in search results');
        }
      }

      let filtered = movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        genre_ids: movie.genre_ids,
        rating: movie.vote_average ? parseFloat(movie.vote_average.toFixed(1)) : 0,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
        genre: movie.genre_ids && movie.genre_ids.length > 0 ? movie.genre_ids.map((id: number) => genreMap.get(id)).filter(Boolean).join(", ") : "N/A",
      }));

      // Filter by genre
      if (selectedGenre !== "all") {
        filtered = filtered.filter(movie => movie.genre.includes(selectedGenre));
      }

      // Filter by rating
      filtered = filtered.filter(movie =>
        movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1]
      );

      // Filter by year
      filtered = filtered.filter(movie => {
        const movieYear = movie.year;
        return movieYear >= yearRange[0] && movieYear <= yearRange[1];
      });

      setFilteredMovies(filtered);
      setLoading(false);
    };

    fetchAndFilterMovies();
  }, [searchQuery, selectedGenre, ratingRange, yearRange, genreMap]);

  const handleSearch = () => {
    console.log('Handling search for:', searchQuery);
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="px-4 pt-20 pb-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-6">Browse Movies</h1>
            
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                />
              </div>
              <Button onClick={handleSearch} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Search
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.name}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating: {ratingRange[0]} - {ratingRange[1]}
                  </label>
                  <Slider
                    value={ratingRange}
                    onValueChange={setRatingRange}
                    max={10}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year: {yearRange[0]} - {yearRange[1]}
                  </label>
                  <Slider
                    value={yearRange}
                    onValueChange={setYearRange}
                    max={2024}
                    min={2000}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Movie Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg h-96 animate-pulse"></div>
              ))
            ) : filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={{
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average || 0,
                    release_date: movie.release_date || '',
                    genre_ids: movie.genre_ids
                  }} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg mb-4">No movies found.</p>
                {searchQuery && (
                  <p className="text-gray-500">Try searching for a different movie or check your spelling.</p>
                )}
                {!searchQuery && (
                  <p className="text-gray-500">Enter a movie title in the search box above to find movies.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
