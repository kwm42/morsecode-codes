import { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

const SECTION_ORDER = [
  "introduction",
  "information",
  "cookies",
  "usage",
  "thirdParty",
  "rights",
  "updates",
] as const;

const SUPPORT_EMAIL = "support@morsecode.codes";

type PrivacyPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-[var(--muted-foreground)]">{t("intro")}</p>
      </header>

      <div className="space-y-6">
        {SECTION_ORDER.map((key) => {
          const title = t(`sections.${key}.title`);
          const body = t(`sections.${key}.body`);

          return (
            <article
              key={key}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
            </article>
          );
        })}
      </div>

      <footer className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          {t("sections.contact.title")}
        </h2>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          {t.rich("sections.contact.body", {
            email: (chunks: ReactNode) => (
              <a
                className="text-[var(--primary)] transition hover:opacity-80"
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </footer>
    </section>
  );
}
