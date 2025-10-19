import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ApplicationsCta,
  ApplicationsHero,
  LightDemo,
  PuzzlesShowcase,
  SosDemo,
  type ApplicationsPageCopy,
} from "@/components/applications-fun";
import type { Locale } from "@/i18n/routing";

type ApplicationsFunPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function ApplicationsFunPage({ params }: ApplicationsFunPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("applicationsFun");

  const pageCopy: ApplicationsPageCopy = {
    hero: {
      badge: t("hero.badge"),
      headline: t("hero.headline"),
      summary: t("hero.summary"),
      primaryCta: t("hero.primaryCta"),
      secondaryCta: t("hero.secondaryCta"),
    },
    sos: {
      title: t("sos.title"),
      summary: t("sos.summary"),
      features: t.raw("sos.features") as ApplicationsPageCopy["sos"]["features"],
      notes: t("sos.notes"),
      playLabel: t("sos.play"),
      stopLabel: t("sos.stop"),
      speedLabel: t("sos.speedLabel"),
      speedUnit: t("sos.speedUnit"),
      toneLabel: t("sos.toneLabel"),
      toneUnit: t("sos.toneUnit"),
      timelineTitle: t("sos.timelineTitle"),
      status: {
        ready: t("sos.status.ready"),
        playing: t("sos.status.playing"),
      },
      audioUnsupported: t("sos.audioUnsupported"),
    },
    light: {
      title: t("light.title"),
      summary: t("light.summary"),
      modes: t.raw("light.modes") as ApplicationsPageCopy["light"]["modes"],
      tips: t.raw("light.tips") as ApplicationsPageCopy["light"]["tips"],
      accessibility: t("light.accessibility"),
      controls: (() => {
        const controls = t.raw("light.controls") as ApplicationsPageCopy["light"]["controls"];
        return {
          start: controls.start,
          stop: controls.stop,
          presetLabel: controls.presetLabel,
          customLabel: controls.customLabel,
          customValue: controls.customValue,
          messageLabel: controls.messageLabel,
          messagePlaceholder: controls.messagePlaceholder,
          speedLabel: controls.speedLabel,
          speedUnit: controls.speedUnit,
          brightnessLabel: controls.brightnessLabel,
          colorLabel: controls.colorLabel,
          customColorLabel: controls.customColorLabel,
          colorPickerLabel: controls.colorPickerLabel,
          colorPickerHint: controls.colorPickerHint,
          readyStatus: controls.readyStatus,
          playingStatus: controls.playingStatus,
          emptyStatus: controls.emptyStatus,
          classroomHint: controls.classroomHint,
          presets: controls.presets,
          colorOptions: controls.colorOptions,
        };
      })(),
    },
    puzzles: {
      title: t("puzzles.title"),
      summary: t("puzzles.summary"),
      games: t.raw("puzzles.games") as ApplicationsPageCopy["puzzles"]["games"],
      note: t("puzzles.note"),
    },
    cta: {
      headline: t("cta.headline"),
      body: t("cta.body"),
      primary: t("cta.primary"),
      secondary: t("cta.secondary"),
    },
    comingSoonLabel: t("comingSoon"),
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold md:text-5xl">{t("title")}</h1>
        <p className="max-w-3xl text-sm text-[var(--muted-foreground)] md:text-base">
          {t("description")}
        </p>
      </header>
      <ApplicationsHero copy={pageCopy.hero} locale={locale} />
      <SosDemo copy={pageCopy.sos} />
      <LightDemo copy={pageCopy.light} />
      <PuzzlesShowcase
        copy={pageCopy.puzzles}
        comingSoonLabel={pageCopy.comingSoonLabel}
        locale={locale}
      />
      <ApplicationsCta copy={pageCopy.cta} locale={locale} />
    </main>
  );
}
