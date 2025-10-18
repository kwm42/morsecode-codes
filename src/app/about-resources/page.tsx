export default function AboutResourcesPage() {
  return (
  <section className="mx-auto flex max-w-4xl flex-col gap-8 py-16 px-6 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">About &amp; Resources</h1>
  <p className="text-sm text-[var(--muted-foreground)]">
          Background information, downloadable materials, and curated learning links.
        </p>
      </header>

      <div className="space-y-6">
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">About The Project</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for mission statement, team introductions, and roadmap highlights.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Downloads &amp; Kits</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for printable charts, practice sheets, and open data bundles.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">External Resources</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for curated tutorials, historical archives, and community groups.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">FAQ</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for common questions, troubleshooting, and contact pathways.
          </p>
        </article>
      </div>
    </section>
  );
}
