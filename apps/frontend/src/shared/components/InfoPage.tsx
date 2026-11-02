import type { ReactNode } from "react";

interface InfoPageProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Standard layout for static content pages (marketing, legal, support).
 * Netflix-style dark theme, single accent, no gradient one-offs.
 */
export const InfoPage = ({ eyebrow, title, subtitle, children }: InfoPageProps) => (
  <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <header className="mb-10 border-b border-white/10 pb-6">
      {eyebrow && (
        <p className="text-xs uppercase tracking-widest text-netflix-red">{eyebrow}</p>
      )}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </header>
    <div className="space-y-8 text-foreground/90">{children}</div>
  </div>
);

export const InfoSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <h2 className="mb-3 text-xl font-semibold text-foreground">{title}</h2>
    <div className="space-y-3 text-foreground/80">{children}</div>
  </section>
);
