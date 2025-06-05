import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Contact <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="mt-5 text-xl text-gray-300">We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
        </div>

      <div className="mt-12 max-w-lg mx-auto bg-white/10 backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Your Name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <div className="mt-1">
              <textarea
                id="message"
                name="message"
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Your message..."
              ></textarea>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <div className="bg-white/10 backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-purple-400 mr-3" />
            <h3 className="text-lg font-medium text-white">Email Us</h3>
          </div>
          <p className="text-gray-300 hover:text-purple-400 transition-colors">support@popcornpicks.com</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center mb-4">
            <Phone className="h-6 w-6 text-purple-400 mr-3" />
            <h3 className="text-lg font-medium text-white">Call Us</h3>
          </div>
          <p className="text-gray-300 hover:text-purple-400 transition-colors">+1 (555) 123-4567</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm shadow-lg overflow-hidden sm:rounded-xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center mb-4">
            <MapPin className="h-6 w-6 text-purple-400 mr-3" />
            <h3 className="text-lg font-medium text-white">Visit Us</h3>
          </div>
          <p className="text-gray-300 hover:text-purple-400 transition-colors">123 Movie Lane, Hollywood, CA</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Find Us On Social Media</h2>
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Facebook</span>
            {/* Facebook Icon */}
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22H12c5.523 0 10-4.477 10-10z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            {/* Twitter Icon */}
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c1.838 0 3.67-.504 5.203-1.474 1.535-.97 2.866-2.38 3.848-4.079.982-1.698 1.473-3.597 1.473-5.501 0-.15-.003-.299-.009-.448A10.02 10.02 0 0022 4.07c-.906.403-1.875.672-2.886.795.984-.589 1.74-1.437 2.093-2.482-.92.546-1.944.94-3.02 1.15-.87-.92-2.108-1.49-3.465-1.49-2.62 0-4.75 2.13-4.75 4.75 0 .37.04.73.116 1.075-3.95-.199-7.45-2.09-9.8-4.96-.407.7-.639 1.51-.639 2.38 0 1.64.83 3.09 2.09 3.94-.76-.02-1.47-.23-2.09-.57v.06c0 2.29 1.63 4.19 3.77 4.63-.4.11-.82.17-1.25.17-.307 0-.604-.03-1.01-.09.6 1.87 2.34 3.23 4.4 3.27-1.62 1.27-3.66 2.03-5.89 2.03-.38 0-.76-.02-1.13-.07 2.09 1.34 4.57 2.13 7.24 2.13z" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            {/* Instagram Icon */}
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.75 4.75a.75.75 0 100 1.5.75.75 0 000-1.5zM12 9a3 3 0 100 6 3 3 0 000-6zm-5.25 3a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
    </div>
  );
};

export default ContactPage;