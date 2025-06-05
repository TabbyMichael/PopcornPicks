
import { useState } from "react";
import { Search, TrendingUp, Star, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MovieCard from "@/components/MovieCard";

const trendingMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop",
    rating: 8.5,
    year: 2024,
    genre: "Sci-Fi"
  },
  {
    id: 2,
    title: "Oppenheimer",
    poster: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop",
    rating: 8.8,
    year: 2023,
    genre: "Drama"
  },
  {
    id: 3,
    title: "The Batman",
    poster: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=450&fit=crop",
    rating: 8.2,
    year: 2022,
    genre: "Action"
  },
  {
    id: 4,
    title: "Spider-Man: No Way Home",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop",
    rating: 8.4,
    year: 2021,
    genre: "Action"
  },
  {
    id: 5,
    title: "Top Gun: Maverick",
    poster: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop",
    rating: 8.6,
    year: 2022,
    genre: "Action"
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative px-4 pt-20 pb-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Discover Your Next
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Favorite Movie
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Get personalized movie recommendations based on your taste. Discover trending films, hidden gems, and create your perfect watchlist.
            </p>
            
            {/* Search Bar */}
            <div className="mx-auto mt-10 max-w-2xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by title, genre, or year..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                  />
                </div>
                <Link to={`/search?q=${encodeURIComponent(searchQuery)}`}>
                  <Button size="lg" className="h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Movies Section */}
      <div className="px-4 pb-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {trendingMovies.map((movie) => (
              <div key={movie.id} className="flex-none w-64">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/recommendations">
              <Card className="group cursor-pointer bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-500/20 p-3">
                      <Star className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">For You</h3>
                      <p className="text-sm text-gray-400">Personalized recommendations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/watchlist">
              <Card className="group cursor-pointer bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-500/20 p-3">
                      <Plus className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">My Watchlist</h3>
                      <p className="text-sm text-gray-400">Movies to watch later</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/search">
              <Card className="group cursor-pointer bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-500/20 p-3">
                      <Search className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Browse Movies</h3>
                      <p className="text-sm text-gray-400">Explore by genre and more</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
