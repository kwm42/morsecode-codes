import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildCanonicalPath } from "@/lib/metadata";

interface PostItem {
  slug: string;
  title: string;
  summary: string;
  category: string;
  published: string;
  publishedISO?: string;
  readingTime?: string;
  url?: string;
}

type PostsPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: PostsPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: {
      canonical: buildCanonicalPath(locale, "/posts"),
    },
  };
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("posts");
  const pageTitle = t("title");
  const pageDescription = t("description");
  const readMoreLabel = t("readMore");
  const comingSoonLabel = t("comingSoon");

  const rawItems = t.raw("items") as PostItem[] | undefined;
  const posts = Array.isArray(rawItems) ? rawItems : [];

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 text-[var(--foreground)]">
      <header className="space-y-3 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary)]">
          {t("tagline")}
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">{pageTitle}</h1>
        <p className="text-sm text-[var(--muted-foreground)] sm:text-base">{pageDescription}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {posts.map((post) => {
          const hasLink = typeof post.url === "string" && post.url.trim().length > 0;
          const isExternal = hasLink && /^https?:\/\//.test(post.url!);

          return (
            <article
              key={post.slug}
              id={post.slug}
              className="flex h-full flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-[var(--primary)]">
                  {post.category}
                </span>
                {post.published ? (
                  <time dateTime={post.publishedISO ?? undefined}>{post.published}</time>
                ) : null}
                {post.readingTime ? <span>· {post.readingTime}</span> : null}
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">{post.title}</h2>
                <p className="text-sm text-[var(--muted-foreground)]">{post.summary}</p>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-[var(--muted-foreground)]">#{post.slug}</span>
                {hasLink ? (
                  isExternal ? (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary-foreground)] shadow-sm transition hover:brightness-95"
                    >
                      {readMoreLabel}
                    </a>
                  ) : (
                    <Link
                      href={post.url!}
                      className="inline-flex items-center rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary-foreground)] shadow-sm transition hover:brightness-95"
                    >
                      {readMoreLabel}
                    </Link>
                  )
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                    {comingSoonLabel}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
