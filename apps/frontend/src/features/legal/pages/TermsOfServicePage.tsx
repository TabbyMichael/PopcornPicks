import { InfoPage, InfoSection } from "@/shared/components/InfoPage";

const SECTIONS = [
  {
    title: "Acceptance of terms",
    items: [
      "By accessing PopcornPicks, you agree to these Terms of Service.",
      "You must be at least 13 years old to use our service.",
      "If you disagree with any terms, please discontinue use immediately.",
      "These terms constitute a binding agreement between you and PopcornPicks.",
    ],
  },
  {
    title: "Service usage",
    items: [
      "PopcornPicks provides movie discovery and recommendation services.",
      "You may create an account to access personalized features.",
      "Use the service only for lawful purposes and personal enjoyment.",
      "Do not attempt to reverse engineer or compromise our systems.",
    ],
  },
  {
    title: "User responsibilities",
    items: [
      "Provide accurate information when creating your account.",
      "Keep your login credentials secure and confidential.",
      "Report any unauthorized use of your account immediately.",
      "Respect intellectual property rights of movie content and our platform.",
    ],
  },
  {
    title: "Prohibited activities",
    items: [
      "Do not share copyrighted movie content through our platform.",
      "Avoid spamming, harassment, or inappropriate behavior.",
      "Do not use automated tools to scrape or abuse our service.",
      "Do not attempt to gain unauthorized access to user accounts or data.",
    ],
  },
  {
    title: "Intellectual property",
    items: [
      "PopcornPicks and our logo are trademarks of our company.",
      "Movie data and images are provided by third-party services.",
      "User-generated content (reviews, ratings) remains your property.",
      "We reserve rights to our platform design, code, and algorithms.",
    ],
  },
  {
    title: "Liability & disclaimers",
    items: [
      'Service is provided "as is" without warranties of any kind.',
      "We are not responsible for accuracy of third-party movie information.",
      "Limitation of liability to the maximum extent permitted by law.",
      "No liability for indirect, incidental, or consequential damages.",
    ],
  },
];

const TermsOfServicePage = () => (
  <InfoPage
    eyebrow="Legal"
    title="Terms of Service"
    subtitle="Effective August 26, 2024 · Version 2.1. Please read carefully — these terms govern your use of PopcornPicks."
  >
    {SECTIONS.map((section) => (
      <InfoSection key={section.title} title={section.title}>
        <ul className="ml-4 list-disc space-y-1 text-foreground/80">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </InfoSection>
    ))}

    <InfoSection title="Governing law">
      <p>
        These terms are governed by the laws of California, United States, excluding conflict of
        law rules.
      </p>
    </InfoSection>

    <InfoSection title="Dispute resolution">
      <p>Any disputes will be resolved through binding arbitration in California, United States.</p>
    </InfoSection>

    <InfoSection title="Severability">
      <p>
        If any provision is deemed invalid, the remaining terms continue in full force and effect.
      </p>
    </InfoSection>

    <InfoSection title="Terms updates">
      <p>
        We may update these terms periodically. Material changes will be communicated via email and
        posted on this page at least 30 days in advance.
      </p>
    </InfoSection>

    <InfoSection title="Legal questions">
      <p>
        Reach our team at{" "}
        <a href="mailto:legal@popcornpicks.com" className="text-primary hover:underline">
          legal@popcornpicks.com
        </a>
        .
      </p>
    </InfoSection>
  </InfoPage>
);

export default TermsOfServicePage;
