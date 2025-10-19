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

export type SosStatusCopy = {
  ready: string;
  playing: string;
};

export type SosCopy = {
  title: string;
  summary: string;
  features: SosFeature[];
  notes: string;
  playLabel: string;
  stopLabel: string;
  speedLabel: string;
  speedUnit: string;
  toneLabel: string;
  toneUnit: string;
  timelineTitle: string;
  status: SosStatusCopy;
  audioUnsupported: string;
};

export type LightMode = {
  title: string;
  description: string;
};

export type LightPresetOption = {
  value: string;
  label: string;
  message: string;
  speed: number;
};

export type LightColorOption = {
  value: string;
  label: string;
};

export type LightControlsCopy = {
  start: string;
  stop: string;
  presetLabel: string;
  customLabel: string;
  customValue: string;
  messageLabel: string;
  messagePlaceholder: string;
  speedLabel: string;
  speedUnit: string;
  brightnessLabel: string;
  colorLabel: string;
  customColorLabel: string;
  colorPickerLabel: string;
  colorPickerHint?: string;
  readyStatus: string;
  playingStatus: string;
  emptyStatus: string;
  classroomHint: string;
  presets: LightPresetOption[];
  colorOptions: LightColorOption[];
};

export type LightCopy = {
  title: string;
  summary: string;
  modes: LightMode[];
  tips: string[];
  accessibility: string;
  controls: LightControlsCopy;
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
