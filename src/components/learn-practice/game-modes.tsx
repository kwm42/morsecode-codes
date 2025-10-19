import type { GameCopy } from "./types";

export function GameModes({ copy }: { copy: GameCopy }) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <header className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">{copy.title}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{copy.subtitle}</p>
      </header>
      <div className="grid gap-5 md:grid-cols-3">
        {copy.items.map((item) => (
          <article
            key={item.title}
            className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5 text-left transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{item.title}</h3>
            <p className="flex-1 text-sm text-[var(--muted-foreground)]">{item.description}</p>
            <span className="inline-flex w-fit items-center rounded-full border border-dashed border-[var(--border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              {copy.comingSoonLabel}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
