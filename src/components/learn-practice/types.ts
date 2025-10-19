export type LearnIntroCopy = {
  badge: string;
  headline: string;
  summary: string;
};

export type LearnCard = {
  title: string;
  description: string;
};

export type LearnActionsCopy = {
  step: string;
  auto: string;
  bookmark: string;
};

export type LearnCopy = {
  title: string;
  subtitle: string;
  sections: LearnCard[];
  actions: LearnActionsCopy;
  comingSoonLabel: string;
};

export type PracticeDrill = {
  title: string;
  difficulty: string;
  description: string;
};

export type PracticeActionsCopy = {
  start: string;
  customize: string;
  stats: string;
};

export type PracticeCopy = {
  title: string;
  subtitle: string;
  drills: PracticeDrill[];
  actions: PracticeActionsCopy;
  comingSoonLabel: string;
};

export type GameItem = {
  title: string;
  description: string;
};

export type GameActionsCopy = {
  queue: string;
  solo: string;
  invite: string;
};

export type GameCopy = {
  title: string;
  subtitle: string;
  items: GameItem[];
  actions: GameActionsCopy;
  comingSoonLabel: string;
};

export type ProgressAchievement = {
  title: string;
  description: string;
};

export type ProgressActionsCopy = {
  viewAll: string;
  reset: string;
  share: string;
};

export type ProgressCopy = {
  title: string;
  subtitle: string;
  achievements: ProgressAchievement[];
  actions: ProgressActionsCopy;
};

export type ProgressMetric = {
  label: string;
  value: string;
  helper?: string;
};

export type CtaCopy = {
  headline: string;
  body: string;
  primary: string;
  secondary: string;
};
