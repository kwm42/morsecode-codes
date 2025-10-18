const DIACRITIC_REGEX = /\p{Diacritic}/gu;
const MORSE_CHAR_REGEX = /^[.\-\s/]+$/;

export type MorseDirection = "text" | "morse";
export type TranslatorMode = "auto" | MorseDirection;

const UNKNOWN_SYMBOL = "?";

export const CHAR_TO_MORSE: Record<string, string> = {
	A: ".-",
	B: "-...",
	C: "-.-.",
	D: "-..",
	E: ".",
	F: "..-.",
	G: "--.",
	H: "....",
	I: "..",
	J: ".---",
	K: "-.-",
	L: ".-..",
	M: "--",
	N: "-.",
	O: "---",
	P: ".--.",
	Q: "--.-",
	R: ".-.",
	S: "...",
	T: "-",
	U: "..-",
	V: "...-",
	W: ".--",
	X: "-..-",
	Y: "-.--",
	Z: "--..",
	"0": "-----",
	"1": ".----",
	"2": "..---",
	"3": "...--",
	"4": "....-",
	"5": ".....",
	"6": "-....",
	"7": "--...",
	"8": "---..",
	"9": "----.",
	".": ".-.-.-",
	",": "--..--",
	"?": "..--..",
	"!": "-.-.--",
	":": "---...",
	";": "-.-.-.",
	"'": ".----.",
	"\"": ".-..-.",
	"/": "-..-.",
	"-": "-....-",
	"+": ".-.-.",
	"=": "-...-",
	"@": ".--.-.",
		"(": "-.--.",
		")": "-.--.-",
		"&": ".-...",
		"$": "...-..-",
	"_": "..--.-"
};

const MORSE_TO_CHAR = new Map<string, string>(
	Object.entries(CHAR_TO_MORSE).map(([char, code]) => [code, char])
);

export const SUPPORTED_CHARACTERS = new Set(Object.keys(CHAR_TO_MORSE));

export function normalizeText(input: string): string {
	return input
		.normalize("NFD")
		.replace(DIACRITIC_REGEX, "")
		.toUpperCase();
}

export function normalizeMorse(input: string): string {
	if (!input.trim()) {
		return "";
	}

	const sanitized = input
		.replace(/[^.\-\s/]/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	return sanitized
		.replace(/ ?\/ ?/g, " / ")
		.replace(/\s+/g, " ")
		.trim();
}

export function textToMorse(input: string): string {
	const normalized = normalizeText(input);

	const words = normalized
		.split(/\s+/)
		.filter(Boolean)
		.map((word) =>
			word
				.split("")
				.map((char) => CHAR_TO_MORSE[char] ?? UNKNOWN_SYMBOL)
				.join(" ")
		);

	return words.join(" / ");
}

export function morseToText(input: string): string {
	const normalized = normalizeMorse(input);

	if (!normalized) {
		return "";
	}

	const words = normalized.split(" / ");

	const decodedWords = words.map((word) =>
		word
			.split(" ")
			.filter(Boolean)
			.map((token) => MORSE_TO_CHAR.get(token) ?? UNKNOWN_SYMBOL)
			.join("")
	);

	return decodedWords.join(" ");
}

export function detectTranslatorDirection(input: string): MorseDirection {
	const trimmed = input.trim();

	if (!trimmed) {
		return "text";
	}

	const nonMorseCharacters = trimmed.replace(/[.\-\s/]/g, "");
	const dotDashCount = (trimmed.match(/[.\-]/g) ?? []).length;
	const alphaCount = (trimmed.match(/[A-Za-z0-9]/g) ?? []).length;

	if (!nonMorseCharacters.length && dotDashCount > 0 && dotDashCount >= alphaCount) {
		return "morse";
	}

	if (MORSE_CHAR_REGEX.test(trimmed) && dotDashCount > alphaCount) {
		return "morse";
	}

	return "text";
}

export function sanitizeInput(input: string, mode: MorseDirection): string {
	if (mode === "morse") {
		return normalizeMorse(input);
	}

	return normalizeText(input);
}

export function translate(input: string, mode: MorseDirection): string {
	if (mode === "morse") {
		return morseToText(input);
	}

	return textToMorse(input);
}

export function hasMorseContent(input: string): boolean {
	return !!normalizeMorse(input);
}

