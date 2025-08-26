
import { useState, useEffect } from "react";
import { Star, TrendingUp, Sparkles, Heart, Clock, Trophy, Filter, Shuffle } from "lucide-react";
import { 
  fetchTrendingMovies, 
  fetchMovieGenres, 
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  TMDBMovie,
  TMDBGenre,
  getGenreName 
} from "@/lib/tmdb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import MovieCard, { Movie } from "@/components/MovieCard";

interface RecommendationSection {
  title: string;
  reason: string;
  icon: React.ComponentType<{ className?: string }>;
  movies: Movie[];
  gradient: string;
}

const RecommendationsPage = () => {
  const [recommendationSections, setRecommendationSections] = useState<RecommendationSection[]>([]);
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  // Fetch genres
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const tmdbGenres = await fetchMovieGenres();
        setGenres(tmdbGenres);
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    };
    loadGenres();
  }, []);

  // Fetch all recommendations
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [trending, popular, topRated, upcoming] = await Promise.all([
        fetchTrendingMovies(),
        fetchPopularMovies(),
        fetchTopRatedMovies(),
        fetchUpcomingMovies()
      ]);

      const sections: RecommendationSection[] = [
        {
          title: "Trending This Week",
          reason: "What everyone's watching",
          icon: TrendingUp,
          gradient: "from-orange-500 to-red-500",
          movies: trending.slice(0, 8).map(convertTMDBMovie)
        },
        {
          title: "Popular Right Now",
          reason: "Crowd favorites",
          icon: Heart,
          gradient: "from-pink-500 to-rose-500",
          movies: popular.slice(0, 8).map(convertTMDBMovie)
        },
        {
          title: "Critics' Choice",
          reason: "Highest rated movies",
          icon: Trophy,
          gradient: "from-yellow-500 to-amber-500",
          movies: topRated.slice(0, 8).map(convertTMDBMovie)
        },
        {
          title: "Coming Soon",
          reason: "Upcoming releases",
          icon: Sparkles,
          gradient: "from-purple-500 to-indigo-500",
          movies: upcoming.slice(0, 8).map(convertTMDBMovie)
        }
      ];

      // Filter out empty sections
      const validSections = sections.filter(section => section.movies.length > 0);
      setRecommendationSections(validSections);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genres.length > 0) {
      fetchRecommendations();
    }
  }, [genres]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading personalized recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
            <p className="text-gray-300 mb-8">{error}</p>
            <Button onClick={handleRefresh} className="bg-gradient-to-r from-purple-600 to-pink-600">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative px-4 pt-24 pb-12 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599732026-0d5d56a00d3b?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
              <Star className="h-10 w-10 text-purple-400" />
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Your <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Recommendations</span>
              </h1>
              <div className="h-1 w-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded"></div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover your next favorite movie with our curated recommendations powered by real-time data
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3"
            >
              {refreshing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Refresh Recommendations
                </>
              )}
            </Button>
            <Button variant="outline" className="border-purple-500/50 text-white hover:bg-purple-500/10 px-6 py-3">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Genre
            </Button>
          </div>
        </div>
      </div>

      {/* Recommendations Sections */}
      <div className="px-4 pb-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-16">
            {recommendationSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="relative">
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${section.gradient} rounded-xl flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                        <Badge variant="secondary" className="mt-1 bg-white/10 text-gray-300">
                          {section.reason}
                        </Badge>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className={`h-1 w-24 bg-gradient-to-r ${section.gradient} rounded`}></div>
                    </div>
                  </div>
                  
                  {/* Movies Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                    {section.movies.map((movie, movieIndex) => (
                      <div 
                        key={movie.id}
                        className="transition-all duration-500 hover:scale-105"
                        style={{ animationDelay: `${movieIndex * 100}ms` }}
                      >
                        <MovieCard movie={movie} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full blur-xl"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 pb-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="bg-gradient-to-br from-slate-800/50 via-purple-900/30 to-pink-900/30 border border-purple-500/30 backdrop-blur-xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-white text-2xl">
                <TrendingUp className="h-6 w-6 text-purple-400" />
                Your Movie Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {recommendationSections.reduce((total, section) => total + section.movies.length, 0)}
                  </div>
                  <div className="text-sm text-gray-300">Movies Recommended</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">4.8</div>
                  <div className="text-sm text-gray-300">Avg Rating</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{recommendationSections.length}</div>
                  <div className="text-sm text-gray-300">Categories</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Updated</div>
                  <div className="text-sm text-gray-300">Real-time Data</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
