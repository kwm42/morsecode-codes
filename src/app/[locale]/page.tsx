import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { buildCanonicalPath } from "@/lib/metadata";

const localizedPath = (locale: Locale, pathname: string) =>
  pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

type HomePageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: {
      canonical: buildCanonicalPath(locale),
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const featureSections = [
    {
      title: t("features.items.translator.title"),
      description: t("features.items.translator.description"),
      bullets: [
        t("features.items.translator.bullets.0"),
        t("features.items.translator.bullets.1"),
      ],
      href: localizedPath(locale, "/translator"),
      cta: t("features.items.translator.cta"),
    },
    {
      title: t("features.items.chart.title"),
      description: t("features.items.chart.description"),
      bullets: [
        t("features.items.chart.bullets.0"),
        t("features.items.chart.bullets.1"),
      ],
      href: localizedPath(locale, "/chart"),
      cta: t("features.items.chart.cta"),
    },
    {
      title: t("features.items.learn.title"),
      description: t("features.items.learn.description"),
      bullets: [
        t("features.items.learn.bullets.0"),
        t("features.items.learn.bullets.1"),
      ],
      href: localizedPath(locale, "/learn-practice"),
      cta: t("features.items.learn.cta"),
    },
    {
      title: t("features.items.fun.title"),
      description: t("features.items.fun.description"),
      bullets: [
        t("features.items.fun.bullets.0"),
        t("features.items.fun.bullets.1"),
      ],
      href: localizedPath(locale, "/applications-fun"),
      cta: t("features.items.fun.cta"),
    },
  ];

  const articleHighlights = [
    {
      title: t("articles.items.history.title"),
      description: t("articles.items.history.description"),
      href: `${localizedPath(locale, "/posts")}#${t("articles.items.history.slug")}`,
      cta: t("articles.items.history.cta"),
    },
    {
      title: t("articles.items.tips.title"),
      description: t("articles.items.tips.description"),
      href: `${localizedPath(locale, "/posts")}#${t("articles.items.tips.slug")}`,
      cta: t("articles.items.tips.cta"),
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-16 text-center sm:text-left">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--primary)]">
            {t("hero.tagline")}
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="text-base text-[var(--muted-foreground)] sm:text-lg">
            {t("hero.description")}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
          <Link
            href={localizedPath(locale, "/translator")}
            className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-95"
          >
            {t("hero.primaryCta")}
          </Link>
          <Link
            href={localizedPath(locale, "/learn-practice")}
            className="inline-flex items-center justify-center rounded-full border border-[var(--secondary)] px-6 py-3 text-sm font-semibold text-[var(--primary)] transition duration-150 hover:border-[var(--primary)] hover:opacity-80"
          >
            {t("hero.secondaryCta")}
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <header className="mb-8 flex flex-col gap-3 text-center sm:text-left">
          <h2 className="text-3xl font-semibold text-[var(--foreground)]">
            {t("features.title")}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {t("features.description")}
          </p>
        </header>
        <div className="space-y-6">
          {featureSections.map((feature) => (
            <section
              key={feature.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-left shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg"
            >
              <header className="space-y-2">
                <h3 className="text-2xl font-semibold text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {feature.description}
                </p>
              </header>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted-foreground)]">
                {feature.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <Link
                href={feature.href}
                className="mt-6 inline-flex items-center rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-95"
              >
                {feature.cta}
              </Link>
            </section>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <header className="mb-8 flex flex-col gap-3 text-center sm:text-left">
          <h2 className="text-3xl font-semibold text-[var(--foreground)]">
            {t("articles.title")}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {t("articles.description")}
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {articleHighlights.map((article) => (
            <div
              key={article.title}
              className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-left shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[var(--foreground)]">
                  {article.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {article.description}
                </p>
              </div>
              <Link
                href={article.href}
                className="mt-auto inline-flex items-center text-sm font-semibold text-[var(--primary)] transition duration-150 hover:opacity-80"
              >
                {article.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
