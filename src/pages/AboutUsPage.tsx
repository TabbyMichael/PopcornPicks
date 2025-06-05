import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">About Us</h1>
        <p className="mt-5 text-xl text-gray-500">Discover our journey, mission, and the passionate team behind PopcornPicks.</p>
      </div>

      <div className="mt-12 space-y-12">
        <section className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700">
            Our mission at PopcornPicks is to revolutionize the way people discover and enjoy movies. We strive to provide a personalized and engaging platform that connects users with films they'll love, fostering a vibrant community of movie enthusiasts.
          </p>
        </section>

        <section className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-lg text-gray-700">
            We envision a world where every movie lover can easily find their next favorite film, share their passion with others, and explore the vast universe of cinema without limitations. PopcornPicks aims to be the go-to destination for all things movies.
          </p>
        </section>

        <section className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-lg text-gray-700 mb-4">
            We are a diverse team of movie buffs, tech innovators, and creative minds dedicated to building the best movie discovery platform. Our shared love for cinema drives us to constantly improve and expand PopcornPicks.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <li className="flex items-center space-x-4">
              <img className="h-16 w-16 rounded-full" src="https://via.placeholder.com/150" alt="Team Member" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Jane Doe</h3>
                <p className="text-gray-600">CEO & Founder</p>
              </div>
            </li>
            <li className="flex items-center space-x-4">
              <img className="h-16 w-16 rounded-full" src="https://via.placeholder.com/150" alt="Team Member" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">John Smith</h3>
                <p className="text-gray-600">Lead Developer</p>
              </div>
            </li>
            <li className="flex items-center space-x-4">
              <img className="h-16 w-16 rounded-full" src="https://via.placeholder.com/150" alt="Team Member" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Emily White</h3>
                <p className="text-gray-600">Content Strategist</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;