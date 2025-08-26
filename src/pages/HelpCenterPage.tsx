import React, { useState } from 'react';
import { HelpCircle, Search, User, Film, Star, MessageCircle, Bookmark, Settings, Monitor, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', icon: HelpCircle, color: 'from-purple-500 to-pink-500' },
    { name: 'Account', icon: User, color: 'from-blue-500 to-cyan-500' },
    { name: 'Movies', icon: Film, color: 'from-green-500 to-emerald-500' },
    { name: 'Recommendations', icon: Star, color: 'from-yellow-500 to-orange-500' },
    { name: 'Technical', icon: Monitor, color: 'from-indigo-500 to-purple-500' },
    { name: 'Privacy', icon: Shield, color: 'from-red-500 to-pink-500' }
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I create an account on PopcornPicks?",
      answer: "Creating an account is simple! Click the 'Sign In' button in the top navigation, then select 'Sign Up'. Enter your email, create a secure password, and you'll be ready to start discovering amazing movies tailored just for you.",
      category: "Account",
      tags: ["signup", "registration", "account"]
    },
    {
      id: 2,
      question: "How can I search for movies and discover new content?",
      answer: "Use our powerful search bar at the top of any page to find movies by title, genre, director, or actor. You can also browse our curated categories, trending movies, and personalized recommendations on the homepage.",
      category: "Movies",
      tags: ["search", "discovery", "browse"]
    },
    {
      id: 3,
      question: "How do I create and manage my watchlist?",
      answer: "Once you're logged in, simply click the bookmark icon on any movie card or detail page to add it to your watchlist. Access your watchlist anytime from the user menu to see all your saved movies.",
      category: "Movies",
      tags: ["watchlist", "save", "favorites"]
    },
    {
      id: 4,
      question: "How do PopcornPicks recommendations work?",
      answer: "Our AI-powered recommendation engine analyzes your viewing history, ratings, and preferences to suggest movies you'll love. The more you interact with the platform, the smarter our recommendations become!",
      category: "Recommendations",
      tags: ["AI", "personalization", "algorithm"]
    },
    {
      id: 5,
      question: "Is PopcornPicks completely free to use?",
      answer: "Yes! PopcornPicks is 100% free. We believe everyone should have access to great movie recommendations. Our platform is supported by partnerships with streaming services and movie studios.",
      category: "Account",
      tags: ["free", "pricing", "cost"]
    },
    {
      id: 6,
      question: "Why can't I see some movie details or trailers?",
      answer: "Movie availability depends on licensing agreements and regional restrictions. We're constantly working to expand our database and provide the most comprehensive movie information possible.",
      category: "Technical",
      tags: ["availability", "regions", "licensing"]
    },
    {
      id: 7,
      question: "How do you protect my personal data and privacy?",
      answer: "We take privacy seriously. Your data is encrypted, never sold to third parties, and only used to improve your movie discovery experience. Check our Privacy Policy for detailed information.",
      category: "Privacy",
      tags: ["privacy", "data", "security"]
    },
    {
      id: 8,
      question: "Can I rate and review movies?",
      answer: "Absolutely! Rating movies helps our recommendation engine understand your taste better. You can rate movies from 1-5 stars and leave detailed reviews to help other movie lovers.",
      category: "Movies",
      tags: ["rating", "reviews", "feedback"]
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50" />
          <div 
            className="w-full h-full opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <HelpCircle className="h-12 w-12 text-purple-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Help Center
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Get answers to your questions and make the most of your PopcornPicks experience
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`group relative overflow-hidden border-white/20 transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.name 
                      ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg` 
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                  }`}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id} className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {faq.question}
                    </CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={`ml-4 bg-gradient-to-r ${categories.find(c => c.name === faq.category)?.color || 'from-purple-500 to-pink-500'} text-white border-0 shrink-0`}
                    >
                      {faq.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">{faq.answer}</p>
                  <div className="flex flex-wrap gap-2">
                    {faq.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs text-purple-300 border-purple-300/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your search terms or browse different categories.</p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Can't find what you're looking for? Our support team is here to help you make the most of PopcornPicks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-3"
                >
                  <a href="/contact">Contact Support</a>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenterPage;