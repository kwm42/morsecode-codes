import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MorseChart } from "@/components/chart/morse-chart";
import type { Locale } from "@/i18n/routing";
import { buildCanonicalPath } from "@/lib/metadata";

type ChartPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: ChartPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: {
      canonical: buildCanonicalPath(locale, "/chart"),
    },
  };
}

export default async function ChartPage({ params }: ChartPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("chart");

  const strings = {
    search: {
      label: t("search.label"),
      placeholder: t("search.placeholder"),
      clear: t("search.clear"),
      results: {
        zero: t("search.results.zero"),
        one: t("search.results.one"),
        other: t.raw("search.results.other"),
      },
    },
    columns: {
      section: t("columns.section"),
      symbol: t("columns.symbol"),
      morse: t("columns.morse"),
      pronunciation: t("columns.pronunciation"),
    },
    sections: {
      letters: {
        title: t("sections.letters.title"),
        description: t("sections.letters.description"),
      },
      numbers: {
        title: t("sections.numbers.title"),
        description: t("sections.numbers.description"),
      },
      symbols: {
        title: t("sections.symbols.title"),
        description: t("sections.symbols.description"),
      },
    },
    actions: {
      play: t("actions.play"),
      stop: t("actions.stop"),
      copy: t("actions.copy"),
      download: t("actions.download"),
      print: t("actions.print"),
      copied: t("actions.copied"),
      copyError: t("actions.copyError"),
      downloadReady: t("actions.downloadReady"),
      downloadError: t("actions.downloadError"),
      noAudio: t("actions.noAudio"),
    },
    pronunciation: {
      dot: t("pronunciation.dot"),
      dash: t("pronunciation.dash"),
    },
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
        <p className="text-sm text-[var(--muted-foreground)] sm:text-base">{t("description")}</p>
      </header>
      <MorseChart locale={locale} strings={strings} />
    </section>
  );
}
