import type { ProgressCopy, ProgressMetric } from "./types";

export function ProgressPanel({ copy, stats }: { copy: ProgressCopy; stats: ProgressMetric[] }) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <header className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">{copy.title}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{copy.subtitle}</p>
      </header>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5 text-center shadow-sm"
          >
            <p className="text-3xl font-semibold text-[var(--foreground)]">{stat.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              {stat.label}
            </p>
            {stat.helper ? (
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{stat.helper}</p>
            ) : null}
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {copy.achievements.map((achievement) => (
          <article
            key={achievement.title}
            className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5"
          >
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{achievement.title}</h3>
            <p className="flex-1 text-sm text-[var(--muted-foreground)]">{achievement.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-[var(--primary)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary-foreground)] transition hover:brightness-95"
        >
          {copy.actions.viewAll}
        </button>
        <button
          type="button"
          className="rounded-full border border-[var(--border)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          {copy.actions.reset}
        </button>
        <button
          type="button"
          className="rounded-full border border-[var(--border)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          {copy.actions.share}
        </button>
      </div>
    </section>
  );
}
