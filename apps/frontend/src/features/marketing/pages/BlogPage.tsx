import { useState } from "react";
import { ArrowRight, Calendar, Clock } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  coverImage: string;
  featured: boolean;
};

const POSTS: Post[] = [
  {
    id: 1,
    title: "The Rise of Streaming Platforms: How They're Changing Cinema",
    slug: "rise-of-streaming-platforms",
    excerpt:
      "Netflix, Disney+, and the rest have reshaped how films get made, distributed, and discovered.",
    author: "Sarah Chen",
    authorRole: "Film Industry Analyst",
    publishedAt: "2024-08-25",
    readTime: 8,
    category: "Industry",
    tags: ["Streaming", "Netflix", "Technology"],
    coverImage: "https://images.unsplash.com/photo-1489599732026-0d5d56a00d3b?w=800&h=400&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "Top 10 Hidden Gems You Should Watch This Weekend",
    slug: "hidden-gems-weekend-watch",
    excerpt: "Incredible movies that flew under the radar and deserve a spot on your watchlist.",
    author: "Michael Rodriguez",
    authorRole: "Film Critic",
    publishedAt: "2024-08-24",
    readTime: 6,
    category: "Reviews",
    tags: ["Hidden Gems", "Recommendations"],
    coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop",
    featured: false,
  },
  {
    id: 3,
    title: "Behind the Scenes: The Making of Modern Blockbusters",
    slug: "making-modern-blockbusters",
    excerpt:
      "The craft, technology, and coordination behind today's biggest theatrical releases.",
    author: "Emma Wilson",
    authorRole: "Entertainment Journalist",
    publishedAt: "2024-08-23",
    readTime: 12,
    category: "Behind the Scenes",
    tags: ["Filmmaking", "CGI", "Directors"],
    coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=400&fit=crop",
    featured: true,
  },
  {
    id: 4,
    title: "The Psychology of Movie Recommendations",
    slug: "psychology-movie-recommendations",
    excerpt: "How collaborative filtering and modern ML actually predict what you'll enjoy.",
    author: "Dr. James Park",
    authorRole: "Data Scientist",
    publishedAt: "2024-08-22",
    readTime: 10,
    category: "Technology",
    tags: ["AI", "Recommendations", "ML"],
    coverImage: "https://images.unsplash.com/photo-1518709250212-898145525345?w=800&h=400&fit=crop",
    featured: false,
  },
  {
    id: 5,
    title: "International Cinema: Breaking Down Cultural Barriers",
    slug: "international-cinema-cultural-barriers",
    excerpt: "Why subtitled films are finding larger audiences — and what that means for storytelling.",
    author: "Lisa Kumar",
    authorRole: "Culture Editor",
    publishedAt: "2024-08-21",
    readTime: 7,
    category: "Culture",
    tags: ["International", "World Cinema"],
    coverImage: "https://images.unsplash.com/photo-15176049314427e9cb4c98f4679ada2e?w=800&h=400&fit=crop",
    featured: false,
  },
  {
    id: 6,
    title: "The Future of Cinema: Virtual Reality and Beyond",
    slug: "future-of-cinema-vr",
    excerpt: "Where immersive storytelling is heading, and whether it will replace the flat screen.",
    author: "Alex Rodriguez",
    authorRole: "Editor at Large",
    publishedAt: "2024-08-20",
    readTime: 9,
    category: "Technology",
    tags: ["VR", "Future", "Innovation"],
    coverImage: "https://images.unsplash.com/photo-1440404653325-ab127d31acc8?w=800&h=400&fit=crop",
    featured: false,
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(POSTS.map((p) => p.category)))];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const visible =
    selectedCategory === "All"
      ? POSTS
      : POSTS.filter((post) => post.category === selectedCategory);

  const featured = visible.find((p) => p.featured);
  const rest = visible.filter((p) => p !== featured);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-netflix-red">Blog</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Stories from the PopcornPicks newsroom
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Industry analysis, hidden gems, and the tech behind great recommendations.
        </p>
      </header>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "primary-red" : "glass"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {featured && (
        <Card className="mb-8 overflow-hidden border border-white/10 bg-card">
          <div className="grid lg:grid-cols-2">
            <div className="aspect-video overflow-hidden bg-secondary">
              <img
                src={featured.coverImage}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <CardContent className="flex flex-col justify-center p-8">
              <Badge variant="secondary" className="mb-3 w-fit bg-netflix-red text-white">
                Featured
              </Badge>
              <h2 className="mb-3 text-2xl font-bold text-foreground">{featured.title}</h2>
              <p className="mb-4 text-muted-foreground">{featured.excerpt}</p>
              <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{featured.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featured.readTime} min
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {featured.publishedAt}
                </span>
              </div>
              <Button variant="primary-red" className="w-fit">
                Read article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Card key={post.id} className="flex flex-col border border-white/10 bg-card">
            <div className="aspect-video overflow-hidden bg-secondary">
              <img
                src={post.coverImage}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <CardContent className="flex flex-1 flex-col p-6">
              <Badge variant="outline" className="mb-3 w-fit border-white/20 text-muted-foreground">
                {post.category}
              </Badge>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{post.title}</h3>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.readTime} min read</span>
              </div>
              <Button variant="glass" size="sm" className="w-fit">
                Read more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No articles in this category yet.
        </p>
      )}
    </div>
  );
};

export default BlogPage;
