import type { LearnCopy } from "./types";

const sectionAccentClass = [
  "border-[var(--accent)]/60",
  "border-[var(--primary)]/40",
  "border-[var(--secondary)]/40",
  "border-[var(--accent)]/50",
] as const;

export function LearnOverview({ copy }: { copy: LearnCopy }) {
  const cards = copy.sections.map((section, index) => ({
    ...section,
    accentClass: sectionAccentClass[index % sectionAccentClass.length],
  }));

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <header className="mb-6 flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">{copy.title}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{copy.subtitle}</p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <article
            key={card.title}
            className={`flex h-full flex-col gap-3 rounded-2xl border ${card.accentClass} bg-[var(--background)]/60 p-5 transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg`}
          >
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{card.title}</h3>
            <p className="flex-1 text-sm text-[var(--muted-foreground)]">{card.description}</p>
            <span className="inline-flex w-fit items-center rounded-full border border-dashed border-[var(--border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              {copy.comingSoonLabel}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
