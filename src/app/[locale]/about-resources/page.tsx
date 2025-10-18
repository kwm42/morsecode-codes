import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

type AboutResourcesPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function AboutResourcesPage({ params }: AboutResourcesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutResources");

  const sections = [
    {
      title: t("sections.about.title"),
      description: t("sections.about.description"),
    },
    {
      title: t("sections.downloads.title"),
      description: t("sections.downloads.description"),
    },
    {
      title: t("sections.external.title"),
      description: t("sections.external.description"),
    },
    {
      title: t("sections.faq.title"),
      description: t("sections.faq.description"),
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
