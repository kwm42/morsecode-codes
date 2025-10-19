import type { ComponentType } from 'react';

type PostImport = () => Promise<{ default: ComponentType<Record<string, unknown>>; [key: string]: unknown }>;

type PostRegistry = Record<string, PostImport>;

export const postsRegistry: PostRegistry = {
  'what-does-sos-mean': () => import('./what-does-sos-mean.mdx'),
  'history-of-morse-code': () => import('./history-of-morse-code.mdx'),
  'learn-morse-faster': () => import('./learn-morse-faster.mdx'),
  'product-update-august-2025': () => import('./product-update-august-2025.mdx'),
};

export type PostMetadata = {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  readingTime?: string;
  keywords?: string[];
  heroImage?: string;
};

type LoadedPostModule = {
  default: ComponentType<Record<string, unknown>>;
  metadata?: PostMetadata;
  frontmatter?: PostMetadata;
};

export type LoadedPost = {
  Content: ComponentType<Record<string, unknown>>;
  metadata: PostMetadata;
};

export async function loadPostBySlug(slug: string): Promise<LoadedPost | null> {
  const importer = postsRegistry[slug];
  if (!importer) {
    return null;
  }

  const postModule = (await importer()) as LoadedPostModule;

  return {
    Content: postModule.default,
    metadata: postModule.metadata ?? postModule.frontmatter ?? {},
  };
}
