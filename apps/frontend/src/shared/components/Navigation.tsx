import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, LogOut, Menu, Plus, Search, Star, TrendingUp, User, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { useAppleLiquidGlassWebGL } from "@/shared/components/liquid-glass/useAppleLiquidGlassWebGL";
import { useAuth } from "@/features/authentication/context/AuthContext";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Film;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: TrendingUp },
  { href: "/browse", label: "Browse", icon: Film },
  { href: "/search", label: "Search", icon: Search },
  { href: "/recommendations", label: "For You", icon: Star },
  { href: "/watchlist", label: "Watchlist", icon: Plus },
];

const NavLinks = ({ onNavigate, activePath }: { onNavigate: () => void; activePath: string }) => (
  <>
    {NAV_ITEMS.map((item) => {
      const Icon = item.icon;
      const isActive = activePath === item.href;
      return (
        <Link
          key={item.href}
          to={item.href}
          onClick={onNavigate}
          className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
            isActive
              ? "text-netflix-red"
              : "text-foreground/70 hover:text-foreground"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden md:inline">{item.label}</span>
        </Link>
      );
    })}
  </>
);

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, status, logout } = useAuth();
  const authed = status === "authenticated" && !!user;
  const glassRef = useAppleLiquidGlassWebGL<HTMLElement>({
    tint: 0.35,
    tintTone: "dark",
    frost: 0.15,
    material: { refraction: 60 },
  });

  return (
    <header
      ref={glassRef}
      data-liquid-glass-target="nav"
      className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded bg-netflix-red p-1.5">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              PopcornPicks
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <NavLinks activePath={location.pathname} onNavigate={() => setIsOpen(false)} />
          </div>

          <div className="flex items-center gap-3">
            {authed ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="max-w-40 truncate text-sm text-foreground/70" title={user.email}>
                  {user.email}
                </span>
                <Button
                  variant="glass"
                  size="sm"
                  className="gap-2"
                  onClick={logout}
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:inline-flex">
                <Button variant="glass" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-netflix-bg border-white/10 text-white w-72">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <div className="rounded bg-netflix-red p-1.5">
                      <Film className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold">PopcornPicks</span>
                  </div>

                  <div className="flex flex-col gap-2 items-start">
                    <NavLinks activePath={location.pathname} onNavigate={() => setIsOpen(false)} />
                  </div>

                  {authed ? (
                    <div className="flex w-full flex-col gap-2">
                      <span className="truncate text-sm text-foreground/70" title={user.email}>
                        {user.email}
                      </span>
                      <Button
                        variant="glass"
                        className="w-full gap-2"
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant="primary-red" className="w-full gap-2">
                        <User className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  )}
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
