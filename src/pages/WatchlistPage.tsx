
import { useState, useEffect } from "react";
import { fetchMovieDetails } from "@/lib/tmdb";
import { Bookmark, Star, X, Play, Calendar, Clock, Filter, SortAsc, Grid, List, Search, Heart, Share, Eye, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

interface WatchlistMovie {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  rating: number;
  year: number;
  genre: string;
  userRating: number;
  dateAdded: string;
  watched: boolean;
  runtime?: number;
  overview?: string;
}

const WatchlistPage = () => {
  const [movies, setMovies] = useState<WatchlistMovie[]>([]);
  const [watchlistMovieIds, setWatchlistMovieIds] = useState([550, 13, 155, 122, 424, 680]); // Popular movies
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovies = await Promise.all(
          watchlistMovieIds.map(async (id, index) => {
            const movie = await fetchMovieDetails(id);
            return movie ? {
              id: movie.id,
              title: movie.title,
              poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : undefined,
              rating: movie.vote_average ? parseFloat(movie.vote_average.toFixed(1)) : 0,
              year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
              genre: movie.genres && movie.genres.length > 0 ? movie.genres[0].name : "N/A",
              userRating: Math.floor(Math.random() * 5) + 1,
              dateAdded: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
              watched: Math.random() > 0.6,
              runtime: movie.runtime || 0,
              overview: movie.overview || ""
            } : null;
          })
        );
        setMovies(fetchedMovies.filter(Boolean) as WatchlistMovie[]);
      } catch (error) {
        console.error('Error fetching watchlist movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlistMovies();
  }, [watchlistMovieIds]);

  const removeFromWatchlist = (movieId: number) => {
    setMovies(movies.filter(movie => movie.id !== movieId));
  };

  const updateRating = (movieId: number, rating: number) => {
    setMovies(movies.map(movie => 
      movie.id === movieId ? { ...movie, userRating: rating } : movie
    ));
  };

  const toggleWatched = (movieId: number) => {
    setMovies(movies.map(movie => 
      movie.id === movieId ? { ...movie, watched: !movie.watched } : movie
    ));
  };

  const filteredAndSortedMovies = movies
    .filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        filterBy === "all" ||
        (filterBy === "watched" && movie.watched) ||
        (filterBy === "unwatched" && !movie.watched) ||
        (filterBy === "rated" && movie.userRating > 0);
      const matchesTab = 
        activeTab === "all" ||
        (activeTab === "unwatched" && !movie.watched) ||
        (activeTab === "watched" && movie.watched);
      return matchesSearch && matchesFilter && matchesTab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return b.year - a.year;
        case "rating":
          return b.rating - a.rating;
        case "userRating":
          return b.userRating - a.userRating;
        case "dateAdded":
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

  const watchedMovies = movies.filter(movie => movie.watched);
  const unwatchedMovies = movies.filter(movie => !movie.watched);
  const totalWatchTime = watchedMovies.reduce((total, movie) => total + (movie.runtime || 0), 0);
  const averageRating = movies.length > 0 
    ? movies.reduce((sum, movie) => sum + movie.userRating, 0) / movies.length 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your watchlist...</p>
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
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop"
            alt="Cinema background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-pink-900/40" />
          <div 
            className="w-full h-full opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
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
                  <Bookmark className="h-16 w-16 text-purple-400" />
                </div>
              </div>
            </div>
            
            {/* Main title with enhanced gradient */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                My Watchlist
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              Your curated collection of 
              <span className="text-purple-400 font-semibold">must-watch</span> cinematic experiences
            </p>
            
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              <div className="group">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="text-4xl font-bold text-white mb-2">{movies.length}</div>
                  <div className="text-sm text-gray-300 flex items-center justify-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Total Movies
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                  <div className="text-4xl font-bold text-green-400 mb-2">{watchedMovies.length}</div>
                  <div className="text-sm text-gray-300 flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" />
                    Watched
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{Math.round(totalWatchTime / 60)}h</div>
                  <div className="text-sm text-gray-300 flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" />
                    Watch Time
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="text-4xl font-bold text-purple-400 mb-2">{averageRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-300 flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    Avg Rating
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-500/25">
                <Link to="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Discover More Movies
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full px-8 py-6 text-lg font-semibold">
                <Link to="/recommendations">
                  <Target className="mr-2 h-5 w-5" />
                  Get Recommendations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
            <Filter className="h-8 w-8 text-purple-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">Manage Your Collection</h2>
            <div className="h-1 w-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded"></div>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Search, filter, and organize your movies with powerful tools
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="bg-slate-800/30 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
              <div className="relative flex-1 max-w-lg group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search your watchlist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent rounded-2xl text-lg"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 items-center flex-wrap">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-52 h-12 bg-white/10 border-white/20 text-white rounded-xl hover:bg-white/15 transition-colors">
                    <SortAsc className="h-5 w-5 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="dateAdded">Date Added</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="year">Release Year</SelectItem>
                    <SelectItem value="rating">TMDB Rating</SelectItem>
                    <SelectItem value="userRating">My Rating</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-44 h-12 bg-white/10 border-white/20 text-white rounded-xl hover:bg-white/15 transition-colors">
                    <Filter className="h-5 w-5 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Movies</SelectItem>
                    <SelectItem value="watched">Watched</SelectItem>
                    <SelectItem value="unwatched">Not Watched</SelectItem>
                    <SelectItem value="rated">Rated by Me</SelectItem>
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
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 bg-white/10 rounded-2xl p-1 border border-white/20">
                <TabsTrigger 
                  value="all" 
                  className="rounded-xl text-white data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  All ({movies.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="unwatched" 
                  className="rounded-xl text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  To Watch ({unwatchedMovies.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="watched" 
                  className="rounded-xl text-white data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  Watched ({watchedMovies.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredAndSortedMovies.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mb-8">
              {/* Animated background circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full animate-pulse"></div>
              </div>
              <div className="relative mx-auto h-32 w-32 rounded-full bg-slate-800/50 backdrop-blur-sm flex items-center justify-center border border-slate-700/50 shadow-xl">
                <Bookmark className="h-16 w-16 text-purple-400" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {searchQuery ? "No movies found" : "Your watchlist awaits"}
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              {searchQuery 
                ? "Try adjusting your search terms or filters to find what you're looking for" 
                : "Start building your collection of must-watch movies and create your own cinematic journey"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-500/25">
                <Link to="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Movies
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full px-8 py-6 text-lg font-semibold">
                <Link to="/recommendations">
                  <Target className="mr-2 h-5 w-5" />
                  Get Recommendations
                </Link>
              </Button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedMovies.map((movie) => (
              <Card key={movie.id} className="group overflow-hidden bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Link to={`/movie/${movie.id}`}>
                        <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20">
                          <Play className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => toggleWatched(movie.id)}
                        className={`${movie.watched ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {movie.watched ? 'Watched' : 'Mark Watched'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-600/80 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className={`${movie.watched ? 'bg-green-600/80' : 'bg-blue-600/80'} backdrop-blur-sm text-white border-white/20`}>
                      {movie.watched ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Watched
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          To Watch
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/60 backdrop-blur-sm text-white border-white/20">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {movie.rating}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white truncate mb-2 text-lg">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{movie.year}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-300">
                      {movie.genre}
                    </Badge>
                  </div>
                  
                  {movie.runtime && (
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{movie.runtime} min</span>
                    </div>
                  )}
                  
                  {/* User Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Your rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateRating(movie.id, star === movie.userRating ? 0 : star)}
                          className="p-0.5 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              star <= movie.userRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400 hover:text-yellow-400"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      onClick={() => {/* Share functionality */}}
                    >
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                      onClick={() => {/* Add to favorites */}}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredAndSortedMovies.map((movie) => (
              <Card key={movie.id} className="group overflow-hidden bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex">
                  {/* Movie Poster */}
                  <div className="relative w-24 h-36 flex-shrink-0">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="h-full w-full object-cover rounded-l"
                    />
                    <div className="absolute top-1 left-1">
                      <Badge className={`text-xs ${movie.watched ? 'bg-green-600' : 'bg-blue-600'}`}>
                        {movie.watched ? 'Watched' : 'To Watch'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Movie Details */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white text-lg mb-1">{movie.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {movie.year}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {movie.rating}
                            </div>
                            {movie.runtime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {movie.runtime} min
                              </div>
                            )}
                            <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                              {movie.genre}
                            </Badge>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeFromWatchlist(movie.id)}
                          className="p-2 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {movie.overview && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {movie.overview}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* User Rating */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Your rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => updateRating(movie.id, star === movie.userRating ? 0 : star)}
                                className="p-0.5 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`h-4 w-4 ${
                                    star <= movie.userRating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-400 hover:text-yellow-400"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link to={`/movie/${movie.id}`}>
                          <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                            <Play className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => toggleWatched(movie.id)}
                          className={`${movie.watched ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {movie.watched ? 'Watched' : 'Mark Watched'}
                        </Button>
                        <Button size="sm" variant="outline" className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default WatchlistPage;
