import { useState, useEffect } from "react";
import { fetchTrendingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies, fetchMovieGenres, TMDBMovie, TMDBGenre, getGenreName } from "@/lib/tmdb";
import { Search, TrendingUp, Star, Crown, Calendar, Filter, Grid, List, Sparkles, Flame, Award, Clock, ArrowRight, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MovieCard, { Movie } from "@/components/MovieCard";
import Footer from "@/components/Footer";

interface MovieSection {
  title: string;
  movies: Movie[];
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  description: string;
}

const BrowsePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("trending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [movieSections, setMovieSections] = useState<MovieSection[]>([]);
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  // Helper function to convert TMDB movie to our Movie interface
  const convertTMDBMovie = (movie: TMDBMovie): Movie => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    genre_ids: movie.genre_ids,
    genreName: getGenreName(movie.genre_ids, genres)
  });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch genres first
        const genresData = await fetchMovieGenres();
        setGenres(genresData);
        
        // Fetch all movie categories
        const [trending, popular, topRated, upcoming] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchUpcomingMovies()
        ]);

        // Convert and organize movies into sections
        const sections: MovieSection[] = [
          {
            title: "Trending Now",
            movies: trending.slice(0, 20).map((movie: TMDBMovie) => convertTMDBMovie(movie)),
            icon: TrendingUp,
            gradient: "from-orange-500 to-red-500",
            description: "What everyone's watching right now"
          },
          {
            title: "Popular Movies",
            movies: popular.slice(0, 20).map((movie: TMDBMovie) => convertTMDBMovie(movie)),
            icon: Flame,
            gradient: "from-pink-500 to-rose-500",
            description: "Most loved by audiences worldwide"
          },
          {
            title: "Top Rated",
            movies: topRated.slice(0, 20).map((movie: TMDBMovie) => convertTMDBMovie(movie)),
            icon: Award,
            gradient: "from-yellow-500 to-amber-500",
            description: "Critics' choice and highest rated films"
          },
          {
            title: "Coming Soon",
            movies: upcoming.slice(0, 20).map((movie: TMDBMovie) => convertTMDBMovie(movie)),
            icon: Calendar,
            gradient: "from-purple-500 to-indigo-500",
            description: "Upcoming releases to look forward to"
          }
        ];

        setMovieSections(sections);
        
        // Set initial filtered movies to trending
        setFilteredMovies(sections[0].movies);
        
      } catch (err) {
        console.error('Error fetching browse data:', err);
        setError('Failed to load movies. Please check your API configuration.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update filtered movies when tab or genre changes
  useEffect(() => {
    const currentSection = movieSections.find(section => {
      switch (activeTab) {
        case "trending": return section.title === "Trending Now";
        case "popular": return section.title === "Popular Movies";
        case "top-rated": return section.title === "Top Rated";
        case "upcoming": return section.title === "Coming Soon";
        default: return section.title === "Trending Now";
      }
    });

    if (currentSection) {
      let filtered = currentSection.movies;
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(movie => 
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply genre filter
      if (selectedGenre !== "all") {
        filtered = filtered.filter(movie => 
          movie.genreName.toLowerCase().includes(selectedGenre.toLowerCase())
        );
      }
      
      setFilteredMovies(filtered);
    }
  }, [activeTab, searchQuery, selectedGenre, movieSections]);

  const handleSearch = () => {
    // Search functionality is handled by useEffect
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading amazing movies...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
            <p className="text-gray-300 mb-8">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-purple-600 to-pink-600">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        {/* Cinematic Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop"
            alt="Cinema background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-pink-900/40" />
          {/* Floating particles effect */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full opacity-40 animate-ping"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-purple-300 rounded-full opacity-30 animate-ping" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Animated icon with glow */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 animate-pulse"></div>
                <div className="relative p-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Search className="h-16 w-16 text-purple-400" />
                </div>
              </div>
            </div>
            
            {/* Main title with enhanced gradient */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Browse Movies
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              Discover your next favorite film from our vast collection of 
              <span className="text-purple-400 font-semibold"> trending</span>,
              <span className="text-pink-400 font-semibold"> popular</span>, and
              <span className="text-yellow-400 font-semibold"> critically acclaimed</span> movies
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative flex gap-2 bg-black/50 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search movies by title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-16 pl-14 bg-transparent border-0 text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none text-xl"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleSearch}
                    className="h-16 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-lg font-semibold"
                  >
                    <Search className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {movieSections.map((section, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
                  <div className="text-2xl font-bold text-white mb-1">{section.movies.length}</div>
                  <div className="text-sm text-gray-300">{section.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Controls Section */}
        <div className="mb-12">
          <div className="bg-slate-800/30 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
              <div className="flex gap-4 items-center flex-wrap">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-52 h-12 bg-white/10 border-white/20 text-white rounded-xl hover:bg-white/15 transition-colors">
                    <Filter className="h-5 w-5 mr-2" />
                    <SelectValue placeholder="Filter by Genre" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.name.toLowerCase()}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`h-10 px-4 rounded-lg transition-all ${
                      viewMode === "grid" 
                        ? "bg-purple-500 text-white shadow-lg" 
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`h-10 px-4 rounded-lg transition-all ${
                      viewMode === "list" 
                        ? "bg-purple-500 text-white shadow-lg" 
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Enhanced Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-white/10 rounded-2xl p-1 border border-white/20">
                <TabsTrigger 
                  value="trending" 
                  className="rounded-xl text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </TabsTrigger>
                <TabsTrigger 
                  value="popular" 
                  className="rounded-xl text-white data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Flame className="h-4 w-4 mr-2" />
                  Popular
                </TabsTrigger>
                <TabsTrigger 
                  value="top-rated" 
                  className="rounded-xl text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Top Rated
                </TabsTrigger>
                <TabsTrigger 
                  value="upcoming" 
                  className="rounded-xl text-white data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Movies Display */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full animate-pulse"></div>
              </div>
              <div className="relative mx-auto h-32 w-32 rounded-full bg-slate-800/50 backdrop-blur-sm flex items-center justify-center border border-slate-700/50 shadow-xl">
                <Search className="h-16 w-16 text-purple-400" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">No movies found</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Try adjusting your search terms or filters to discover more movies
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("all");
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-8 py-4 text-lg font-semibold"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredMovies.map((movie, index) => (
              <div
                key={movie.id}
                className="transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {viewMode === "grid" ? (
                  <MovieCard movie={movie} />
                ) : (
                  // List view implementation
                  <Card className="group overflow-hidden bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex">
                      <div className="relative w-24 h-36 flex-shrink-0">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="h-full w-full object-cover rounded-l"
                        />
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-white text-lg mb-1">{movie.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  {movie.vote_average.toFixed(1)}
                                </div>
                                <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                                  {movie.genreName}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Link to={`/movie/${movie.id}`}>
                              <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                                <Play className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default BrowsePage;