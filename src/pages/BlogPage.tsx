import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, ArrowRight, Film, Star, TrendingUp, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  coverImage: string;
  featured: boolean;
}

const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Mock blog data with movie-related content
  const mockBlogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Rise of Streaming Platforms: How They're Changing Cinema",
      slug: "rise-of-streaming-platforms",
      excerpt: "Explore how Netflix, Disney+, and other streaming services are revolutionizing the way we consume movies and reshaping Hollywood.",
      content: "Full article content here...",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c02f?w=100&h=100&fit=crop&crop=face",
        role: "Film Industry Analyst"
      },
      publishedAt: "2024-08-25",
      readTime: 8,
      category: "Industry",
      tags: ["Streaming", "Netflix", "Technology"],
      coverImage: "https://images.unsplash.com/photo-1489599732026-0d5d56a00d3b?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "Top 10 Hidden Gems You Should Watch This Weekend",
      slug: "hidden-gems-weekend-watch",
      excerpt: "Discover incredible movies that flew under the radar but deserve a spot on your watchlist.",
      content: "Full article content here...",
      author: {
        name: "Michael Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        role: "Film Critic"
      },
      publishedAt: "2024-08-24",
      readTime: 6,
      category: "Reviews",
      tags: ["Hidden Gems", "Recommendations", "Weekend Watch"],
      coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 3,
      title: "Behind the Scenes: The Making of Modern Blockbusters",
      slug: "making-modern-blockbusters",
      excerpt: "An exclusive look into the incredible effort, technology, and creativity that goes into creating today's biggest movies.",
      content: "Full article content here...",
      author: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        role: "Entertainment Journalist"
      },
      publishedAt: "2024-08-23",
      readTime: 12,
      category: "Behind the Scenes",
      tags: ["Filmmaking", "CGI", "Directors"],
      coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: 4,
      title: "The Psychology of Movie Recommendations: How AI Knows Your Taste",
      slug: "psychology-movie-recommendations",
      excerpt: "Dive deep into the algorithms and machine learning that power modern movie recommendation systems.",
      content: "Full article content here...",
      author: {
        name: "Dr. James Park",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        role: "Data Scientist"
      },
      publishedAt: "2024-08-22",
      readTime: 10,
      category: "Technology",
      tags: ["AI", "Machine Learning", "Algorithms"],
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 5,
      title: "International Cinema: Breaking Down Cultural Barriers",
      slug: "international-cinema-cultural-barriers",
      excerpt: "How foreign films are gaining global recognition and changing the landscape of world cinema.",
      content: "Full article content here...",
      author: {
        name: "Lisa Kumar",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
        role: "Cultural Film Critic"
      },
      publishedAt: "2024-08-21",
      readTime: 9,
      category: "Culture",
      tags: ["International", "Culture", "Diversity"],
      coverImage: "https://images.unsplash.com/photo-1489599732026-0d5d56a00d3b?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 6,
      title: "The Future of Cinema: Virtual Reality and Beyond",
      slug: "future-cinema-virtual-reality",
      excerpt: "Exploring emerging technologies that will revolutionize how we experience movies in the coming decade.",
      content: "Full article content here...",
      author: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        role: "Tech Futurist"
      },
      publishedAt: "2024-08-20",
      readTime: 7,
      category: "Technology",
      tags: ["VR", "Future", "Innovation"],
      coverImage: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&h=400&fit=crop",
      featured: true
    }
  ];

  const categories = ['All', 'Industry', 'Reviews', 'Behind the Scenes', 'Technology', 'Culture'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlogPosts(mockBlogPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading amazing content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
                <Film className="h-12 w-12 text-purple-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Cinema Insights
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Dive deep into the world of movies with expert analysis, behind-the-scenes stories, and industry insights
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                    : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {selectedCategory === 'All' && featuredPosts.length > 0 && (
        <div className="px-4 pb-16 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-6 w-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="group bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                  <div className="relative">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-yellow-500 text-black font-semibold">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime} min read
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-white text-sm font-medium">{post.author.name}</p>
                          <p className="text-gray-400 text-xs">{formatDate(post.publishedAt)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                        Read More <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Regular Posts */}
      <div className="px-4 pb-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {selectedCategory !== 'All' && (
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="h-6 w-6 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">{selectedCategory} Articles</h2>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === 'All' ? regularPosts : filteredPosts).map((post) => (
              <Card key={post.id} className="group bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 overflow-hidden">
                <div className="relative">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-4 right-4 text-white hover:text-purple-400"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime} min
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <p className="text-white text-xs font-medium">{post.author.name}</p>
                        <p className="text-gray-400 text-xs">{formatDate(post.publishedAt)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white p-1">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No articles found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;