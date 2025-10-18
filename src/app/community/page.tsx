export default function CommunityPage() {
  return (
  <section className="mx-auto flex max-w-4xl flex-col gap-8 py-16 px-6 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Community &amp; Sharing</h1>
  <p className="text-sm text-[var(--muted-foreground)]">
          Social hub for discussions, project highlights, and community rankings.
        </p>
      </header>

      <div className="space-y-6">
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Message Board</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for threaded conversations, moderation tools, and reactions.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">User Creations</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for gallery uploads, showcases, and content tagging.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Leaderboard &amp; Social</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for scoring integrations, share buttons, and community goals.
          </p>
        </article>
      </div>
    </section>
  );
}
