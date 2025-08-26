
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Plus, Play, Bookmark, Clock, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { 
  fetchMovieDetails, 
  fetchMovieCredits, 
  fetchMovieVideos, 
  getImageUrl, 
  formatRuntime, 
  formatCurrency,
  TMDBMovieDetails,
  TMDBCredits,
  TMDBVideos 
} from "@/lib/tmdb";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null);
  const [credits, setCredits] = useState<TMDBCredits | null>(null);
  const [videos, setVideos] = useState<TMDBVideos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const movieId = parseInt(id);
        if (isNaN(movieId)) {
          throw new Error('Invalid movie ID');
        }
        
        // Fetch movie details, credits, and videos concurrently
        const [movieData, creditsData, videosData] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchMovieCredits(movieId),
          fetchMovieVideos(movieId)
        ]);
        
        if (!movieData) {
          throw new Error('Movie not found');
        }
        
        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData);
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load movie data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Get the main trailer video
  const getTrailerKey = () => {
    if (!videos?.results) return null;
    const trailer = videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer?.key || videos.results[0]?.key || null;
  };

  // Get director from crew
  const getDirector = () => {
    if (!credits?.crew) return 'Unknown';
    const director = credits.crew.find(person => person.job === 'Director');
    return director?.name || 'Unknown';
  };

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading movie details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Movie Not Found</h1>
            <p className="text-gray-300 mb-8">{error || 'The requested movie could not be found.'}</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30" />
        </div>
        
        <div className="relative z-10 flex h-full items-end pb-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
              {/* Movie Poster */}
              <div className="lg:col-span-1">
                <img
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/500x750/1f2937/9ca3af?text=No+Image';
                  }}
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
                    <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-300">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </span>
                  {movie.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-gray-300">{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                  <span className="text-gray-300">{getDirector()}</span>
                </div>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary" className="bg-white/20 text-white">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto lg:mx-0">
                  {movie.overview || 'No description available.'}
                </p>
                
                {movie.tagline && (
                  <p className="text-xl text-purple-300 italic mb-6 max-w-3xl mx-auto lg:mx-0">
                    "{movie.tagline}"
                  </p>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Button
                    size="lg"
                    onClick={() => setShowTrailer(true)}
                    disabled={!getTrailerKey()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {getTrailerKey() ? 'Watch Trailer' : 'No Trailer Available'}
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
                  {credits?.cast && credits.cast.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {credits.cast.slice(0, 12).map((actor) => (
                        <div key={actor.id} className="text-center">
                          {actor.profile_path ? (
                            <img
                              src={getImageUrl(actor.profile_path, 'w185')}
                              alt={actor.name}
                              className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mx-auto mb-2 flex items-center justify-center hidden">
                            <span className="text-white font-semibold text-sm">
                              {actor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          <p className="text-sm text-white font-medium">{actor.name}</p>
                          <p className="text-xs text-gray-400">{actor.character}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Cast information not available.</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Additional Movie Info */}
              <Card className="bg-slate-800/50 border-slate-700 mt-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Movie Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className="text-white">{movie?.status || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Original Language</p>
                      <p className="text-white">{movie?.original_language?.toUpperCase() || 'Unknown'}</p>
                    </div>
                    {movie?.budget && movie.budget > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm">Budget</p>
                        <p className="text-white">{formatCurrency(movie.budget)}</p>
                      </div>
                    )}
                    {movie?.revenue && movie.revenue > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm">Revenue</p>
                        <p className="text-white">{formatCurrency(movie.revenue)}</p>
                      </div>
                    )}
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
              src={`https://www.youtube.com/embed/${getTrailerKey()}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title="Movie Trailer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
