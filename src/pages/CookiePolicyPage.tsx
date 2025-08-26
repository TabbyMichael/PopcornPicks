import React, { useState } from 'react';
import { Cookie, Settings, Eye, BarChart3, Target, Shield, Info, Chrome, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const CookiePolicyPage: React.FC = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always required
    analytics: true,
    advertising: false,
    functional: true
  });

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      icon: Shield,
      description: 'These cookies are necessary for the website to function and cannot be disabled.',
      required: true,
      gradient: 'from-green-500 to-emerald-500',
      examples: [
        'User authentication and login sessions',
        'Security features and fraud prevention',
        'Basic website functionality',
        'GDPR consent preferences'
      ]
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      icon: Settings,
      description: 'These cookies enhance your experience by remembering your preferences.',
      required: false,
      gradient: 'from-blue-500 to-cyan-500',
      examples: [
        'Movie recommendation preferences',
        'Language and region settings',
        'Dark/light theme preferences',
        'Recently viewed movies'
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      icon: BarChart3,
      description: 'These cookies help us understand how you use our website to improve performance.',
      required: false,
      gradient: 'from-purple-500 to-pink-500',
      examples: [
        'Page views and user journey tracking',
        'Performance and error monitoring',
        'Feature usage statistics',
        'A/B testing for improvements'
      ]
    },
    {
      id: 'advertising',
      title: 'Advertising Cookies',
      icon: Target,
      description: 'These cookies are used to show you relevant movie recommendations and content.',
      required: false,
      gradient: 'from-yellow-500 to-orange-500',
      examples: [
        'Personalized movie suggestions',
        'Relevant content recommendations',
        'Cross-platform preference sync',
        'Third-party integration data'
      ]
    }
  ];

  const browserGuides = [
    {
      name: 'Chrome',
      icon: Chrome,
      url: 'https://support.google.com/accounts/answer/32050'
    },
    {
      name: 'Firefox',
      icon: Monitor,
      url: 'https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored'
    },
    {
      name: 'Safari',
      icon: Info,
      url: 'https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac'
    },
    {
      name: 'Edge',
      icon: Info,
      url: 'http://support.microsoft.com/kb/278835'
    }
  ];

  const handleCookieToggle = (cookieType: string) => {
    if (cookieType === 'essential') return; // Essential cookies can't be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType as keyof typeof prev]
    }));
  };

  const savePreferences = () => {
    // Save preferences to localStorage or send to backend
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Cookie preferences saved!');
  };

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
                <Cookie className="h-12 w-12 text-purple-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Cookie Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Learn how PopcornPicks uses cookies to enhance your movie discovery experience and protect your privacy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                Transparent Usage
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                User Control
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                Privacy Focused
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Cookie Explanation */}
        <Card className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-white/20 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Cookie className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="font-semibold text-purple-300 mb-2">Session Cookies</h3>
                <p className="text-sm">Temporary cookies that are deleted when you close your browser. Used for basic functionality during your visit.</p>
              </div>
              <div>
                <h3 className="font-semibold text-purple-300 mb-2">Persistent Cookies</h3>
                <p className="text-sm">Stored on your device for a set period to remember your preferences across multiple visits.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Types and Preferences */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cookie Preferences
            </span>
          </h2>
          
          <div className="space-y-6">
            {cookieTypes.map((cookie) => {
              const IconComponent = cookie.icon;
              const isEnabled = cookiePreferences[cookie.id as keyof typeof cookiePreferences];
              
              return (
                <Card key={cookie.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-3 bg-gradient-to-r ${cookie.gradient} rounded-full mr-4`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white">
                            {cookie.title}
                            {cookie.required && (
                              <Badge className="ml-2 bg-red-500/20 text-red-300 border-red-500/30">
                                Required
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-gray-300 text-sm mt-1">{cookie.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={() => handleCookieToggle(cookie.id)}
                        disabled={cookie.required}
                        className="data-[state=checked]:bg-purple-500"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-purple-300 mb-2">Examples:</h4>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {cookie.examples.map((example, index) => (
                        <li key={index} className="flex items-start text-gray-300 text-sm">
                          <span className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              onClick={savePreferences}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-3"
            >
              <Settings className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </div>

        {/* Browser Management */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Manage Cookies in Your Browser
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {browserGuides.map((browser) => {
              const IconComponent = browser.icon;
              return (
                <Card key={browser.name} className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.05] text-center">
                  <CardContent className="p-6">
                    <IconComponent className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">{browser.name}</h3>
                    <Button 
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      <a href={browser.url} target="_blank" rel="noopener noreferrer">
                        <Eye className="mr-1 h-3 w-3" />
                        Guide
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contact and Updates */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-white">
                <Info className="mr-3 h-5 w-5 text-purple-400" />
                Policy Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                We may update this Cookie Policy to reflect changes in our practices or for legal reasons. Check this page regularly for updates.
              </p>
              <p className="text-sm text-gray-400">
                Last updated: August 26, 2024
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-white">
                <Cookie className="mr-3 h-5 w-5 text-purple-400" />
                Questions?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Have questions about our cookie usage? Contact our privacy team for assistance.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-purple-300">Email: cookies@popcornpicks.com</p>
                <p className="text-purple-300">Privacy: privacy@popcornpicks.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicyPage;