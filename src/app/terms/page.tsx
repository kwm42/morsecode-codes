const termsSections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing MorseCode or using any of its services, you agree to these Terms of Use. If you do not agree, please discontinue use of the platform immediately.",
  },
  {
    title: "2. Use of the Service",
    body: "You may access MorseCode for personal, non-commercial purposes. Automated scraping, unauthorized reproduction, or disruption of the service is prohibited.",
  },
  {
    title: "3. Intellectual Property",
    body: "All site content, including text, graphics, and code, is owned or licensed by MorseCode. You may not reproduce or distribute materials without written permission.",
  },
  {
    title: "4. Disclaimer",
    body: 'The service is provided "as is." We make no guarantee regarding accuracy, uptime, or suitability for a specific purpose. You use MorseCode at your own risk.',
  },
  {
    title: "5. Changes to Terms",
    body: "We may update these Terms periodically. Continued use of the platform after updates constitutes acceptance of the revised Terms.",
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Terms of Use</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Understand your rights and responsibilities when using MorseCode tools and content.
        </p>
      </header>

      <div className="space-y-6">
        {termsSections.map((section) => (
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
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Contact</h2>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          Questions about these Terms? Reach the team at
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
