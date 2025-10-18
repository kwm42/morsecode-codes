export default function ApplicationsFunPage() {
  return (
  <section className="mx-auto flex max-w-5xl flex-col gap-8 py-16 px-6 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Applications &amp; Fun</h1>
  <p className="text-sm text-[var(--muted-foreground)]">
          Practical demonstrations and playful experiments that bring Morse code to life.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">SOS Signal Demo</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for visual and audio SOS walkthroughs with configurable tempo.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Light Signal Showcase</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for flashlight simulations and device control integrations.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm md:col-span-2">
          <h2 className="text-lg font-medium">Morse Puzzles &amp; Mini-games</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for puzzle generators, trivia, and collaborative challenges.
          </p>
        </article>
      </div>
    </section>
  );
}
