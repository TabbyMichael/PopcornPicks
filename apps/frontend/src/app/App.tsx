import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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

import MainLayout from "@/layouts/MainLayout";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { WatchlistProvider } from "@/features/watchlist/context/WatchlistContext";
import { AuthProvider } from "@/features/authentication/context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WatchlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Auth is full-screen; intentionally outside the shared header/footer. */}
                <Route path="/auth" element={<AuthPage />} />

                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/movie/:id" element={<MovieDetailPage />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />
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
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WatchlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
