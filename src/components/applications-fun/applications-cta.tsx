import Link from "next/link";
import type { ApplicationsCtaCopy } from "./types";
import type { Locale } from "@/i18n/routing";

export function ApplicationsCta({ copy, locale }: { copy: ApplicationsCtaCopy; locale: Locale }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--primary)] px-6 py-10 text-[var(--primary-foreground)] shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-white/10" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-2xl font-semibold md:text-3xl">{copy.headline}</h2>
          <p className="text-sm opacity-80 md:text-base">{copy.body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/${locale}/translator`}
            className="inline-flex items-center justify-center rounded-full bg-[var(--primary-foreground)] px-6 py-3 text-sm font-semibold text-[var(--primary)] shadow-sm transition hover:opacity-90"
          >
            {copy.primary}
          </Link>
          <Link
            href={`/${locale}/learn-practice`}
            className="inline-flex items-center justify-center rounded-full border border-[var(--primary-foreground)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary-foreground)]/10"
          >
            {copy.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
