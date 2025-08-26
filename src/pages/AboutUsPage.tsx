import React from 'react';
import { Star, Heart, Users, Zap, Film, Award, Target, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const AboutUsPage: React.FC = () => {
  const teamMembers = [
    {
      name: "Alex Rodriguez",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Movie enthusiast with 15+ years in tech",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612c02f?w=150&h=150&fit=crop&crop=face",
      bio: "Full-stack engineer passionate about cinema",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Michael Thompson",
      role: "Content Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Film critic and content strategist",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Emma Wilson",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Designing delightful user experiences",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      name: "David Park",
      role: "Data Scientist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "ML expert crafting recommendation algorithms",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      name: "Lisa Kumar",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      bio: "Building our amazing movie-loving community",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Cinema",
      description: "We live and breathe movies, from indie gems to blockbusters",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building connections between movie lovers worldwide",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Pioneering the future of movie discovery technology",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Award,
      title: "Quality",
      description: "Curating the best content and experiences for our users",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative px-4 pt-24 pb-16 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599732026-0d5d56a00d3b?w=1920&h=800&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
              <Film className="h-10 w-10 text-purple-400" />
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                About <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">PopcornPicks</span>
              </h1>
              <div className="h-1 w-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded"></div>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Revolutionizing movie discovery through passion, technology, and community
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="px-4 pb-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {/* Mission */}
            <Card className="bg-gradient-to-br from-slate-800/50 via-purple-900/30 to-pink-900/30 border border-purple-500/30 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  To revolutionize how people discover and enjoy movies by creating the most intelligent, 
                  personalized, and community-driven platform in the world. We believe every movie lover 
                  deserves to find their perfect next watch.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="bg-gradient-to-br from-slate-800/50 via-purple-900/30 to-pink-900/30 border border-purple-500/30 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  A world where every film finds its audience and every viewer discovers stories that 
                  move them. We envision breaking down barriers between cultures, languages, and 
                  generations through the universal language of cinema.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
              <p className="text-xl text-gray-300">The principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="group bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-300">The passionate individuals behind PopcornPicks</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="group bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div className={`absolute -inset-1 bg-gradient-to-br ${member.gradient} rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="relative w-24 h-24 rounded-full mx-auto object-cover border-2 border-white/20"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <Badge variant="secondary" className="mb-3 bg-purple-600/20 text-purple-300">
                      {member.role}
                    </Badge>
                    <p className="text-gray-400 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20">
            <Card className="bg-gradient-to-br from-slate-800/50 via-purple-900/30 to-pink-900/30 border border-purple-500/30 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">PopcornPicks by the Numbers</h2>
                  <p className="text-gray-300">Our journey so far</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div className="group">
                    <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">1M+</div>
                    <div className="text-sm text-gray-300">Movies in Database</div>
                  </div>
                  <div className="group">
                    <div className="text-4xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">500K+</div>
                    <div className="text-sm text-gray-300">Active Users</div>
                  </div>
                  <div className="group">
                    <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">50M+</div>
                    <div className="text-sm text-gray-300">Recommendations Made</div>
                  </div>
                  <div className="group">
                    <div className="text-4xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">98%</div>
                    <div className="text-sm text-gray-300">User Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUsPage;