
import { useState } from "react";
import { Mail, Send, Popcorn, Film, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-black py-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4">
        <Card className="bg-gradient-to-br from-slate-800/40 via-purple-900/20 to-pink-900/20 border border-purple-500/30 backdrop-blur-xl shadow-2xl shadow-purple-500/10 relative overflow-hidden">
          {/* Card background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <CardContent className="relative p-8 md:p-16 text-center">
            {/* Header with icons */}
            <div className="mb-10">
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center rotate-12 animate-pulse">
                  <Popcorn className="h-6 w-6 text-white" />
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center -rotate-12 animate-pulse">
                  <Film className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Join the <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">PopcornPicks</span> Community
              </h2>
              <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
                Get exclusive movie recommendations, behind-the-scenes content, and be the first to know about trending films and hidden gems
              </p>
            </div>

            {/* Newsletter benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="flex items-center justify-center gap-3 text-black">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium">Weekly Movie Picks</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-black">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium">Exclusive Content</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-black">
                <Film className="h-5 w-5 text-pink-400" />
                <span className="text-sm font-medium">Early Access</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative flex gap-3 bg-slate-800/50 rounded-2xl p-2 border border-purple-500/30">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 bg-transparent border-0 text-white placeholder:text-gray-500 focus:ring-0 focus:outline-none text-lg font-medium"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    disabled={isSubmitted}
                  >
                    {isSubmitted ? (
                      <>
                        <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                        Subscribed!
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Join Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-sm text-black">
                🎬 No spam, unsubscribe anytime • 🍿 Join 10,000+ movie lovers • 🎭 100% free forever
              </p>
              <div className="flex items-center gap-2 text-xs text-black">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Trusted & Secure</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsletterSignup;
