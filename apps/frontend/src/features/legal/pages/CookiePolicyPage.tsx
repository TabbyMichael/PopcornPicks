import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { InfoPage, InfoSection } from "@/shared/components/InfoPage";

type CookieKey = "essential" | "functional" | "analytics" | "advertising";

const COOKIE_TYPES: {
  id: CookieKey;
  title: string;
  description: string;
  required: boolean;
  examples: string[];
}[] = [
  {
    id: "essential",
    title: "Essential cookies",
    description: "Required for the site to function. Cannot be disabled.",
    required: true,
    examples: [
      "User authentication and login sessions",
      "Security features and fraud prevention",
      "Basic site functionality",
      "Consent preference storage",
    ],
  },
  {
    id: "functional",
    title: "Functional cookies",
    description: "Remember your preferences across visits.",
    required: false,
    examples: [
      "Movie recommendation preferences",
      "Language and region settings",
      "Recently viewed movies",
      "Interface personalization",
    ],
  },
  {
    id: "analytics",
    title: "Analytics cookies",
    description: "Help us understand how the product is used.",
    required: false,
    examples: [
      "Page views and user journey tracking",
      "Performance and error monitoring",
      "Feature usage statistics",
      "A/B testing for improvements",
    ],
  },
  {
    id: "advertising",
    title: "Advertising cookies",
    description: "Used to serve relevant content suggestions.",
    required: false,
    examples: [
      "Personalized movie suggestions",
      "Relevant content recommendations",
      "Cross-platform preference sync",
    ],
  },
];

const DEFAULT_PREFS: Record<CookieKey, boolean> = {
  essential: true,
  functional: true,
  analytics: true,
  advertising: false,
};

const BROWSER_GUIDES = [
  { name: "Chrome", url: "https://support.google.com/accounts/answer/32050" },
  {
    name: "Firefox",
    url: "https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored",
  },
  {
    name: "Safari",
    url: "https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac",
  },
  { name: "Edge", url: "https://support.microsoft.com/kb/278835" },
];

const CookiePolicyPage = () => {
  const [prefs, setPrefs] = useState<Record<CookieKey, boolean>>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFS;
    const stored = window.localStorage.getItem("cookiePreferences");
    if (!stored) return DEFAULT_PREFS;
    try {
      return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_PREFS;
    }
  });

  const toggle = (key: CookieKey) => {
    if (key === "essential") return;
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const save = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(prefs));
  };

  return (
    <InfoPage
      eyebrow="Legal"
      title="Cookie Policy"
      subtitle="How PopcornPicks uses cookies to power your experience — and how you can control them."
    >
      <InfoSection title="What are cookies?">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Session cookies</h3>
            <p>
              Temporary cookies that expire when you close your browser. Used for basic
              functionality during a single visit.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Persistent cookies</h3>
            <p>
              Stored on your device for a set period so we can remember preferences across
              multiple visits.
            </p>
          </div>
        </div>
      </InfoSection>

      <InfoSection title="Your cookie preferences">
        <div className="space-y-4">
          {COOKIE_TYPES.map((cookie) => (
            <Card key={cookie.id} className="border border-white/10 bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-lg text-foreground">{cookie.title}</CardTitle>
                  <Switch
                    checked={prefs[cookie.id]}
                    onCheckedChange={() => toggle(cookie.id)}
                    disabled={cookie.required}
                    aria-label={`Toggle ${cookie.title}`}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{cookie.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="ml-4 list-disc text-sm text-muted-foreground">
                  {cookie.examples.map((ex) => (
                    <li key={ex}>{ex}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <Button variant="primary-red" onClick={save}>
              Save preferences
            </Button>
            <Button variant="glass" onClick={() => setPrefs(DEFAULT_PREFS)}>
              Reset to defaults
            </Button>
          </div>
        </div>
      </InfoSection>

      <InfoSection title="Managing cookies in your browser">
        <p>You can also control cookies directly from your browser settings:</p>
        <ul className="ml-4 list-disc space-y-1">
          {BROWSER_GUIDES.map((g) => (
            <li key={g.name}>
              <a
                href={g.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {g.name} cookie settings
              </a>
            </li>
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Questions?">
        <p>
          Email us at{" "}
          <a href="mailto:privacy@popcornpicks.com" className="text-primary hover:underline">
            privacy@popcornpicks.com
          </a>
          .
        </p>
      </InfoSection>
    </InfoPage>
  );
};

export default CookiePolicyPage;
