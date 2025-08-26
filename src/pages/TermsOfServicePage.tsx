import React from 'react';
import { FileText, UserCheck, Scale, Shield, AlertCircle, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const TermsOfServicePage: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: UserCheck,
      content: [
        'By accessing PopcornPicks, you agree to these Terms of Service',
        'You must be at least 13 years old to use our service',
        'If you disagree with any terms, please discontinue use immediately',
        'These terms constitute a binding agreement between you and PopcornPicks'
      ]
    },
    {
      id: 'service-usage',
      title: 'Service Usage',
      icon: Globe,
      content: [
        'PopcornPicks provides movie discovery and recommendation services',
        'You may create an account to access personalized features',
        'Use the service only for lawful purposes and personal enjoyment',
        'Do not attempt to reverse engineer or compromise our systems'
      ]
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      icon: Shield,
      content: [
        'Provide accurate information when creating your account',
        'Keep your login credentials secure and confidential',
        'Report any unauthorized use of your account immediately',
        'Respect intellectual property rights of movie content and our platform'
      ]
    },
    {
      id: 'prohibited-activities',
      title: 'Prohibited Activities',
      icon: AlertCircle,
      content: [
        'Do not share copyrighted movie content through our platform',
        'Avoid spamming, harassment, or inappropriate behavior',
        'Do not use automated tools to scrape or abuse our service',
        'Do not attempt to gain unauthorized access to user accounts or data'
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: FileText,
      content: [
        'PopcornPicks and our logo are trademarks of our company',
        'Movie data and images are provided by third-party services',
        'User-generated content (reviews, ratings) remains your property',
        'We reserve rights to our platform design, code, and algorithms'
      ]
    },
    {
      id: 'liability-disclaimers',
      title: 'Liability & Disclaimers',
      icon: Scale,
      content: [
        'Service is provided "as is" without warranties of any kind',
        'We are not responsible for accuracy of third-party movie information',
        'Limitation of liability to the maximum extent permitted by law',
        'No liability for indirect, incidental, or consequential damages'
      ]
    }
  ];

  const keyPoints = [
    {
      title: 'Free Service',
      description: 'PopcornPicks is free to use with no hidden fees',
      icon: '🎬'
    },
    {
      title: 'Fair Use',
      description: 'Use our service responsibly and respect other users',
      icon: '🤝'
    },
    {
      title: 'Data Protection',
      description: 'Your privacy is protected under our Privacy Policy',
      icon: '🔐'
    },
    {
      title: 'Updates',
      description: 'Terms may be updated with notice to users',
      icon: '📋'
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
                <FileText className="h-12 w-12 text-purple-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              These terms govern your use of PopcornPicks. Please read them carefully to understand your rights and responsibilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                Effective: August 26, 2024
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                Version 2.1
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Key Points Summary */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Terms at a Glance
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyPoints.map((point, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.05] text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{point.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
                  <p className="text-gray-300 text-sm">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-white">
                    <IconComponent className="mr-3 h-6 w-6 text-purple-400" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <span className="h-2 w-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Important Legal Information */}
        <div className="max-w-4xl mx-auto mt-16 space-y-8">
          <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-white">
                <AlertCircle className="mr-3 h-5 w-5 text-yellow-400" />
                Important Legal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-yellow-300 mb-2">Governing Law</h4>
                <p className="text-gray-300">These terms are governed by the laws of California, United States, excluding conflict of law rules.</p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-300 mb-2">Dispute Resolution</h4>
                <p className="text-gray-300">Any disputes will be resolved through binding arbitration in California, United States.</p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-300 mb-2">Severability</h4>
                <p className="text-gray-300">If any provision is deemed invalid, the remaining terms continue in full force and effect.</p>
              </div>
            </CardContent>
          </Card>

          {/* Updates and Contact */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-white">
                  <FileText className="mr-3 h-5 w-5 text-purple-400" />
                  Terms Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  We may update these terms periodically. Material changes will be communicated via email and posted on this page at least 30 days in advance.
                </p>
                <p className="text-sm text-gray-400">
                  Last updated: August 26, 2024
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-white">
                  <Scale className="mr-3 h-5 w-5 text-purple-400" />
                  Legal Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Have questions about these terms? Our legal team is here to help clarify any concerns.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-purple-300">Email: legal@popcornpicks.com</p>
                  <p className="text-purple-300">Terms: terms@popcornpicks.com</p>
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

export default TermsOfServicePage;