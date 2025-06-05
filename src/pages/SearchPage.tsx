
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import MovieCard from "@/components/MovieCard";

const allMovies = [
  { id: 1, title: "Dune: Part Two", poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop", rating: 8.5, year: 2024, genre: "Sci-Fi" },
  { id: 2, title: "Oppenheimer", poster: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop", rating: 8.8, year: 2023, genre: "Drama" },
  { id: 3, title: "The Batman", poster: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=450&fit=crop", rating: 8.2, year: 2022, genre: "Action" },
  { id: 4, title: "Spider-Man: No Way Home", poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop", rating: 8.4, year: 2021, genre: "Action" },
  { id: 5, title: "Top Gun: Maverick", poster: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop", rating: 8.6, year: 2022, genre: "Action" },
  { id: 6, title: "Everything Everywhere All at Once", poster: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=450&fit=crop", rating: 8.1, year: 2022, genre: "Sci-Fi" },
  { id: 7, title: "The Whale", poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop", rating: 7.7, year: 2022, genre: "Drama" },
  { id: 8, title: "Avatar: The Way of Water", poster: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop", rating: 7.9, year: 2022, genre: "Sci-Fi" },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [yearRange, setYearRange] = useState([2020, 2024]);
  const [filteredMovies, setFilteredMovies] = useState(allMovies);

  useEffect(() => {
    let filtered = allMovies;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre !== "all") {
      filtered = filtered.filter(movie => movie.genre === selectedGenre);
    }

    // Filter by rating
    filtered = filtered.filter(movie =>
      movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1]
    );

    // Filter by year
    filtered = filtered.filter(movie =>
      movie.year >= yearRange[0] && movie.year <= yearRange[1]
    );

    setFilteredMovies(filtered);
  }, [searchQuery, selectedGenre, ratingRange, yearRange]);

  const handleSearch = () => {
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
                      <SelectItem value="Action">Action</SelectItem>
                      <SelectItem value="Drama">Drama</SelectItem>
                      <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                      <SelectItem value="Comedy">Comedy</SelectItem>
                      <SelectItem value="Horror">Horror</SelectItem>
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

          {/* Results */}
          <div className="mb-4">
            <p className="text-gray-300">
              Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-xl text-gray-400">No movies found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
