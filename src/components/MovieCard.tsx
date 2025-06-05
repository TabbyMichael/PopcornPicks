
import { Star, Play, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  year: number;
  genre: string;
}

interface MovieCardProps {
  movie: Movie;
  showAddToWatchlist?: boolean;
}

const MovieCard = ({ movie, showAddToWatchlist = true }: MovieCardProps) => {
  return (
    <Card className="group overflow-hidden bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Enhanced Overlay Actions */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex gap-2">
            <Link to={`/movie/${movie.id}`} className="flex-1">
              <Button size="sm" className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 transition-all duration-300">
                <Play className="h-3 w-3 mr-1" />
                Details
              </Button>
            </Link>
            {showAddToWatchlist && (
              <Button size="sm" variant="outline" className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 transition-all duration-300 hover:scale-110">
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Enhanced Rating Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-black/70 backdrop-blur-md text-white border-white/20 transition-all duration-300 group-hover:scale-110">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {movie.rating}
          </Badge>
        </div>

        {/* Genre Pill */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-purple-600/80 backdrop-blur-md text-white border-0 transition-all duration-300 group-hover:scale-110">
            {movie.genre}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="font-semibold text-white truncate hover:text-purple-400 transition-colors duration-300">
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-400">{movie.year}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
