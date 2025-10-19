import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { GamePageTranslations, GamePageParams } from "@/types/pages/games";

type PageProps = {
	params: GamePageParams;
};

export default async function GamePage({ params }: PageProps) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	const gamesTranslations = await getTranslations("games");
	const entries = gamesTranslations.raw("entries") as GamePageTranslations["entries"];
	const game = entries.find((entry) => entry.slug === slug);

	if (!game) {
		const fallback = gamesTranslations.raw("notFound") as GamePageTranslations["notFound"];
		const backLabel = gamesTranslations("backToApplications");
		return (
			<main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16 text-[var(--foreground)]">
				<Link
					href={`/${locale}/applications-fun`}
					className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:brightness-110"
				>
					← {backLabel}
				</Link>
				<section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
					<h1 className="text-2xl font-semibold text-[var(--foreground)]">{fallback.title}</h1>
					<p className="mt-3 text-sm text-[var(--muted-foreground)]">{fallback.body}</p>
					<Link
						href={`/${locale}/applications-fun`}
						className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition hover:brightness-95"
					>
						{fallback.cta}
					</Link>
				</section>
			</main>
		);
	}

		const backLabel = game.actions.back ?? gamesTranslations("backToApplications");
		const openExternalLabel = game.actions.openExternal;

	return (
		<main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 text-[var(--foreground)]">
			<Link
				href={`/${locale}/applications-fun`}
				className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:brightness-110"
			>
				← {backLabel}
			</Link>

			<header className="space-y-4">
				<div className="space-y-2">
					<h1 className="text-3xl font-semibold md:text-4xl">{game.title}</h1>
					<p className="text-base text-[var(--muted-foreground)] md:text-lg">{game.subtitle}</p>
				</div>
				<p className="max-w-3xl text-sm text-[var(--muted-foreground)] md:text-base">{game.summary}</p>
			</header>

			<section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
				<div className="space-y-4">
					<div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)]/70">
						<iframe
							src={game.iframe.src}
							title={game.iframe.title}
							allowFullScreen
							className="h-[520px] w-full"
						/>
					</div>
					<a
						href={game.iframe.src}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex w-fit items-center justify-center rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition hover:brightness-95"
					>
						{openExternalLabel}
					</a>
				</div>

				<aside className="space-y-4">
					<div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
								<h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
									{game.metaTitle}
								</h2>
						<ul className="mt-3 space-y-3 text-sm text-[var(--muted-foreground)]">
							{game.meta.map((item) => (
								<li key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-3">
									<p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
										{item.label}
									</p>
									<p className="mt-1 text-sm text-[var(--foreground)]">{item.value}</p>
								</li>
							))}
						</ul>
					</div>
				</aside>
			</section>

			<section className="grid gap-8 lg:grid-cols-2">
				<div className="space-y-3">
					<h2 className="text-lg font-semibold text-[var(--foreground)]">{game.overviewTitle}</h2>
					<div className="space-y-3 text-sm text-[var(--muted-foreground)]">
						{game.overview.map((paragraph, index) => (
							<p key={`overview-${index}`}>{paragraph}</p>
						))}
					</div>
				</div>
				<div className="space-y-3">
					<h2 className="text-lg font-semibold text-[var(--foreground)]">{game.tipsTitle}</h2>
					<ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
						{game.tips.map((tip, index) => (
							<li
								key={`tip-${index}`}
								className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-3"
							>
								{tip}
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-[var(--foreground)]">{game.modesTitle}</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{game.modes.map((mode) => (
						<article
							key={mode.name}
							className="h-full rounded-3xl border border-[var(--border)] bg-[var(--background)]/70 p-4"
						>
							<h3 className="text-base font-semibold text-[var(--foreground)]">{mode.name}</h3>
							<p className="mt-2 text-sm text-[var(--muted-foreground)]">{mode.description}</p>
						</article>
					))}
				</div>
			</section>

			<section className="rounded-3xl border border-[var(--border)] bg-[var(--background)]/70 p-5">
				<h2 className="text-lg font-semibold text-[var(--foreground)]">{game.notesTitle}</h2>
				<p className="mt-2 text-sm text-[var(--muted-foreground)]">{game.notes}</p>
			</section>
		</main>
	);
}