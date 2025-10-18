export default function AboutPage() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">About MorseCode</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Learn about the vision behind MorseCode and how we help learners, hobbyists, and professionals connect through rhythmic communication.
        </p>
      </header>

      <article className="space-y-4 text-base text-[var(--muted-foreground)]">
        <p>
          MorseCode is your go-to destination for discovering, practicing, and perfecting Morse code. We design intuitive tools that make it easy to translate messages, explore reference material, and build speed through playful practice sessions.
        </p>
        <p>
          We believe that the legacy of Morse communication deserves a modern home. Whether you are decoding your first dots and dashes or polishing contest-ready skills, the platform adapts to your pace with clear guidance and smart feedback loops.
        </p>
        <p>
          Our roadmap includes collaborative community events, real-time exercises, and integrations with hardware devices so you can connect with Morse enthusiasts worldwide.
        </p>
      </article>

      <section className="grid gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">What We Offer</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted-foreground)]">
            <li>Instant translator for text-to-Morse and Morse-to-text conversions.</li>
            <li>Comprehensive reference charts covering letters, numbers, and prosigns.</li>
            <li>Interactive lessons, drills, and challenge modes designed for every level.</li>
            <li>Fun signal demos, flashlight exercises, and puzzle-driven minigames.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Connect With Us</h2>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Share feedback, suggest new features, or inquire about partnerships any time. We love hearing from fellow Morse code enthusiasts.
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="font-semibold text-[var(--foreground)]">Email</dt>
              <dd>
                <a
                  className="text-[var(--primary)] transition hover:opacity-80"
                  href="mailto:support@morsecode.codes"
                >
                  support@morsecode.codes
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--foreground)]">Website</dt>
              <dd>
                <a
                  className="text-[var(--primary)] transition hover:opacity-80"
                  href="https://morsecode.codes"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://morsecode.codes
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </section>
  );
}
