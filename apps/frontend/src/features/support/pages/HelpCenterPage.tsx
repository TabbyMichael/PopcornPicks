import { useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";

const CATEGORIES = ["All", "Account", "Movies", "Recommendations", "Technical", "Privacy"];

const FAQS = [
  {
    id: 1,
    question: "How do I create an account on PopcornPicks?",
    answer:
      "Click Sign In in the navigation, then choose Sign Up. Enter your email and a secure password — that's it.",
    category: "Account",
    tags: ["signup", "registration"],
  },
  {
    id: 2,
    question: "How can I search for movies and discover new content?",
    answer:
      "Use the search bar to find movies by title, genre, director, or actor. Browse trending and personalized recommendations from the homepage.",
    category: "Movies",
    tags: ["search", "discovery"],
  },
  {
    id: 3,
    question: "How do I create and manage my watchlist?",
    answer:
      "When signed in, click the bookmark on any movie card or detail page. Open /watchlist to see everything you've saved.",
    category: "Movies",
    tags: ["watchlist", "save"],
  },
  {
    id: 4,
    question: "How do PopcornPicks recommendations work?",
    answer:
      "Our engine considers your ratings, watchlist, and viewing history. The more you interact, the better the suggestions get.",
    category: "Recommendations",
    tags: ["AI", "personalization"],
  },
  {
    id: 5,
    question: "Is PopcornPicks completely free to use?",
    answer:
      "Yes — PopcornPicks is free. We're supported by studio and streaming partnerships, not ads on your data.",
    category: "Account",
    tags: ["free", "pricing"],
  },
  {
    id: 6,
    question: "Why can't I see some movie details or trailers?",
    answer:
      "Availability depends on licensing and region. Our catalogue grows every week as we add partners.",
    category: "Technical",
    tags: ["availability", "regions"],
  },
  {
    id: 7,
    question: "How do you protect my personal data and privacy?",
    answer:
      "Data is encrypted in transit and at rest, never sold, and used only to improve your experience. Details in our Privacy Policy.",
    category: "Privacy",
    tags: ["privacy", "security"],
  },
  {
    id: 8,
    question: "Can I rate and review movies?",
    answer:
      "Yes. Ratings feed directly into the recommendation engine and help other members decide what to watch next.",
    category: "Movies",
    tags: ["rating", "reviews"],
  },
];

const HelpCenterPage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const visible = FAQS.filter(
    (faq) =>
      (category === "All" || faq.category === category) &&
      (query.trim() === "" ||
        faq.question.toLowerCase().includes(query.toLowerCase()) ||
        faq.answer.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-netflix-red">Help Center</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How can we help?
        </h1>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 border-border bg-background pl-10"
        />
      </div>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? "primary-red" : "glass"}
            size="sm"
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* FAQ list */}
      <div className="space-y-4">
        {visible.map((faq) => (
          <Card key={faq.id} className="border border-white/10 bg-card">
            <CardContent className="p-6">
              <div className="mb-2 flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-foreground">{faq.question}</h2>
                <Badge variant="outline" className="flex-shrink-0 border-white/20 text-muted-foreground">
                  {faq.category}
                </Badge>
              </div>
              <p className="text-foreground/80">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
        {visible.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">
            No articles match your search. Try a different term or category.
          </p>
        )}
      </div>

      {/* Contact card */}
      <Card className="mt-10 border border-white/10 bg-card">
        <CardContent className="p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground">Still need help?</h3>
          <p className="mb-4 text-muted-foreground">
            Reach us any time at{" "}
            <a href="mailto:support@popcornpicks.com" className="text-primary hover:underline">
              support@popcornpicks.com
            </a>
            .
          </p>
          <Button asChild variant="primary-red">
            <a href="/contact">Contact support</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpCenterPage;
