
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Plus, Play, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";

const movieData = {
  1: {
    title: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=600&fit=crop",
    rating: 8.5,
    year: 2024,
    runtime: "166 min",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    director: "Denis Villeneuve",
    plot: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin", "Austin Butler", "Florence Pugh"],
    trailer: "dQw4w9WgXcQ" // YouTube video ID
  }
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  const movie = movieData[parseInt(id || "1") as keyof typeof movieData] || movieData[1];

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30" />
        </div>
        
        <div className="relative z-10 flex h-full items-end pb-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
              {/* Movie Poster */}
              <div className="lg:col-span-1">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg shadow-2xl"
                />
              </div>
              
              {/* Movie Info */}
              <div className="lg:col-span-2 text-center lg:text-left">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
                
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{movie.rating}</span>
                  </div>
                  <span className="text-gray-300">{movie.year}</span>
                  <span className="text-gray-300">{movie.runtime}</span>
                  <span className="text-gray-300">{movie.director}</span>
                </div>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {movie.genre.map((g) => (
                    <Badge key={g} variant="secondary" className="bg-white/20 text-white">
                      {g}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto lg:mx-0">
                  {movie.plot}
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Button
                    size="lg"
                    onClick={() => setShowTrailer(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Trailer
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={toggleWatchlist}
                    className={`border-white/20 ${
                      isInWatchlist
                        ? "bg-green-600 text-white border-green-600"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cast */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Cast</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.cast.map((actor, index) => (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {actor.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{actor}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rating */}
            <div>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Rate This Movie</h3>
                  <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= userRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <p className="text-center text-gray-300">
                      You rated this movie {userRating} star{userRating !== 1 ? "s" : ""}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              ✕ Close
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
