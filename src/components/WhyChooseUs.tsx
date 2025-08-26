
import { Search, Heart, Star, Play, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Smart Movie Discovery",
    description: "Find your next favorite film with our intelligent search powered by TMDB's vast movie database.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Heart,
    title: "Personal Watchlist",
    description: "Save movies you want to watch and never forget about that perfect film recommendation again.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Star,
    title: "Expert Ratings",
    description: "Access real user ratings and reviews to make informed decisions about what to watch next.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: TrendingUp,
    title: "Trending Now",
    description: "Stay updated with the latest trending movies and discover what's popular in cinema right now.",
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    icon: Play,
    title: "Instant Trailers",
    description: "Watch movie trailers instantly to get a preview before adding films to your watchlist.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Users,
    title: "Cast & Crew Info",
    description: "Explore detailed information about your favorite actors, directors, and the people behind the movies.",
    gradient: "from-violet-500 to-purple-500"
  }
];

const WhyChooseUs = () => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599732026-0d5d56a00d3b?w=1920&h=1080&fit=crop&opacity=0.1')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/95 to-slate-900/90"></div>
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
            <Play className="h-8 w-8 text-purple-400" />
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              Why Choose <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">PopcornPicks</span>?
            </h2>
            <div className="h-1 w-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded"></div>
          </div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Your ultimate destination for movie discovery, where every film lover finds their perfect next watch
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className={`group bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden ${
                  index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'
                }`}
              >
                {/* Card background glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <CardContent className="p-8 text-center relative z-10">
                  <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Bottom decorative element */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500"></div>
            <Star className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium">Trusted by movie enthusiasts worldwide</span>
            <Star className="h-4 w-4 text-purple-400" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
