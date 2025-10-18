import Link from "next/link";

const featureSections = [
  {
    title: "Morse Code Translator",
    description:
      "Translate your messages instantly using a clean interface with dual direction support.",
    bullets: [
      "Text to Morse and Morse back to text with smart formatting.",
      "Audio playback tools to audition patterns before you transmit.",
    ],
    href: "/translator",
    cta: "Start Translating",
  },
  {
    title: "Morse Code Alphabet & Number Chart",
    description:
      "Quick reference for Morse code letters, numbers, and common prosigns.",
    bullets: [
      "Filterable tables that make lookups effortless on any device.",
      "Download PDF guides or play audible dot and dash sequences.",
    ],
    href: "/chart",
    cta: "Browse Charts",
  },
  {
    title: "Morse Code Learning & Practice Games",
    description:
      "Interactive learning paths that grow with you from beginner to advanced operator.",
    bullets: [
      "Structured lessons, checkpoints, and adaptive drill sessions.",
      "Time challenge, survival, and custom practice playlists to stay sharp.",
    ],
    href: "/learn-practice",
    cta: "Start Learning",
  },
  {
    title: "Fun Morse Code Applications",
    description:
      "Bring Morse code to life with playful demos and real-world signal experiments.",
    bullets: [
      "SOS walkthroughs, flashlight signaling, and device-friendly tutorials.",
      "Brain-teasing puzzles and mini-games perfect for classrooms or meetups.",
    ],
    href: "/applications-fun",
    cta: "Explore Experiences",
  },
];

const articleHighlights = [
  {
    title: "History of Morse Code",
    description: "Trace the origin, evolution, and modern uses of Morse communication.",
    href: "/about-resources",
  },
  {
    title: "Top 5 Tips to Learn Morse Code Fast",
    description: "Train your ear and fingertips with practical daily exercises.",
    href: "/learn-practice",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-16 text-center sm:text-left">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--primary)]">
              Learn Morse Code Online
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Convert text to Morse, decode messages, and master rhythmic communication.
            </h1>
            <p className="text-base text-[var(--muted-foreground)] sm:text-lg">
              Explore a bright, modern toolkit for translators, learners, and hobbyists. Start with instant conversions, stay for interactive lessons, games, and community inspiration.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
            <Link
              href="/translator"
              className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-95"
            >
              Start Translating
            </Link>
            <Link
              href="/learn-practice"
              className="inline-flex items-center justify-center rounded-full border border-[var(--secondary)] px-6 py-3 text-sm font-semibold text-[var(--primary)] transition duration-150 hover:border-[var(--primary)] hover:opacity-80"
            >
              Discover Learning Paths
            </Link>
          </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <header className="mb-8 flex flex-col gap-3 text-center sm:text-left">
            <h2 className="text-3xl font-semibold text-[var(--foreground)]">Core Features of Morse Code</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Everything you need to translate, study, and have fun with Morse code in one place.
            </p>
          </header>
          <div className="space-y-6">
            {featureSections.map((feature) => (
              <section
                key={feature.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-left shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg"
              >
                <header className="space-y-2">
                  <h3 className="text-2xl font-semibold text-[var(--foreground)]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{feature.description}</p>
                </header>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted-foreground)]">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <Link
                  href={feature.href}
                  className="mt-6 inline-flex items-center rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-95"
                >
                  {feature.cta}
                </Link>
              </section>
            ))}
          </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <header className="mb-8 flex flex-col gap-3 text-center sm:text-left">
            <h2 className="text-3xl font-semibold text-[var(--foreground)]">Latest Articles &amp; News</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Fresh perspectives, study tips, and stories from the Morse code community.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {articleHighlights.map((article) => (
              <div
                key={article.title}
                className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-left shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{article.description}</p>
                </div>
                <Link
                  href={article.href}
                  className="mt-auto inline-flex items-center text-sm font-semibold text-[var(--primary)] transition duration-150 hover:opacity-80"
                >
                  Read More &rarr;
                </Link>
              </div>
            ))}
          </div>
      </section>
    </div>
  );
}
