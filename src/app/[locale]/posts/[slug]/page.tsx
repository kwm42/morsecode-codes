import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { buildAbsoluteUrl, buildCanonicalPath, SITE_ORIGIN } from '@/lib/metadata';
import { loadPostBySlug, postsRegistry } from '@/content';

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
  const slugs = Object.keys(postsRegistry);
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
  const loadedPost = await loadPostBySlug(slug);

  if (!loadedPost) {
    return {
      title: 'Post Not Found',
    };
  }

  const metadata = loadedPost.metadata;
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

  const loadedPost = await loadPostBySlug(slug);
  if (!loadedPost) {
    notFound();
  }

  const { Content: PostContent, metadata } = loadedPost;

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