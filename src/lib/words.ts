export type WordEntry = {
	term: string;
	morse: string;
};

export const WORD_DETAIL_SUFFIX = "-in-morsecode";

export function buildWordSlug(term: string): string {
	return `${term.toLowerCase().replace(/\s+/g, "-")}${WORD_DETAIL_SUFFIX}`;
}

export function parseWordSlug(slug: string): string | null {
	if (!slug.endsWith(WORD_DETAIL_SUFFIX)) {
		return null;
	}

	const base = slug.slice(0, -WORD_DETAIL_SUFFIX.length);
	if (!base) {
		return null;
	}

	return base.replace(/-/g, " ").toUpperCase();
}

export function toWordEntries(payload: unknown): WordEntry[] {
	if (!Array.isArray(payload)) {
		return [];
	}

	return payload.filter(isWordEntry);
}

export function isWordEntry(value: unknown): value is WordEntry {
	if (!value || typeof value !== "object") {
		return false;
	}

	const candidate = value as Partial<WordEntry>;
	return typeof candidate.term === "string" && typeof candidate.morse === "string";
}

export function findWordBySlug(words: WordEntry[], slug: string): WordEntry | undefined {
	return words.find((word) => buildWordSlug(word.term) === slug);
}
