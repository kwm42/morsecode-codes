import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import { buildCanonicalPath } from "@/lib/metadata";
import {
	buildWordSlug,
	findWordBySlug,
	parseWordSlug,
	toWordEntries,
	type WordEntry,
} from "@/lib/words";
import { WordAudioPlayer, type WordAudioLabels } from "@/components/words/word-audio-player";
import { WordTranslatorPreview } from "@/components/words/word-translator-preview";
import enMessages from "@/i18n/messages/en.json";

const baseWords = toWordEntries((enMessages as { wordsPage?: { words?: unknown } }).wordsPage?.words);

type WordDetailParams = Promise<{
	locale: Locale;
	slug: string;
}>;

type WordDetailProps = {
	params: WordDetailParams;
};

export function generateStaticParams() {
	const slugs = baseWords.map((word) => buildWordSlug(word.term));

	return locales.flatMap((locale) =>
		slugs.map((slug) => ({
			locale,
			slug,
		}))
	);
}

export const dynamicParams = false;

export async function generateMetadata({ params }: WordDetailProps): Promise<Metadata> {
	const { locale, slug } = await params;
	const matchedWord = findWordBySlug(baseWords, slug);
	const fallbackTerm = parseWordSlug(slug) ?? slug;
	const wordLabel = matchedWord?.term ?? fallbackTerm;

	return {
		title: `MorseCode | ${wordLabel} in morsecode`,
		alternates: {
			canonical: buildCanonicalPath(locale, `/words/${slug}`),
		},
	};
}

export default async function WordDetailPage({ params }: WordDetailProps) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	const wordsPageTranslations = await getTranslations("wordsPage");
	const wordsDetailTranslations = await getTranslations("wordsDetail");

	const wordsRaw = wordsPageTranslations.raw("words") as WordEntry[] | undefined;
	const words = toWordEntries(wordsRaw);
	const targetWord = findWordBySlug(words, slug);

	if (!targetWord) {
		notFound();
	}

	const tipsRaw = wordsPageTranslations.raw("tips") as string[] | undefined;
	const tips = Array.isArray(tipsRaw) ? tipsRaw : [];
	const note = wordsPageTranslations("note");

	const heroBadge = wordsDetailTranslations("heroBadge");
	const heroTitle = wordsDetailTranslations("heroTitle", { term: targetWord.term });
	const heroDescription = wordsDetailTranslations("heroDescription", { term: targetWord.term });

	const morseTokens = targetWord.morse.split(" ");
	const letterTokens = targetWord.term.split("");
	const breakdown = letterTokens.map((letter, index) => ({
		letter,
		morse: morseTokens[index] ?? "",
	}));

	const audioLabels: WordAudioLabels = {
		play: wordsDetailTranslations("audio.play"),
		stop: wordsDetailTranslations("audio.stop"),
		download: wordsDetailTranslations("audio.download"),
		speed: wordsDetailTranslations("audio.speed"),
		speedUnit: wordsDetailTranslations("audio.speedUnit"),
		tone: wordsDetailTranslations("audio.tone"),
		toneUnit: wordsDetailTranslations("audio.toneUnit"),
		statusIdle: wordsDetailTranslations("audio.statusIdle"),
		statusPlaying: wordsDetailTranslations("audio.statusPlaying"),
		statusStopped: wordsDetailTranslations("audio.statusStopped"),
		statusDownloadReady: wordsDetailTranslations("audio.statusDownloadReady"),
		statusDownloadError: wordsDetailTranslations("audio.statusDownloadError"),
		statusUnavailable: wordsDetailTranslations("audio.statusUnavailable"),
	};

	const otherWords = words
		.filter((word) => word.term !== targetWord.term)
		.slice(0, 6);

	const translatorStrings = {
		heading: wordsDetailTranslations("translatorHeading"),
		description: wordsDetailTranslations("translatorDescription"),
		textLabel: wordsDetailTranslations("translator.textLabel"),
		morseLabel: wordsDetailTranslations("translator.morseLabel"),
	};

	return (
		<main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 text-[var(--foreground)]">
			<nav>
				<Link
					href={`/${locale}/words`}
					className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary)] transition hover:opacity-80"
				>
					<span aria-hidden>{"<"}</span>
					{wordsDetailTranslations("back")}
				</Link>
			</nav>

			<header className="space-y-3">
				<span className="inline-flex items-center rounded-full border border-[var(--primary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">
					{heroBadge}
				</span>
				<h1 className="text-3xl font-semibold sm:text-4xl">{heroTitle}</h1>
				<p className="text-sm text-[var(--muted-foreground)] sm:text-base">{heroDescription}</p>
			</header>

			<WordTranslatorPreview term={targetWord.term} morse={targetWord.morse} strings={translatorStrings} />

			<section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
				<div className="flex flex-col gap-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
					<div className="space-y-2">
						<h2 className="text-lg font-semibold text-[var(--foreground)]">
							{wordsDetailTranslations("patternHeading")}
						</h2>
						<p className="font-mono text-lg tracking-[0.6em] text-[var(--primary)]">
							{targetWord.morse}
						</p>
					</div>
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
							{wordsDetailTranslations("lettersHeading")}
						</h3>
						<ul className="mt-3 grid gap-2 sm:grid-cols-2">
							{breakdown.map((entry) => (
								<li
									key={`${entry.letter}-${entry.morse}`}
									className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-3"
								>
									<span className="text-base font-semibold text-[var(--foreground)]">
										{entry.letter}
									</span>
									<span className="font-mono text-sm tracking-[0.4em] text-[var(--primary)]">
										{entry.morse}
									</span>
								</li>
								))}
						</ul>
					</div>
					<p className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--background)]/60 p-4 text-xs text-[var(--muted-foreground)]">
						{note}
					</p>
				</div>
				<div className="flex flex-col gap-4">
					<div>
						<h2 className="text-lg font-semibold text-[var(--foreground)]">
							{wordsDetailTranslations("audioTitle")}
						</h2>
						<p className="text-sm text-[var(--muted-foreground)]">
							{wordsDetailTranslations("audioDescription")}
						</p>
					</div>
					<WordAudioPlayer morse={targetWord.morse} labels={audioLabels} />
				</div>
			</section>

			<section className="space-y-3">
				<h2 className="text-lg font-semibold text-[var(--foreground)]">
					{wordsDetailTranslations("tipsHeading")}
				</h2>
				<ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
					{tips.map((tip, index) => (
						<li
							key={`tip-${index}`}
							className="rounded-3xl border border-[var(--border)] bg-[var(--background)]/70 p-4"
						>
							{tip}
						</li>
					))}
				</ul>
			</section>

			{otherWords.length ? (
				<section className="space-y-3">
					<h2 className="text-lg font-semibold text-[var(--foreground)]">
						{wordsDetailTranslations("moreHeading")}
					</h2>
					<ul className="grid gap-3 sm:grid-cols-2">
						{otherWords.map((word) => {
							const nextSlug = buildWordSlug(word.term);
							return (
								<li key={word.term}>
									<Link
										href={`/${locale}/words/${nextSlug}`}
										className="flex h-full flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-md"
									>
										<span className="text-lg font-semibold text-[var(--foreground)]">{word.term}</span>
										<span className="font-mono text-sm tracking-[0.4em] text-[var(--primary)]">
											{word.morse}
										</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</section>
			) : null}
		</main>
	);
}
