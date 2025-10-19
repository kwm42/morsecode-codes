import type { LightCopy } from "./types";

export function LightDemo({ copy, comingSoonLabel }: { copy: LightCopy; comingSoonLabel: string }) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">{copy.title}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">{copy.summary}</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-dashed border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          {comingSoonLabel}
        </span>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {copy.modes.map((mode) => (
          <article
            key={mode.title}
            className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5"
          >
            <h3 className="text-base font-semibold text-[var(--foreground)]">{mode.title}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">{mode.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
        <ul className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm text-[var(--muted-foreground)]">
          {copy.tips.map((tip) => (
            <li key={tip} className="leading-relaxed">
              {tip}
            </li>
          ))}
        </ul>
        <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4 text-xs text-[var(--muted-foreground)]">
          {copy.accessibility}
        </p>
      </div>
    </section>
  );
}
