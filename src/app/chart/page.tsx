export default function ChartPage() {
  return (
  <section className="mx-auto flex max-w-5xl flex-col gap-8 py-16 px-6 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Morse Code Charts</h1>
  <p className="text-sm text-[var(--muted-foreground)]">
          Alphabet, numbers, and common symbol references with interactive playback and downloads.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Alphabet A-Z</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for letter table with dot and dash sequences and playback support.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Numbers 0-9</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for numeric reference grid with tone previews.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Common Symbols</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for punctuation, prosigns, and customizable entries.
          </p>
        </article>
      </div>

  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <h2 className="text-lg font-medium">Downloads & Audio</h2>
  <p className="text-sm text-[var(--muted-foreground)]">
          Placeholder for PDF exports, CSV downloads, and batch playback helpers.
        </p>
      </article>
    </section>
  );
}
