
import { Film, Twitter, Instagram, Youtube, Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Browse Movies" },
    { href: "/recommendations", label: "For You" },
    { href: "/watchlist", label: "Watchlist" },
  ];

  const companyLinks = [
    { href: "/about-us", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  const supportLinks = [
    { href: "/help-center", label: "Help Center" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/cookie-policy", label: "Cookie Policy" },
  ];

  const socialLinks = [
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-black to-slate-900 border-t border-purple-500/20">
      {/* Cinematic glow effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300" />
                <div className="relative rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-2.5">
                  <Film className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white tracking-tight">MovieRec</span>
                <span className="text-sm text-purple-300 font-medium">Cinema Experience</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Find your next favorite film. Discover trending blockbusters, hidden gems, and personalized recommendations.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="group p-2 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 relative">
              Navigation
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 relative">
              Company
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded" />
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 relative">
              Support
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded" />
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 MovieRec. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
                  Terms
                </a>
                <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
                  Cookies
                </a>
              </div>
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> for movie lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
