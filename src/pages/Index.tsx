
import { useState, useEffect } from "react";
import { Search, TrendingUp, Zap, Target, Download, ArrowDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MovieCard from "@/components/MovieCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToContent = () => {
    const element = document.getElementById('trending-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section - Full Screen */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop"
            alt="Cinema background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
        </div>

        {/* Hero Content */}
        <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Your Next
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              {" "}Favorite Movie
            </span>
            <br />Awaits
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Explore trending blockbusters, discover hidden gems, and get custom picks tailored just for you
          </p>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative flex gap-2 bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/20">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by title, genre, or year..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 pl-12 bg-transparent border-0 text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none text-lg"
                  />
                </div>
                <Link to={`/search?q=${encodeURIComponent(searchQuery)}`}>
                  <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-lg font-semibold">
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={scrollToContent}
            size="lg" 
            variant="outline" 
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full px-8 py-6 text-lg font-semibold group"
          >
            Start Exploring
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button onClick={scrollToContent} className="text-white/60 hover:text-white transition-colors">
            <ArrowDown className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Trending Section with Animation */}
      <div id="trending-section" className="bg-gradient-to-b from-black to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-12 justify-center">
            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center">Trending Now</h2>
            <div className="h-1 w-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded"></div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
            {trendingMovies.map((movie, index) => (
              <div 
                key={movie.id} 
                className={`flex-none w-72 snap-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Sections */}
      <WhyChooseUs />
      <TestimonialsCarousel />
      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default Index;
