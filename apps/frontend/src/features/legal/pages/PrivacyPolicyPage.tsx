import { InfoPage, InfoSection } from "@/shared/components/InfoPage";

const SECTIONS = [
  {
    title: "Information we collect",
    groups: [
      {
        subtitle: "Personal information",
        items: [
          "Email address for account creation and communication",
          "Name for personalization and profile display",
          "Movie preferences and ratings for recommendations",
          "Viewing history to improve our suggestion algorithms",
        ],
      },
      {
        subtitle: "Usage data",
        items: [
          "Pages visited and time spent on our platform",
          "Device information (browser type, operating system)",
          "IP address for security and analytics purposes",
          "Interaction patterns with movies and features",
        ],
      },
    ],
  },
  {
    title: "How we use your data",
    groups: [
      {
        subtitle: "Service improvement",
        items: [
          "Provide personalized movie recommendations",
          "Enhance platform performance and user experience",
          "Analyze trends to discover new features",
          "Maintain and improve our recommendation algorithms",
        ],
      },
      {
        subtitle: "Communication",
        items: [
          "Send account-related notifications",
          "Share updates about new movies and features",
          "Provide customer support when needed",
          "Respond to your inquiries and feedback",
        ],
      },
    ],
  },
  {
    title: "Data protection & security",
    groups: [
      {
        subtitle: "Security measures",
        items: [
          "Industry-standard encryption for data transmission",
          "Secure servers with regular security updates",
          "Limited access to personal data on need-to-know basis",
          "Regular security audits and vulnerability assessments",
        ],
      },
      {
        subtitle: "Data retention",
        items: [
          "Account data retained while your account is active",
          "Viewing history kept to improve recommendations",
          "Marketing preferences honored immediately",
          "Data deletion available upon account closure",
        ],
      },
    ],
  },
  {
    title: "Your rights & controls",
    groups: [
      {
        subtitle: "Data control",
        items: [
          "Access your personal data at any time",
          "Update or correct your information",
          "Delete your account and associated data",
          "Download your data in a portable format",
        ],
      },
      {
        subtitle: "Privacy preferences",
        items: [
          "Manage email notification settings",
          "Control data sharing with third parties",
          "Opt out of non-essential analytics",
          "Customize recommendation preferences",
        ],
      },
    ],
  },
];

const PrivacyPolicyPage = () => (
  <InfoPage
    eyebrow="Legal"
    title="Privacy Policy"
    subtitle="How PopcornPicks collects, uses, and protects your personal information. Last updated August 26, 2024."
  >
    {SECTIONS.map((section) => (
      <InfoSection key={section.title} title={section.title}>
        {section.groups.map((group) => (
          <div key={group.subtitle}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-netflix-red">
              {group.subtitle}
            </h3>
            <ul className="ml-4 list-disc space-y-1 text-foreground/80">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </InfoSection>
    ))}

    <InfoSection title="Policy updates">
      <p>
        We may update this Privacy Policy periodically. When we do, we'll notify you via email and
        post the updated policy on this page.
      </p>
    </InfoSection>

    <InfoSection title="Contact">
      <p>
        Questions about our privacy practices? Reach us at{" "}
        <a href="mailto:privacy@popcornpicks.com" className="text-primary hover:underline">
          privacy@popcornpicks.com
        </a>{" "}
        or write to our Data Protection Officer at{" "}
        <a href="mailto:dpo@popcornpicks.com" className="text-primary hover:underline">
          dpo@popcornpicks.com
        </a>
        .
      </p>
    </InfoSection>
  </InfoPage>
);

export default PrivacyPolicyPage;
