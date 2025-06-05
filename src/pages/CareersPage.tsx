import React from 'react';
import { Briefcase, Users, ArrowRight } from 'lucide-react';

const CareersPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Join <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Our Team</span>
          </h1>
          <p className="mt-5 text-xl text-gray-300">Be a part of something big. Explore career opportunities at PopcornPicks.</p>
        </div>

      <div className="mt-12 space-y-12">
        <section className="bg-white/10 backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center mb-4">
            <Briefcase className="h-8 w-8 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Why Work With Us?</h2>
          </div>
          <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
            <li>Innovative and collaborative environment</li>
            <li>Opportunity to make a real impact on movie lovers worldwide</li>
            <li>Competitive salary and benefits package</li>
            <li>Flexible working hours and remote work options</li>
            <li>Continuous learning and development opportunities</li>
          </ul>
        </section>

        <section className="bg-white/10 backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Current Openings</h2>
          </div>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-gray-900">Frontend Developer</h3>
              <p className="text-gray-600">Develop and maintain user-facing features using React and TypeScript.</p>
              <p className="text-sm text-gray-500">Location: Remote</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-gray-900">Backend Engineer</h3>
              <p className="text-gray-600">Design and implement scalable backend services and APIs.</p>
              <p className="text-sm text-gray-500">Location: On-site, New York</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">UI/UX Designer</h3>
              <p className="text-gray-600">Create intuitive and engaging user interfaces for our platform.</p>
              <p className="text-sm text-gray-500">Location: Remote</p>
            </div>
          </div>
        </section>

        <section className="bg-white/10 backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center mb-4">
            <ArrowRight className="h-8 w-8 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">How to Apply</h2>
          </div>
          <p className="text-lg text-gray-200">
            If you're passionate about movies and technology, and you're looking for a challenging yet rewarding career, we'd love to hear from you! Please send your resume and cover letter to <a href="mailto:careers@popcornpicks.com" className="text-purple-400 hover:underline hover:text-pink-400 transition-colors">careers@popcornpicks.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
    </div>
  );
};

export default CareersPage;