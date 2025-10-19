import type { LearnIntroCopy } from "./types";

export function LearnHero({ copy }: { copy: LearnIntroCopy }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] px-6 py-10 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 via-transparent to-[var(--secondary)]/20" />
      <div className="relative flex flex-col gap-4">
        <span className="inline-flex w-fit items-center rounded-full border border-[var(--primary)]/40 bg-[var(--background)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
          {copy.badge}
        </span>
        <h2 className="text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
          {copy.headline}
        </h2>
        <p className="max-w-2xl text-sm text-[var(--muted-foreground)] md:text-base">
          {copy.summary}
        </p>
      </div>
    </section>
  );
}
