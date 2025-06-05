
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Star, Plus, TrendingUp, Menu, X, Film, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: TrendingUp },
    { href: "/search", label: "Browse", icon: Search },
    { href: "/recommendations", label: "For You", icon: Star },
    { href: "/watchlist", label: "Watchlist", icon: Plus },
  ];

  const NavContent = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium ${
              isActive
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                : "text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-md"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-black via-slate-900 to-black backdrop-blur-lg border-b border-purple-500/20 shadow-lg shadow-black/50">
      {/* Cinema spotlight effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent pointer-events-none" />
      
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300" />
              <div className="relative rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-2.5">
                <Film className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">MovieRec</span>
              <span className="text-xs text-purple-300 font-medium hidden sm:block">Cinema Experience</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <NavContent />
          </div>

          {/* Sign In Button & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Sign In Button - Movie Ticket Style */}
            <Button 
              variant="outline" 
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-black font-semibold rounded-full px-6 py-2 hover:from-amber-400 hover:to-orange-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/25"
            >
              <User className="h-4 w-4" />
              Sign In
            </Button>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="bg-gradient-to-b from-slate-900 to-black border-purple-500/20 backdrop-blur-lg"
              >
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-2">
                      <Film className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">MovieRec</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <NavContent />
                  </div>
                  
                  <Button 
                    className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold hover:from-amber-400 hover:to-orange-400"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
