import {
  ArrowRight,
  Briefcase,
  Code,
  Database,
  Film,
  Heart,
  MessageCircle,
  Palette,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const JOBS = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "5+ years",
    description:
      "Build polished interfaces for movie lovers using React, TypeScript, and modern tooling.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    icon: Code,
  },
  {
    id: 2,
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "4+ years",
    description: "Design and run the services behind our recommendation engine and content APIs.",
    skills: ["Node.js", "Python", "AWS", "PostgreSQL"],
    icon: Database,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    description: "Craft the visual and interaction language of PopcornPicks across surfaces.",
    skills: ["Figma", "Design systems", "Prototyping", "User research"],
    icon: Palette,
  },
  {
    id: 4,
    title: "Data Scientist",
    department: "AI/ML",
    location: "Remote",
    type: "Full-time",
    experience: "4+ years",
    description: "Ship ML models that improve movie recommendations and personalization.",
    skills: ["Python", "TensorFlow", "Recsys", "Analytics"],
    icon: Star,
  },
  {
    id: 5,
    title: "Content Manager",
    department: "Content",
    location: "Los Angeles, CA",
    type: "Full-time",
    experience: "2+ years",
    description: "Curate editorial content, work with studios, and keep our catalogue sharp.",
    skills: ["Content writing", "Film knowledge", "SEO"],
    icon: Film,
  },
  {
    id: 6,
    title: "Community Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
    description: "Grow and steward our community of movie lovers across every channel.",
    skills: ["Social media", "Community", "Analytics"],
    icon: MessageCircle,
  },
];

const BENEFITS = [
  {
    icon: Heart,
    title: "Health & wellness",
    description: "Comprehensive medical, mental health support, and wellness stipend.",
  },
  {
    icon: Zap,
    title: "Flexible work",
    description: "Remote-first, flexible hours, and unlimited PTO.",
  },
  {
    icon: Trophy,
    title: "Growth & learning",
    description: "Annual learning budget, conference tickets, mentorship.",
  },
  {
    icon: Film,
    title: "Movie perks",
    description: "Free tickets, streaming subscriptions, premiere invitations.",
  },
];

const CareersPage = () => (
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <header className="mb-14 text-center">
      <p className="text-xs uppercase tracking-widest text-netflix-red">Careers</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Join our team
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
        Build the product millions of movie lovers use to find their next watch.
      </p>
    </header>

    {/* Benefits */}
    <section className="mb-16">
      <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Why PopcornPicks</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b) => {
          const Icon = b.icon;
          return (
            <Card key={b.title} className="border border-white/10 bg-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded bg-netflix-red/15">
                  <Icon className="h-5 w-5 text-netflix-red" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>

    {/* Job openings */}
    <section className="mb-16">
      <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Current openings</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {JOBS.map((job) => {
          const Icon = job.icon;
          return (
            <Card key={job.id} className="border border-white/10 bg-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-secondary">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {job.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{job.department}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground/80">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="border-white/20 text-muted-foreground"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{job.location}</span>
                  <span>{job.experience}</span>
                </div>
                <Button variant="primary-red" className="w-full">
                  Apply now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>

    {/* CTA */}
    <Card className="mx-auto max-w-3xl border border-white/10 bg-card">
      <CardContent className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded bg-netflix-red/15">
          <Briefcase className="h-6 w-6 text-netflix-red" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-foreground">Ready to apply?</h2>
        <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
          If you're passionate about movies and product, send your resume and a note about why
          PopcornPicks — we read every message.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="primary-red">
            <a href="mailto:careers@popcornpicks.com">Email your resume</a>
          </Button>
          <Button variant="glass">
            <MessageCircle className="mr-2 h-4 w-4" />
            Join talent community
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default CareersPage;
