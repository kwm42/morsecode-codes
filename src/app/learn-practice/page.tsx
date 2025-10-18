export default function LearnPracticePage() {
  return (
  <section className="mx-auto flex max-w-5xl flex-col gap-8 py-16 px-6 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Learn & Practice</h1>
  <p className="text-sm text-[var(--muted-foreground)]">
          Structured lessons, skill drills, and gamified progress tracking for Morse code learners.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Tutorial Modules</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for staged lesson content covering beginner to advanced material.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Practice Games</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for challenge modes including time trials and custom drills.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm md:col-span-2">
          <h2 className="text-lg font-medium">Achievements & Scores</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for progression tracking, badges, and leaderboard integration.
          </p>
        </article>
      </div>
    </section>
  );
}
