import type { Locale } from "@/i18n/routing";

export type HeroCopy = {
  badge: string;
  headline: string;
  summary: string;
  primaryCta: string;
  secondaryCta: string;
};

export type SosFeature = {
  title: string;
  description: string;
};

export type SosCopy = {
  title: string;
  summary: string;
  features: SosFeature[];
  controls: string[];
  notes: string;
};

export type LightMode = {
  title: string;
  description: string;
};

export type LightCopy = {
  title: string;
  summary: string;
  modes: LightMode[];
  tips: string[];
  accessibility: string;
};

export type GameCard = {
  title: string;
  description: string;
  difficulty: string;
};

export type PuzzlesCopy = {
  title: string;
  summary: string;
  games: GameCard[];
  note: string;
};

export type ApplicationsCtaCopy = {
  headline: string;
  body: string;
  primary: string;
  secondary: string;
};

export type ApplicationsPageCopy = {
  hero: HeroCopy;
  sos: SosCopy;
  light: LightCopy;
  puzzles: PuzzlesCopy;
  cta: ApplicationsCtaCopy;
  comingSoonLabel: string;
};

export type ApplicationsHeroProps = {
  copy: HeroCopy;
  locale: Locale;
};
