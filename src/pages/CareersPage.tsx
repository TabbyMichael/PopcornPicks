import React from 'react';
import { Briefcase, Users, ArrowRight, Star, Film, Code, Palette, Database, MessageCircle, Trophy, Heart, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const CareersPage: React.FC = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "5+ years",
      description: "Build stunning user interfaces for movie lovers worldwide using React, TypeScript, and cutting-edge web technologies.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      icon: Code,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Senior Backend Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "4+ years",
      description: "Design and implement scalable backend services and APIs to power our movie recommendation engine.",
      skills: ["Node.js", "Python", "AWS", "PostgreSQL"],
      icon: Database,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Create intuitive and engaging user interfaces that make movie discovery a delightful experience.",
      skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
      icon: Palette,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Data Scientist",
      department: "AI/ML",
      location: "Remote",
      type: "Full-time",
      experience: "4+ years",
      description: "Develop machine learning algorithms to enhance our movie recommendation system and user personalization.",
      skills: ["Python", "TensorFlow", "ML Algorithms", "Data Analysis"],
      icon: Star,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      id: 5,
      title: "Content Manager",
      department: "Content",
      location: "Los Angeles, CA",
      type: "Full-time",
      experience: "2+ years",
      description: "Curate and manage movie content, write engaging descriptions, and work with industry partners.",
      skills: ["Content Writing", "Film Knowledge", "SEO", "Industry Relations"],
      icon: Film,
      gradient: "from-red-500 to-pink-500"
    },
    {
      id: 6,
      title: "Community Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      experience: "2+ years",
      description: "Build and engage our community of movie enthusiasts across social media and community platforms.",
      skills: ["Social Media", "Community Building", "Content Creation", "Analytics"],
      icon: MessageCircle,
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs"
    },
    {
      icon: Zap,
      title: "Flexible Work",
      description: "Remote-first culture with flexible hours and unlimited PTO"
    },
    {
      icon: Trophy,
      title: "Growth & Learning",
      description: "Learning budget, conference tickets, and career development opportunities"
    },
    {
      icon: Film,
      title: "Movie Perks",
      description: "Free movie tickets, streaming subscriptions, and exclusive premieres"
    }
  ];

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
                <Briefcase className="h-12 w-12 text-purple-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Join Our Team
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Be part of revolutionizing how the world discovers and enjoys movies. Join our passionate team of movie lovers and tech innovators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-4 text-lg"
              >
                View Open Positions
              </Button>
              <Button 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                Learn About Our Culture
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Why Work at PopcornPicks?
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.05] hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Current Openings
            </span>
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {jobOpenings.map((job) => {
              const IconComponent = job.icon;
              return (
                <Card key={job.id} className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className={`p-3 bg-gradient-to-r ${job.gradient} rounded-full mr-4`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                            {job.title}
                          </CardTitle>
                          <p className="text-gray-400">{job.department}</p>
                        </div>
                      </div>
                      <Badge className={`bg-gradient-to-r ${job.gradient} text-white border-0`}>
                        {job.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4 leading-relaxed">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-purple-300 border-purple-300/50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                      <span>📍 {job.location}</span>
                      <span>⏱️ {job.experience}</span>
                    </div>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${job.gradient} hover:scale-[1.02] transition-all text-white border-0`}
                    >
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Application Process */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Apply?</h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                If you're passionate about movies and technology, and you're looking for a challenging yet rewarding career, 
                we'd love to hear from you! Send your resume and a cover letter telling us why you want to join the PopcornPicks family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-3"
                >
                  <a href="mailto:careers@popcornpicks.com">
                    Email Us Your Resume
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Join Our Talent Community
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

export default CareersPage;