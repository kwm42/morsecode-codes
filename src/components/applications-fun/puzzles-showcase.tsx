import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import type { PuzzlesCopy } from "./types";

export function PuzzlesShowcase({
  copy,
  comingSoonLabel,
  locale,
}: {
  copy: PuzzlesCopy;
  comingSoonLabel: string;
  locale: Locale;
}) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <header className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">{copy.title}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{copy.summary}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {copy.games.map((game) => (
          <article
            key={game.title}
            className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-[var(--foreground)]">{game.title}</h3>
              <span className="inline-flex items-center rounded-full bg-[var(--secondary)]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-foreground)]">
                {game.difficulty}
              </span>
            </div>
            <p className="flex-1 text-sm text-[var(--muted-foreground)]">{game.description}</p>
            {game.available && game.slug ? (
              <Link
                href={`/${locale}/games/${game.slug}`}
                className="inline-flex w-fit items-center rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--primary-foreground)] shadow-sm transition hover:brightness-95"
              >
                {game.ctaLabel}
              </Link>
            ) : (
              <span className="inline-flex w-fit items-center rounded-full border border-dashed border-[var(--border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                {comingSoonLabel}
              </span>
            )}
          </article>
        ))}
      </div>
      <p className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4 text-xs text-[var(--muted-foreground)]">
        {copy.note}
      </p>
    </section>
  );
}
