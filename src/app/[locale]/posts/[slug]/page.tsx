import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import path from 'node:path';
import { readdir } from 'node:fs/promises';
import type { Locale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { buildAbsoluteUrl, buildCanonicalPath, SITE_ORIGIN } from '@/lib/metadata';

const POSTS_DIRECTORY = path.join(process.cwd(), 'src', 'content');

// 定义文章前言信息的类型，便于复用
interface PostMetadata {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  readingTime?: string;
  keywords?: string[];
  heroImage?: string;
}

type PostModule = {
  default: ComponentType<Record<string, unknown>>;
  metadata?: PostMetadata;
  frontmatter?: PostMetadata;
};

const MDX_EXTENSION_PATTERN = /\.(md|mdx)$/;

// 读取内容目录下的全部文章 slug
async function listPostSlugs(): Promise<string[]> {
  try {
    const entries = await readdir(POSTS_DIRECTORY, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && MDX_EXTENSION_PATTERN.test(entry.name))
      .map((entry) => entry.name.replace(MDX_EXTENSION_PATTERN, ''));
  } catch (error) {
    console.error('无法读取文章目录：', error);
    return [];
  }
}

// 动态加载指定 slug 的文章模块
async function loadPostModule(slug: string): Promise<PostModule | null> {
  try {
    const postModule = (await import(
      /* webpackMode: "lazy-once", webpackChunkName: "content-posts" */ `@/content/${slug}.mdx`
    )) as PostModule;
    return postModule;
  } catch (error) {
    console.error(`无法加载文章 "${slug}"：`, error);
    return null;
  }
}

// 兼容 metadata 与 frontmatter 两种导出
const extractMetadata = (module: PostModule): PostMetadata | undefined => {
  return module.metadata ?? module.frontmatter ?? undefined;
};

const resolveImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) {
    return undefined;
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${SITE_ORIGIN}${normalized}`;
};

type PostPageParams = Promise<{
  slug: string;
  locale: Locale;
}>;

type PostPageProps = {
  params: PostPageParams;
};

export async function generateStaticParams() {
  const slugs = await listPostSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const postModule = await loadPostModule(slug);

  if (!postModule) {
    return {
      title: 'Post Not Found',
    };
  }

  const metadata = extractMetadata(postModule);
  const title = metadata?.title ?? slug;
  const description = metadata?.description ?? undefined;
  const canonicalPath = buildCanonicalPath(locale, `/posts/${slug}`);
  const absoluteUrl = buildAbsoluteUrl(locale, `/posts/${slug}`);

  const languageAlternates = Object.fromEntries(
    locales.map((localeKey) => [localeKey, buildCanonicalPath(localeKey, `/posts/${slug}`)]),
  );

  const ogImageUrl = resolveImageUrl(metadata?.heroImage);
  const ogImages = ogImageUrl ? [{ url: ogImageUrl }] : undefined;

  return {
    title,
    description,
    keywords: metadata?.keywords,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: absoluteUrl,
      publishedTime: metadata?.date,
      authors: metadata?.author ? [metadata.author] : undefined,
      images: ogImages,
    },
    twitter: {
      card: ogImages ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImages?.map((image) => image.url),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const postModule = await loadPostModule(slug);
  if (!postModule) {
    notFound();
  }

  const resolvedModule = postModule;
  const metadata = extractMetadata(resolvedModule) ?? {};
  const PostContent = resolvedModule.default;

  const t = await getTranslations('posts');
  const sectionLabel = t('tagline');

  const ogImageUrl = resolveImageUrl(metadata.heroImage);
  const articleUrl = buildAbsoluteUrl(locale, `/posts/${slug}`);

  const publishedDate = metadata.date ? new Date(metadata.date) : undefined;
  const formattedDate = publishedDate
    ? new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
        dateStyle: 'long',
      }).format(publishedDate)
    : undefined;

  const metaLineItems = [metadata.author, formattedDate, metadata.readingTime].filter(
    Boolean,
  ) as string[];
  const metaLine = metaLineItems.join(' · ');

  const jsonLd = metadata.title
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: metadata.title,
        description: metadata.description,
        datePublished: metadata.date,
        author: metadata.author
          ? {
              '@type': 'Person',
              name: metadata.author,
            }
          : undefined,
        keywords: metadata.keywords?.join(', '),
        image: ogImageUrl,
        url: articleUrl,
        mainEntityOfPage: articleUrl,
      }
    : undefined;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 sm:py-16">
      {jsonLd ? (
        <script
          type="application/ld+json"
          // 使用 JSON-LD 提升搜索引擎理解
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <article className="prose prose-lg dark:prose-invert">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary)]">
            {sectionLabel}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {metadata.title ?? slug}
          </h1>
          {metadata.description ? (
            <p className="mt-4 text-base text-muted-foreground">{metadata.description}</p>
          ) : null}
          {metaLine ? (
            <p className="mt-6 text-sm text-muted-foreground">{metaLine}</p>
          ) : null}
        </header>

        <PostContent />
      </article>
    </div>
  );
}