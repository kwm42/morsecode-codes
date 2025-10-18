import { getTranslations, setRequestLocale } from "next-intl/server";
import { TranslatorWorkspace } from "@/components/translator/translator-workspace";
import type { Locale } from "@/i18n/routing";

type TranslatorPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function TranslatorPage({ params }: TranslatorPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("translator");

  const strings = {
    mode: {
      label: t("mode.label"),
      auto: t("mode.auto"),
      text: t("mode.text"),
      morse: t("mode.morse"),
      autoDetectedText: t("mode.autoDetectedText"),
      autoDetectedMorse: t("mode.autoDetectedMorse"),
    },
    inputs: {
      sourceLabel: t("inputs.sourceLabel"),
      targetLabel: t("inputs.targetLabel"),
      textPlaceholder: t("inputs.textPlaceholder"),
      morsePlaceholder: t("inputs.morsePlaceholder"),
      targetPlaceholder: t("inputs.targetPlaceholder"),
    },
    actions: {
      clear: t("actions.clear"),
      copy: t("actions.copy"),
      share: t("actions.share"),
      download: t("actions.download"),
      play: t("actions.play"),
      stop: t("actions.stop"),
      flashLabel: t("actions.flashLabel"),
      flashStart: t("actions.flashStart"),
      flashStop: t("actions.flashStop"),
      historyHint: t("actions.historyHint"),
    },
    controls: {
      heading: t("controls.heading"),
      speed: t("controls.speed"),
      speedUnit: t("controls.speedUnit"),
      speedHelp: t("controls.speedHelp"),
      tone: t("controls.tone"),
      toneUnit: t("controls.toneUnit"),
      toneHelp: t("controls.toneHelp"),
    },
    history: {
      title: t("history.title"),
      empty: t("history.empty"),
      clear: t("history.clear"),
      restore: t("history.restore"),
    },
    notifications: {
      copied: t("notifications.copied"),
      copyError: t("notifications.copyError"),
      shareSuccess: t("notifications.shareSuccess"),
      shareError: t("notifications.shareError"),
      noMorse: t("notifications.noMorse"),
      downloadReady: t("notifications.downloadReady"),
      historyCleared: t("notifications.historyCleared"),
    },
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
        <p className="text-sm text-[var(--muted-foreground)] sm:text-base">{t("description")}</p>
      </header>
      <TranslatorWorkspace locale={locale} strings={strings} />
    </section>
  );
}
