import { Link, useLocation } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";

const NotFoundPage = () => {
  const location = useLocation();

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-widest text-netflix-red">Error 404</p>
      <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">Page not found</h1>
      <p className="mt-4 text-muted-foreground">
        We couldn't find <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{location.pathname}</code>.
        It may have been moved or never existed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/">
          <Button variant="primary-red">Back to home</Button>
        </Link>
        <Link to="/browse">
          <Button variant="glass">Browse movies</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
