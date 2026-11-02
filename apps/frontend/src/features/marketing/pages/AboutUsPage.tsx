import { Award, Heart, Sparkles, Target, Users, Zap } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";

const TEAM = [
  { name: "Alex Rodriguez", role: "CEO & Founder", bio: "Movie enthusiast with 15+ years in tech" },
  { name: "Sarah Chen", role: "Lead Developer", bio: "Full-stack engineer passionate about cinema" },
  { name: "Michael Thompson", role: "Content Director", bio: "Film critic and content strategist" },
  { name: "Emma Wilson", role: "UX Designer", bio: "Designing delightful user experiences" },
  { name: "David Park", role: "Data Scientist", bio: "ML expert crafting recommendation algorithms" },
  { name: "Lisa Kumar", role: "Community Manager", bio: "Building our movie-loving community" },
];

const VALUES = [
  { icon: Heart, title: "Passion for cinema", description: "We live and breathe movies, from indie gems to blockbusters." },
  { icon: Users, title: "Community first", description: "Building connections between movie lovers worldwide." },
  { icon: Zap, title: "Innovation", description: "Pioneering the future of movie discovery technology." },
  { icon: Award, title: "Quality", description: "Curating the best content and experiences for our users." },
];

const STATS = [
  { value: "1M+", label: "Movies in database" },
  { value: "500K+", label: "Active users" },
  { value: "50M+", label: "Recommendations made" },
  { value: "98%", label: "User satisfaction" },
];

const AboutUsPage = () => (
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <header className="mb-14 text-center">
      <p className="text-xs uppercase tracking-widest text-netflix-red">About</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        PopcornPicks
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
        Revolutionizing movie discovery through passion, technology, and community.
      </p>
    </header>

    {/* Mission & Vision */}
    <section className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border border-white/10 bg-card">
        <CardContent className="p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-netflix-red">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Our mission</h2>
          </div>
          <p className="text-foreground/80 leading-relaxed">
            To revolutionize how people discover and enjoy movies by creating the most
            intelligent, personalized, and community-driven platform in the world.
          </p>
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-card">
        <CardContent className="p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-netflix-red">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Our vision</h2>
          </div>
          <p className="text-foreground/80 leading-relaxed">
            A world where every film finds its audience and every viewer discovers stories that
            move them — across cultures, languages, and generations.
          </p>
        </CardContent>
      </Card>
    </section>

    {/* Values */}
    <section className="mb-16">
      <h2 className="mb-2 text-center text-2xl font-bold text-foreground">Our values</h2>
      <p className="mb-8 text-center text-muted-foreground">
        The principles that guide everything we do.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v) => {
          const Icon = v.icon;
          return (
            <Card key={v.title} className="border border-white/10 bg-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded bg-secondary">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>

    {/* Team */}
    <section className="mb-16">
      <h2 className="mb-2 text-center text-2xl font-bold text-foreground">Meet the team</h2>
      <p className="mb-8 text-center text-muted-foreground">The people behind PopcornPicks.</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((m) => (
          <Card key={m.name} className="border border-white/10 bg-card">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-foreground">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <h3 className="text-base font-semibold text-foreground">{m.name}</h3>
              <Badge variant="secondary" className="mt-1 bg-secondary text-secondary-foreground">
                {m.role}
              </Badge>
              <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    {/* Stats */}
    <Card className="border border-white/10 bg-card">
      <CardContent className="p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
          PopcornPicks by the numbers
        </h2>
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-netflix-red">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AboutUsPage;
