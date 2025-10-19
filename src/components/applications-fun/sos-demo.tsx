import type { SosCopy } from "./types";

export function SosDemo({ copy, comingSoonLabel }: { copy: SosCopy; comingSoonLabel: string }) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <header className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">{copy.title}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{copy.summary}</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        {copy.features.map((feature) => (
          <article
            key={feature.title}
            className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5"
          >
            <h3 className="text-base font-semibold text-[var(--foreground)]">{feature.title}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">{feature.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {copy.controls.map((control) => (
          <span
            key={control}
            className="inline-flex items-center rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]"
          >
            {control}
          </span>
        ))}
        <span className="inline-flex items-center rounded-full border border-dashed border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          {comingSoonLabel}
        </span>
      </div>
      <p className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4 text-xs text-[var(--muted-foreground)]">
        {copy.notes}
      </p>
    </section>
  );
}
