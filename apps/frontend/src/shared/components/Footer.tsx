import { Link } from "react-router-dom";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/recommendations", label: "For You" },
  { href: "/watchlist", label: "Watchlist" },
];

const COMPANY_LINKS = [
  { href: "/about-us", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

const SUPPORT_LINKS = [
  { href: "/help-center", label: "Help Center" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

const LinkColumn = ({ title, links }: { title: string; links: { href: string; label: string }[] }) => (
  <div>
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
      {title}
    </h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            to={link.href}
            className="text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="border-t border-white/10 bg-netflix-bg">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="mb-4 inline-flex flex-col">
            <span className="text-xl font-bold tracking-tight text-netflix-red">
              PopcornPicks
            </span>
            <span className="text-xs uppercase tracking-widest text-foreground/60">
              Movie Discovery
            </span>
          </Link>
          <p className="text-sm text-foreground/60 leading-relaxed">
            Discover trending movies, get personalized picks, and keep everything
            you want to watch in one place.
          </p>
        </div>

        <LinkColumn title="Navigation" links={QUICK_LINKS} />
        <LinkColumn title="Company" links={COMPANY_LINKS} />
        <LinkColumn title="Support" links={SUPPORT_LINKS} />
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
        <p className="text-sm text-foreground/60">
          &copy; {new Date().getFullYear()} PopcornPicks. All rights reserved.
        </p>
        <p className="text-sm text-foreground/50">
          Data provided by TMDB.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
