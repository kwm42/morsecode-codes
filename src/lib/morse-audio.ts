import { normalizeMorse } from "./morse";

export type MorseTimingEvent = {
	type: "tone" | "silence";
	duration: number;
};

const DEFAULT_AMPLITUDE = 0.4;
const DEFAULT_SAMPLE_RATE = 44100;
const MIN_WPM = 5;

export function getUnitDurationSeconds(wpm: number): number {
	const safeWpm = Math.max(MIN_WPM, wpm || MIN_WPM);
	return 1.2 / safeWpm;
}

export function buildMorseTimings(morse: string, wpm: number): MorseTimingEvent[] {
	const normalized = normalizeMorse(morse);

	if (!normalized) {
		return [];
	}

	const unit = getUnitDurationSeconds(wpm);
	const words = normalized.split(" / ");
	const events: MorseTimingEvent[] = [];

	words.forEach((word, wordIndex) => {
		const letters = word.split(" ");

		letters.forEach((letter, letterIndex) => {
			const symbols = letter.split("");

			symbols.forEach((symbol, symbolIndex) => {
				const toneUnits = symbol === "-" ? 3 : 1;
				events.push({ type: "tone", duration: toneUnits * unit });

				const isLastSymbol = symbolIndex === symbols.length - 1;
				if (!isLastSymbol) {
					events.push({ type: "silence", duration: unit });
				}
			});

			const isLastLetter = letterIndex === letters.length - 1;
			const isLastWord = wordIndex === words.length - 1;

			if (!isLastLetter) {
				events.push({ type: "silence", duration: 3 * unit });
			} else if (!isLastWord) {
				events.push({ type: "silence", duration: 7 * unit });
			}
		});
	});

	return events;
}

export function getTotalDuration(events: MorseTimingEvent[]): number {
	return events.reduce((total, event) => total + event.duration, 0);
}

export function createMorseWaveBlob(
	morse: string,
	options: { wpm: number; frequency: number; sampleRate?: number }
): Blob | null {
	const events = buildMorseTimings(morse, options.wpm);

	if (!events.length) {
		return null;
	}

	const frequency = Math.max(100, options.frequency || 600);
	const sampleRate = options.sampleRate ?? DEFAULT_SAMPLE_RATE;
	const totalDuration = getTotalDuration(events);
	const totalSamples = Math.ceil(totalDuration * sampleRate);
	const samples = new Float32Array(totalSamples);

	let sampleCursor = 0;

	events.forEach((event) => {
		const eventSamples = Math.max(1, Math.floor(event.duration * sampleRate));

		if (event.type === "tone") {
			for (let i = 0; i < eventSamples && sampleCursor + i < samples.length; i += 1) {
				const time = (sampleCursor + i) / sampleRate;
				samples[sampleCursor + i] = Math.sin(2 * Math.PI * frequency * time) * DEFAULT_AMPLITUDE;
			}
		}

		sampleCursor += eventSamples;
	});

	return encodeWav(samples, sampleRate);
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
	const buffer = new ArrayBuffer(44 + samples.length * 2);
	const view = new DataView(buffer);

	writeString(view, 0, "RIFF");
	view.setUint32(4, 36 + samples.length * 2, true);
	writeString(view, 8, "WAVE");
	writeString(view, 12, "fmt ");
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true);
	view.setUint16(22, 1, true);
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, sampleRate * 2, true);
	view.setUint16(32, 2, true);
	view.setUint16(34, 16, true);
	writeString(view, 36, "data");
	view.setUint32(40, samples.length * 2, true);
	floatTo16BitPCM(view, 44, samples);

	return new Blob([view], { type: "audio/wav" });
}

function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
	for (let i = 0; i < input.length; i += 1, offset += 2) {
		const clamped = Math.max(-1, Math.min(1, input[i]));
		view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
	}
}

function writeString(view: DataView, offset: number, value: string) {
	for (let i = 0; i < value.length; i += 1) {
		view.setUint8(offset + i, value.charCodeAt(i));
	}
}

