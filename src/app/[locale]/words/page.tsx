import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildWordSlug, toWordEntries, type WordEntry } from "@/lib/words";

type WordsPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function WordsPage({ params }: WordsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("wordsPage");
  const wordsRaw = t.raw("words") as WordEntry[] | undefined;
  const introRaw = t.raw("intro") as string[] | undefined;
  const tipsRaw = t.raw("tips") as string[] | undefined;

  const words = toWordEntries(wordsRaw);
  const intro = Array.isArray(introRaw) ? introRaw : [];
  const tips = Array.isArray(tipsRaw) ? tipsRaw : [];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
        <p className="text-sm text-[var(--muted-foreground)] sm:text-base">{t("summary")}</p>
      </header>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">{t("listTitle")}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">{t("listDescription")}</p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {words.map((word) => {
            const slug = buildWordSlug(word.term);
            const href = `/${locale}/words/${slug}`;

            return (
              <li key={word.term}>
                <Link
                  href={href}
                  className="flex h-full flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-semibold text-[var(--foreground)]">{word.term}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                      Morse
                    </span>
                  </div>
                  <p className="font-mono text-base tracking-[0.6em] text-[var(--primary)]">
                    {word.morse}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--background)]/60 p-4 text-xs text-[var(--muted-foreground)]">
          {t("note")}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">{t("introTitle")}</h2>
        <div className="space-y-3 text-sm text-[var(--muted-foreground)]">
          {intro.map((paragraph, index) => (
            <p key={`intro-${index}`}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">{t("tipsTitle")}</h2>
        <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
          {tips.map((tip, index) => (
            <li
              key={`tip-${index}`}
              className="rounded-3xl border border-[var(--border)] bg-[var(--background)]/70 p-4"
            >
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
