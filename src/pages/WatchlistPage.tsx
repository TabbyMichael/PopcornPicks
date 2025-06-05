
import { useState } from "react";
import { Bookmark, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MovieCard from "@/components/MovieCard";

const watchlistMovies = [
  { id: 1, title: "Dune: Part Two", poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop", rating: 8.5, year: 2024, genre: "Sci-Fi", userRating: 0 },
  { id: 3, title: "The Batman", poster: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=450&fit=crop", rating: 8.2, year: 2022, genre: "Action", userRating: 4 },
  { id: 5, title: "Top Gun: Maverick", poster: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop", rating: 8.6, year: 2022, genre: "Action", userRating: 5 },
];

const WatchlistPage = () => {
  const [movies, setMovies] = useState(watchlistMovies);

  const removeFromWatchlist = (movieId: number) => {
    setMovies(movies.filter(movie => movie.id !== movieId));
  };

  const updateRating = (movieId: number, rating: number) => {
    setMovies(movies.map(movie => 
      movie.id === movieId ? { ...movie, userRating: rating } : movie
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="px-4 pt-20 pb-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Bookmark className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
            </div>
            <p className="text-gray-300">
              {movies.length} movie{movies.length !== 1 ? "s" : ""} saved to watch later
            </p>
          </div>

          {movies.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                <Bookmark className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Your watchlist is empty</h2>
              <p className="text-gray-400 mb-6">Start adding movies you want to watch later</p>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <a href="/search">Browse Movies</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <Card key={movie.id} className="group overflow-hidden bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWatchlist(movie.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-black/50 backdrop-blur-sm text-white border-white/20">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {movie.rating}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white truncate mb-2">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">{movie.year}</span>
                      <Badge variant="secondary" className="text-xs">
                        {movie.genre}
                      </Badge>
                    </div>
                    
                    {/* User Rating */}
                    <div className="flex items-center justify-between">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;
