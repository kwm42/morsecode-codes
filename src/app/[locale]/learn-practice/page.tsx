import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CtaBanner,
  GameModes,
  LearnHero,
  LearnOverview,
  PracticeDrills,
  type CtaCopy,
  type GameCopy,
  type LearnCopy,
  type LearnIntroCopy,
  type PracticeCopy,
} from "@/components/learn-practice";
import type { Locale } from "@/i18n/routing";

type LearnPracticePageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function LearnPracticePage({ params }: LearnPracticePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("learnPractice");
  const comingSoonLabel = t("comingSoon");

  const introCopy: LearnIntroCopy = {
    badge: t("intro.badge"),
    headline: t("intro.headline"),
    summary: t("intro.summary"),
  };

  const learnCopy: LearnCopy = {
    title: t("learn.title"),
    subtitle: t("learn.subtitle"),
    sections: t.raw("learn.sections") as LearnCopy["sections"],
    actions: {
      step: t("learn.actions.step"),
      auto: t("learn.actions.auto"),
      bookmark: t("learn.actions.bookmark"),
    },
    comingSoonLabel,
  };

  const practiceCopy: PracticeCopy = {
    title: t("practice.title"),
    subtitle: t("practice.subtitle"),
    drills: t.raw("practice.drills") as PracticeCopy["drills"],
    actions: {
      start: t("practice.actions.start"),
      customize: t("practice.actions.customize"),
      stats: t("practice.actions.stats"),
    },
    comingSoonLabel,
  };

  const gamesCopy: GameCopy = {
    title: t("games.title"),
    subtitle: t("games.subtitle"),
    items: t.raw("games.items") as GameCopy["items"],
    actions: {
      queue: t("games.actions.queue"),
      solo: t("games.actions.solo"),
      invite: t("games.actions.invite"),
    },
    comingSoonLabel,
  };

  const ctaCopy: CtaCopy = {
    headline: t("cta.headline"),
    body: t("cta.body"),
    primary: t("cta.primary"),
    secondary: t("cta.secondary"),
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold md:text-5xl">{t("title")}</h1>
        <p className="max-w-3xl text-sm text-[var(--muted-foreground)] md:text-base">
          {t("description")}
        </p>
      </header>
      <LearnHero copy={introCopy} />
      <LearnOverview copy={learnCopy} />
      <PracticeDrills copy={practiceCopy} />
      <GameModes copy={gamesCopy} />
      <CtaBanner copy={ctaCopy} locale={locale} />
    </main>
  );
}
