type WordTranslatorStrings = {
	heading: string;
	description: string;
	textLabel: string;
	morseLabel: string;
};

type WordTranslatorPreviewProps = {
	term: string;
	morse: string;
	strings: WordTranslatorStrings;
};

export function WordTranslatorPreview({ term, morse, strings }: WordTranslatorPreviewProps) {
	return (
		<section className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
			<header className="space-y-2">
				<h2 className="text-lg font-semibold text-[var(--foreground)]">{strings.heading}</h2>
				<p className="text-sm text-[var(--muted-foreground)]">{strings.description}</p>
			</header>
			<div className="grid gap-4 lg:grid-cols-2">
				<div className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
					<span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
						{strings.textLabel}
					</span>
					<p className="min-h-[72px] whitespace-pre-line text-sm text-[var(--foreground)]">{term}</p>
				</div>
				<div className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
					<span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
						{strings.morseLabel}
					</span>
					<p className="min-h-[72px] font-mono text-sm tracking-[0.5em] text-[var(--primary)]">{morse}</p>
				</div>
			</div>
		</section>
	);
}
