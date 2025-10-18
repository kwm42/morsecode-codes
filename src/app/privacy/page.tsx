const privacySections = [
  {
    title: "1. Introduction",
    body: "MorseCode respects your privacy. This policy explains how we collect, use, and safeguard information when you interact with the platform.",
  },
  {
    title: "2. Information We Collect",
    body: "We gather non-personal analytics data such as browser type, approximate location, and usage patterns. Personal information is only collected if you deliberately share it with us, such as when submitting feedback.",
  },
  {
    title: "3. Cookies",
    body: "Cookies help us remember preferences, enhance accessibility, and understand how features are used. You can disable cookies through your browser, though some functionality may be limited.",
  },
  {
    title: "4. Data Usage",
    body: "Aggregated data guides product improvements, performance monitoring, and reliability efforts. We do not sell or rent your information.",
  },
  {
    title: "5. Third-Party Services",
    body: "We may integrate privacy-friendly analytics providers. These partners process limited, anonymized data solely to deliver insights about feature usage.",
  },
  {
    title: "6. Your Rights",
    body: "You may request access to, correction of, or deletion of any personal information you have shared with us. Contact the team and we will respond promptly.",
  },
  {
    title: "7. Policy Updates",
    body: "We may revise this policy as the platform evolves. The latest version will always be available on this page with an updated effective date.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Learn how MorseCode handles analytics data, cookies, and user rights across our experiences.
        </p>
      </header>

      <div className="space-y-6">
        {privacySections.map((section) => (
          <article
            key={section.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
              {section.body}
            </p>
          </article>
        ))}
      </div>

      <footer className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Questions?</h2>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          If you have questions about this policy or wish to exercise your privacy rights, contact us at
          {" "}
          <a
            className="text-[var(--primary)] transition hover:opacity-80"
            href="mailto:support@morsecode.codes"
          >
            support@morsecode.codes
          </a>
          .
        </p>
      </footer>
    </section>
  );
}
