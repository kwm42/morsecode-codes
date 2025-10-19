import type { Locale } from "@/i18n/routing";

export type GameModeDetail = {
  name: string;
  description: string;
};

export type GameMetaItem = {
  label: string;
  value: string;
};

export type GameIframeInfo = {
  src: string;
  title: string;
};

export type GameActionCopy = {
  openExternal: string;
  back: string;
};

export type GameDetailsCopy = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  iframe: GameIframeInfo;
  meta: GameMetaItem[];
  metaTitle: string;
  overviewTitle: string;
  overview: string[];
  modesTitle: string;
  modes: GameModeDetail[];
  tipsTitle: string;
  tips: string[];
  notesTitle: string;
  notes: string;
  actions: GameActionCopy;
};

export type GamePageTranslations = {
  backToApplications: string;
  entries: GameDetailsCopy[];
  notFound: {
    title: string;
    body: string;
    cta: string;
  };
};

export type GamePageParams = Promise<{
  locale: Locale;
  slug: string;
}>;
