import { CHAR_TO_MORSE } from "./morse";

export type MorseChartPattern = "dot" | "dash";

export type MorseChartEntry = {
	symbol: string;
	code: string;
	pattern: MorseChartPattern[];
};

const LETTER_SYMBOLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBER_SYMBOLS = "0123456789".split("");

const SYMBOL_SYMBOLS = [
	".",
	",",
	"?",
	"!",
	"/",
	"@",
	":",
	"'",
	"-",
	"(",
	")",
];

const toPattern = (code: string): MorseChartPattern[] =>
	code.split("").map((char) => (char === "." ? "dot" : "dash"));

const buildEntries = (symbols: string[]): MorseChartEntry[] =>
	symbols
		.map((symbol) => {
			const code = CHAR_TO_MORSE[symbol] ?? "";
			if (!code) {
				return null;
			}

			return {
				symbol,
				code,
				pattern: toPattern(code),
			};
		})
		.filter((entry): entry is MorseChartEntry => entry !== null);

export const LETTER_ENTRIES = buildEntries(LETTER_SYMBOLS);
export const NUMBER_ENTRIES = buildEntries(NUMBER_SYMBOLS);
export const SYMBOL_ENTRIES = buildEntries(SYMBOL_SYMBOLS);
