import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildCanonicalPath } from "@/lib/metadata";

type CommunityPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: {
      canonical: buildCanonicalPath(locale, "/community"),
    },
  };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("community");

  const sections = [
    {
      title: t("sections.board.title"),
      description: t("sections.board.description"),
    },
    {
      title: t("sections.creations.title"),
      description: t("sections.creations.description"),
    },
    {
      title: t("sections.leaderboard.title"),
      description: t("sections.leaderboard.description"),
    },
  ];

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-[var(--muted-foreground)]">{t("description")}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm"
          >
            <h2 className="text-lg font-medium">{section.title}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">{section.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
