import React from 'react';
import { Shield, Eye, Lock, UserCheck, Database, Gavel } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: [
        {
          subtitle: 'Personal Information',
          items: [
            'Email address for account creation and communication',
            'Name for personalization and profile display',
            'Movie preferences and ratings for recommendations',
            'Viewing history to improve our suggestion algorithms'
          ]
        },
        {
          subtitle: 'Usage Data',
          items: [
            'Pages visited and time spent on our platform',
            'Device information (browser type, operating system)',
            'IP address for security and analytics purposes',
            'Interaction patterns with movies and features'
          ]
        }
      ]
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Data',
      icon: UserCheck,
      content: [
        {
          subtitle: 'Service Improvement',
          items: [
            'Provide personalized movie recommendations',
            'Enhance platform performance and user experience',
            'Analyze trends to discover new features',
            'Maintain and improve our recommendation algorithms'
          ]
        },
        {
          subtitle: 'Communication',
          items: [
            'Send account-related notifications',
            'Share updates about new movies and features',
            'Provide customer support when needed',
            'Respond to your inquiries and feedback'
          ]
        }
      ]
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Security',
      icon: Lock,
      content: [
        {
          subtitle: 'Security Measures',
          items: [
            'Industry-standard encryption for data transmission',
            'Secure servers with regular security updates',
            'Limited access to personal data on need-to-know basis',
            'Regular security audits and vulnerability assessments'
          ]
        },
        {
          subtitle: 'Data Retention',
          items: [
            'Account data retained while your account is active',
            'Viewing history kept to improve recommendations',
            'Marketing preferences honored immediately',
            'Data deletion available upon account closure'
          ]
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights & Controls',
      icon: Eye,
      content: [
        {
          subtitle: 'Data Control',
          items: [
            'Access your personal data at any time',
            'Update or correct your information',
            'Delete your account and associated data',
            'Download your data in a portable format'
          ]
        },
        {
          subtitle: 'Privacy Preferences',
          items: [
            'Manage email notification settings',
            'Control data sharing with third parties',
            'Opt out of non-essential analytics',
            'Customize recommendation preferences'
          ]
        }
      ]
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
                <Shield className="h-12 w-12 text-purple-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Your privacy is important to us. Learn how we protect and handle your personal information at PopcornPicks.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                GDPR Compliant
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                CCPA Compliant
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                SOC 2 Certified
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Quick Summary */}
        <Card className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-white/20 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Privacy at a Glance</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Data Protection</h3>
                <p className="text-gray-300 text-sm">Your data is encrypted and securely stored</p>
              </div>
              <div>
                <Eye className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Full Transparency</h3>
                <p className="text-gray-300 text-sm">Clear information about data collection</p>
              </div>
              <div>
                <UserCheck className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Your Control</h3>
                <p className="text-gray-300 text-sm">Manage your data and privacy settings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections */}
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
                <CardContent className="space-y-6">
                  {section.content.map((subsection, index) => (
                    <div key={index}>
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">{subsection.subtitle}</h4>
                      <ul className="space-y-2">
                        {subsection.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start text-gray-300">
                            <span className="h-2 w-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Updates and Contact */}
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-white">
                <Gavel className="mr-3 h-5 w-5 text-purple-400" />
                Policy Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                We may update this Privacy Policy periodically. When we do, we'll notify you via email and post the updated policy on this page.
              </p>
              <p className="text-sm text-gray-400">
                Last updated: August 26, 2024
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-white">
                <Shield className="mr-3 h-5 w-5 text-purple-400" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Have questions about our privacy practices? We're here to help.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-purple-300">Email: privacy@popcornpicks.com</p>
                <p className="text-purple-300">Data Protection Officer: dpo@popcornpicks.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;