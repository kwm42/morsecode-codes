import Link from "next/link";
import type { ApplicationsHeroProps } from "./types";

export function ApplicationsHero({ copy, locale }: ApplicationsHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] px-6 py-10 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--primary)]/15 via-transparent to-[var(--secondary)]/20" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex w-fit items-center rounded-full border border-[var(--primary)]/40 bg-[var(--background)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
            {copy.badge}
          </span>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
            {copy.headline}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] md:text-base">
            {copy.summary}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link
            href={`/${locale}/translator`}
            className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition hover:-translate-y-0.5 hover:brightness-95"
          >
            {copy.primaryCta}
          </Link>
          <Link
            href={`/${locale}/learn-practice`}
            className="inline-flex items-center justify-center rounded-full border border-[var(--secondary)] px-6 py-3 text-sm font-semibold text-[var(--primary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            {copy.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
