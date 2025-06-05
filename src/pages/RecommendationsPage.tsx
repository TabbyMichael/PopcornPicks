
import { Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MovieCard from "@/components/MovieCard";

const recommendationSections = [
  {
    title: "Because you liked Dune: Part Two",
    reason: "Sci-Fi Adventures",
    movies: [
      { id: 6, title: "Blade Runner 2049", poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop", rating: 8.0, year: 2017, genre: "Sci-Fi" },
      { id: 7, title: "Arrival", poster: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop", rating: 7.9, year: 2016, genre: "Sci-Fi" },
      { id: 8, title: "Interstellar", poster: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=450&fit=crop", rating: 8.6, year: 2014, genre: "Sci-Fi" },
    ]
  },
  {
    title: "Trending in Action",
    reason: "Popular right now",
    movies: [
      { id: 9, title: "John Wick: Chapter 4", poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop", rating: 7.8, year: 2023, genre: "Action" },
      { id: 10, title: "Mission: Impossible 7", poster: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop", rating: 7.7, year: 2023, genre: "Action" },
      { id: 11, title: "Fast X", poster: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=450&fit=crop", rating: 6.9, year: 2023, genre: "Action" },
    ]
  },
  {
    title: "Highly Rated Dramas",
    reason: "Critics' favorites",
    movies: [
      { id: 12, title: "The Power of the Dog", poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop", rating: 7.4, year: 2021, genre: "Drama" },
      { id: 13, title: "Nomadland", poster: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop", rating: 7.3, year: 2020, genre: "Drama" },
      { id: 14, title: "Parasite", poster: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=450&fit=crop", rating: 8.5, year: 2019, genre: "Drama" },
    ]
  }
];

const RecommendationsPage = () => {
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
