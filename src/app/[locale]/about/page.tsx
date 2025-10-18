import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

type AboutPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const paragraphs = [t("body.p1"), t("body.p2"), t("body.p3")];
  const offerings = [
    t("offerings.items.0"),
    t("offerings.items.1"),
    t("offerings.items.2"),
    t("offerings.items.3"),
  ];

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-[var(--muted-foreground)]">{t("intro")}</p>
      </header>

      <article className="space-y-4 text-base text-[var(--muted-foreground)]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="grid gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {t("offerings.title")}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted-foreground)]">
            {offerings.map((offering) => (
              <li key={offering}>{offering}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {t("contact.title")}
          </h2>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            {t("contact.description")}
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="font-semibold text-[var(--foreground)]">
                {t("contact.emailLabel")}
              </dt>
              <dd>
                <a
                  className="text-[var(--primary)] transition hover:opacity-80"
                  href="mailto:support@morsecode.codes"
                >
                  support@morsecode.codes
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--foreground)]">
                {t("contact.websiteLabel")}
              </dt>
              <dd>
                <Link
                  className="text-[var(--primary)] transition hover:opacity-80"
                  href="https://morsecode.codes"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://morsecode.codes
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </section>
  );
}
