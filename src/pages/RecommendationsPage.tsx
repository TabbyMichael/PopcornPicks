
import { useState, useEffect } from "react";
import { Star, TrendingUp } from "lucide-react";
import { fetchTrendingMovies, fetchMovieGenres, fetchMovieDetails } from "@/lib/tmdb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MovieCard from "@/components/MovieCard";

const RecommendationsPage = () => {
  const [recommendationSections, setRecommendationSections] = useState<Array<{
    title: string;
    reason: string;
    movies: Array<{
      id: number;
      title: string;
      poster: string;
      rating: number;
      year: number;
      genre: string;
    }>;
  }>>([]);
  const [genres, setGenres] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    const getGenres = async () => {
      const tmdbGenres = await fetchMovieGenres();
      const map = new Map<number, string>();
      tmdbGenres.forEach((genre: { id: number; name: string }) => {
        map.set(genre.id, genre.name);
      });
      setGenres(map);
    };
    getGenres();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const sections = [];

      // Example: Trending Movies
      const trendingMovies = await fetchTrendingMovies();
      if (trendingMovies && trendingMovies.length > 0) {
        sections.push({
          title: "Trending Now",
          reason: "Popular right now",
          movies: trendingMovies.slice(0, 6).map((movie: {
            id: number;
            title: string;
            poster_path: string | null;
            vote_average: number;
            release_date: string;
            genre_ids: number[];
          }) => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
            rating: movie.vote_average ? parseFloat(movie.vote_average.toFixed(1)) : 0,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
            genre: movie.genre_ids && movie.genre_ids.length > 0 ? movie.genre_ids.map((id: number) => genres.get(id)).filter(Boolean).join(", ") : "N/A",
          })),
        });
      }

      // Example: Recommendations based on a specific movie (e.g., Dune: Part Two - ID 507089)
      const duneMovieId = 507089; // Replace with a dynamic way to get user's liked movie
      const duneMovieDetails = await fetchMovieDetails(duneMovieId);
      if (duneMovieDetails && duneMovieDetails.recommendations && duneMovieDetails.recommendations.results.length > 0) {
        sections.push({
          title: `Because you liked ${duneMovieDetails.title}`,
          reason: "Similar tastes",
          movies: duneMovieDetails.recommendations.results.slice(0, 6).map((movie: {
            id: number;
            title: string;
            poster_path: string | null;
            vote_average: number;
            release_date: string;
            genre_ids: number[];
          }) => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
            rating: movie.vote_average ? parseFloat(movie.vote_average.toFixed(1)) : 0,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
            genre: movie.genre_ids && movie.genre_ids.length > 0 ? movie.genre_ids.map((id: number) => genres.get(id)).filter(Boolean).join(", ") : "N/A",
          })),
        });
      }

      // Example: Highly Rated Dramas (fetch popular movies and filter by genre)
      // This would require a more advanced TMDB API call or client-side filtering of a larger dataset
      // For now, let's just add a placeholder or fetch another trending list
      const popularMovies = await fetchTrendingMovies(); // Re-using trending for simplicity
      const dramaGenreId = Array.from(genres.entries()).find(([key, value]) => value === "Drama")?.[0];
      if (popularMovies && popularMovies.length > 0 && dramaGenreId) {
        const highlyRatedDramas = popularMovies.filter((movie: { genre_ids?: number[] }) => movie.genre_ids && movie.genre_ids.includes(dramaGenreId))
                                              .sort((a: { vote_average: number }, b: { vote_average: number }) => b.vote_average - a.vote_average)
                                              .slice(0, 6);
        if (highlyRatedDramas.length > 0) {
          sections.push({
            title: "Highly Rated Dramas",
            reason: "Critics' favorites",
            movies: highlyRatedDramas.map((movie: {
              id: number;
              title: string;
              poster_path: string | null;
              vote_average: number;
              release_date: string;
              genre_ids: number[];
            }) => ({
              id: movie.id,
              title: movie.title,
              poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
              rating: movie.vote_average ? parseFloat(movie.vote_average.toFixed(1)) : 0,
              year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
              genre: movie.genre_ids && movie.genre_ids.length > 0 ? movie.genre_ids.map((id: number) => genres.get(id)).filter(Boolean).join(", ") : "N/A",
            })),
          });
        }
      }

      setRecommendationSections(sections);
    };

    if (genres.size > 0) { // Only fetch recommendations once genres are loaded
      fetchRecommendations();
    }
  }, [genres]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="px-4 pt-20 pb-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Star className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">For You</h1>
            </div>
            <p className="text-gray-300">
              Personalized movie recommendations based on your preferences
            </p>
          </div>

          {/* Recommendation Sections */}
          <div className="space-y-12">
            {recommendationSections.map((section, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                  <Badge variant="secondary" className="text-sm">
                    {section.reason}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {section.movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stats Card */}
          <Card className="mt-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">23</div>
                  <div className="text-sm text-gray-300">Movies Watched</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">4.2</div>
                  <div className="text-sm text-gray-300">Avg Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">8</div>
                  <div className="text-sm text-gray-300">In Watchlist</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Sci-Fi</div>
                  <div className="text-sm text-gray-300">Favorite Genre</div>
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
