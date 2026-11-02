
import React, { useState, useEffect } from "react";
import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Loader2, Film } from "lucide-react";
import HomePage from "@/features/home/pages/HomePage";
import BrowsePage from "@/features/browse/pages/BrowsePage";
import SearchPage from "@/features/search/pages/SearchPage";
import MovieDetailPage from "@/features/movies/pages/MovieDetailPage";
import WatchlistPage from "@/features/watchlist/pages/WatchlistPage";
import RecommendationsPage from "@/features/recommendations/pages/RecommendationsPage";
import AuthPage from "@/features/authentication/pages/AuthPage";
import AboutUsPage from "@/features/marketing/pages/AboutUsPage";
import CareersPage from "@/features/marketing/pages/CareersPage";
import ContactPage from "@/features/marketing/pages/ContactPage";
import BlogPage from "@/features/marketing/pages/BlogPage";
import HelpCenterPage from "@/features/support/pages/HelpCenterPage";
import PrivacyPolicyPage from "@/features/legal/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/features/legal/pages/TermsOfServicePage";
import CookiePolicyPage from "@/features/legal/pages/CookiePolicyPage";
import NotFoundPage from "@/features/not-found/pages/NotFoundPage";
import { WatchlistProvider } from "@/features/watchlist/context/WatchlistContext";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

const queryClient = new QueryClient();

// Loading Animation Component
const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    {/* Cinema spotlight effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
    
    <div className="text-center">
      {/* Animated logo with glow */}
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div className="relative p-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <Film className="h-16 w-16 text-purple-400 animate-pulse" />
        </div>
      </div>
      
      {/* Loading spinner */}
      <div className="relative mb-6">
        <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto" />
      </div>
      
      {/* Loading text */}
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Loading
        </span>
      </h2>
      <p className="text-gray-300 text-lg">
        Preparing your cinema experience...
      </p>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-ping" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full opacity-40 animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50 animate-ping" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  </div>
);

// Navigation loader component that monitors route changes
const NavigationLoader = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  // Show loading when location changes
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsLoading(true);
      
      // Update location immediately (no artificial delay)
      setDisplayLocation(location);
      setIsLoading(false);
    }
  }, [location, displayLocation]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div style={{ display: isLoading ? 'none' : 'block' }}>
        {children}
      </div>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <WatchlistProvider>
        <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationLoader>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NavigationLoader>
      </BrowserRouter>
    </TooltipProvider>
    </WatchlistProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
