'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";
import {
	detectTranslatorDirection,
	morseToText,
	normalizeMorse,
	textToMorse,
	type MorseDirection,
	type TranslatorMode,
} from "@/lib/morse";
import {
	buildMorseTimings,
	createMorseWaveBlob,
	getTotalDuration,
	type MorseTimingEvent,
} from "@/lib/morse-audio";

type TranslatorCopy = {
	mode: {
		label: string;
		auto: string;
		text: string;
		morse: string;
		autoDetectedText: string;
		autoDetectedMorse: string;
	};
	inputs: {
		sourceLabel: string;
		targetLabel: string;
		textPlaceholder: string;
		morsePlaceholder: string;
		targetPlaceholder: string;
	};
	actions: {
		clear: string;
		copy: string;
		share: string;
		download: string;
		play: string;
		stop: string;
		flashLabel: string;
		flashStart: string;
		flashStop: string;
		historyHint: string;
	};
	controls: {
		heading: string;
		speed: string;
		speedUnit: string;
		speedHelp: string;
		tone: string;
		toneUnit: string;
		toneHelp: string;
	};
	history: {
		title: string;
		empty: string;
		clear: string;
		restore: string;
	};
	notifications: {
		copied: string;
		copyError: string;
		shareSuccess: string;
		shareError: string;
		noMorse: string;
		downloadReady: string;
		historyCleared: string;
	};
};

type TranslatorWorkspaceProps = {
	locale: Locale;
	strings: TranslatorCopy;
};

type HistoryEntry = {
	id: string;
	direction: MorseDirection;
	source: string;
	result: string;
	timestamp: number;
};

type ToastState = {
	message: string;
	variant: "success" | "error" | "info";
};

const HISTORY_STORAGE_KEY = "morsecode-translator-history";
const DEFAULT_WPM = 20;
const DEFAULT_FREQUENCY = 600;
const HISTORY_LIMIT = 10;

export function TranslatorWorkspace({ locale, strings }: TranslatorWorkspaceProps) {
	const [mode, setMode] = useState<TranslatorMode>("auto");
	const [resolvedMode, setResolvedMode] = useState<MorseDirection>("text");
	const [sourceValue, setSourceValue] = useState("");
	const [targetValue, setTargetValue] = useState("");
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [wpm, setWpm] = useState(DEFAULT_WPM);
	const [frequency, setFrequency] = useState(DEFAULT_FREQUENCY);
	const [isPlaying, setIsPlaying] = useState(false);
	const [flashActive, setFlashActive] = useState(false);
	const [lightOn, setLightOn] = useState(false);
	const [toast, setToast] = useState<ToastState | null>(null);

	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);
	const gainRef = useRef<GainNode | null>(null);
	const playbackTimeoutRef = useRef<number | null>(null);
	const lightTimeoutsRef = useRef<number[]>([]);
	const historyDebounceRef = useRef<number | null>(null);

	const persistHistory = useCallback((entries: HistoryEntry[]) => {
		if (typeof window === "undefined") {
			return;
		}

		try {
			window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
		} catch {
			// Ignored: storage may be unavailable.
		}
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		try {
			const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
			if (stored) {
				const parsed: HistoryEntry[] = JSON.parse(stored);
				setHistory(parsed);
			}
		} catch {
			// Ignore malformed history payloads.
		}
	}, []);

	const showToast = useCallback((message: string, variant: ToastState["variant"] = "info") => {
		setToast({ message, variant });
	}, []);

	useEffect(() => {
		if (!toast) {
			return;
		}

		const timeout = window.setTimeout(() => setToast(null), 2200);
		return () => window.clearTimeout(timeout);
	}, [toast]);

	useEffect(() => {
		const trimmed = sourceValue.trim();

		if (!trimmed) {
			setTargetValue("");
			setResolvedMode(mode === "auto" ? "text" : mode);
			return;
		}

		const nextDirection: MorseDirection = mode === "auto" ? detectTranslatorDirection(trimmed) : mode;
		const translation = nextDirection === "morse" ? morseToText(trimmed) : textToMorse(trimmed);

		setResolvedMode(nextDirection);
		setTargetValue(translation);
	}, [mode, sourceValue]);

	useEffect(() => {
		if (historyDebounceRef.current) {
			window.clearTimeout(historyDebounceRef.current);
			historyDebounceRef.current = null;
		}

		if (!sourceValue.trim() || !targetValue.trim()) {
			return;
		}

		historyDebounceRef.current = window.setTimeout(() => {
			const direction: MorseDirection = mode === "auto" ? resolvedMode : mode;
			const entry: HistoryEntry = {
				id: `${Date.now()}`,
				direction,
				source: sourceValue.trim(),
				result: targetValue.trim(),
				timestamp: Date.now(),
			};

			setHistory((prev) => {
				if (prev.length && prev[0].source === entry.source && prev[0].result === entry.result) {
					return prev;
				}

				const filtered = prev.filter((item) => item.source !== entry.source || item.result !== entry.result);
				const next = [entry, ...filtered].slice(0, HISTORY_LIMIT);
				persistHistory(next);
				return next;
			});
		}, 700);

		return () => {
			if (historyDebounceRef.current) {
				window.clearTimeout(historyDebounceRef.current);
				historyDebounceRef.current = null;
			}
		};
	}, [mode, persistHistory, resolvedMode, sourceValue, targetValue]);

	const normalizedMorse = useMemo(() => {
		const activeDirection: MorseDirection = mode === "auto" ? resolvedMode : mode;
		if (activeDirection === "morse") {
			return normalizeMorse(sourceValue);
		}

		return normalizeMorse(targetValue);
	}, [mode, resolvedMode, sourceValue, targetValue]);

	const handleCopy = useCallback(async () => {
		const text = targetValue.trim();
		if (!text) {
			return;
		}

		try {
			await navigator.clipboard.writeText(text);
			showToast(strings.notifications.copied, "success");
		} catch {
			showToast(strings.notifications.copyError, "error");
		}
	}, [showToast, strings.notifications.copied, strings.notifications.copyError, targetValue]);

	const handleShare = useCallback(async () => {
		const trimmedSource = sourceValue.trim();
		const trimmedTarget = targetValue.trim();

		if (!trimmedTarget) {
			return;
		}

		if (typeof navigator === "undefined" || typeof window === "undefined") {
			showToast(strings.notifications.shareError, "error");
			return;
		}

		const sharePayload = {
			title: document.title,
			text: `${trimmedSource}\n→\n${trimmedTarget}`,
			url: window.location.origin ? `${window.location.origin}/${locale}/translator` : undefined,
		};

		if (!navigator.share) {
			showToast(strings.notifications.shareError, "error");
			return;
		}

		try {
			await navigator.share(sharePayload);
			showToast(strings.notifications.shareSuccess, "success");
		} catch {
			showToast(strings.notifications.shareError, "error");
		}
	}, [locale, showToast, sourceValue, strings.notifications.shareError, strings.notifications.shareSuccess, targetValue]);

	const stopAudio = useCallback(() => {
		if (oscillatorRef.current) {
			try {
				oscillatorRef.current.stop();
			} catch {
				// Oscillator may already be stopped.
			}
			oscillatorRef.current.disconnect();
			oscillatorRef.current = null;
		}

		if (gainRef.current) {
			gainRef.current.disconnect();
			gainRef.current = null;
		}

		if (playbackTimeoutRef.current) {
			window.clearTimeout(playbackTimeoutRef.current);
			playbackTimeoutRef.current = null;
		}

		setIsPlaying(false);
	}, []);

	const startAudio = useCallback(() => {
		if (!normalizedMorse) {
			showToast(strings.notifications.noMorse, "error");
			return;
		}

		const events = buildMorseTimings(normalizedMorse, wpm);
		if (!events.length) {
			showToast(strings.notifications.noMorse, "error");
			return;
		}

		stopAudio();

		const audioContext = audioContextRef.current ?? new AudioContext();
		audioContextRef.current = audioContext;

		if (audioContext.state === "suspended") {
			void audioContext.resume();
		}

		const oscillator = audioContext.createOscillator();
		const gain = audioContext.createGain();

		oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
		gain.gain.setValueAtTime(0, audioContext.currentTime);

		oscillator.connect(gain);
		gain.connect(audioContext.destination);

		const startTime = audioContext.currentTime;
		let cursor = startTime;

		events.forEach((event) => {
			if (event.type === "tone") {
				gain.gain.setValueAtTime(0.6, cursor);
				cursor += event.duration;
				gain.gain.setValueAtTime(0, cursor);
			} else {
				cursor += event.duration;
			}
		});

		oscillator.start(startTime);
		oscillator.stop(cursor + 0.02);

		oscillator.onended = () => {
			setIsPlaying(false);
		};

		oscillatorRef.current = oscillator;
		gainRef.current = gain;

		const totalDuration = getTotalDuration(events);
		playbackTimeoutRef.current = window.setTimeout(() => {
			setIsPlaying(false);
		}, totalDuration * 1000 + 50);

		setIsPlaying(true);
	}, [frequency, normalizedMorse, showToast, stopAudio, strings.notifications.noMorse, wpm]);

	const handleDownloadAudio = useCallback(() => {
		if (!normalizedMorse) {
			showToast(strings.notifications.noMorse, "error");
			return;
		}

		const blob = createMorseWaveBlob(normalizedMorse, { frequency, wpm });

		if (!blob) {
			showToast(strings.notifications.noMorse, "error");
			return;
		}

		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `morse-${Date.now()}.wav`;
		anchor.click();
		URL.revokeObjectURL(url);
		showToast(strings.notifications.downloadReady, "success");
	}, [frequency, normalizedMorse, showToast, strings.notifications.downloadReady, strings.notifications.noMorse, wpm]);

	const clearLightTimeouts = useCallback(() => {
		lightTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
		lightTimeoutsRef.current = [];
	}, []);

	const stopLightDemo = useCallback(() => {
		clearLightTimeouts();
		setFlashActive(false);
		setLightOn(false);
	}, [clearLightTimeouts]);

	useEffect(() => {
		return () => {
			stopAudio();
			stopLightDemo();
		};
	}, [stopAudio, stopLightDemo]);

	const scheduleLightEvents = useCallback(
		(events: MorseTimingEvent[]) => {
			clearLightTimeouts();
			setFlashActive(true);
			setLightOn(false);

			let elapsed = 0;

			events.forEach((event) => {
				if (event.type === "tone") {
					const startId = window.setTimeout(() => setLightOn(true), elapsed * 1000);
					const endId = window.setTimeout(() => setLightOn(false), (elapsed + event.duration) * 1000);
					lightTimeoutsRef.current.push(startId, endId);
				}

				elapsed += event.duration;
			});

			const stopId = window.setTimeout(() => {
				setFlashActive(false);
				setLightOn(false);
			}, elapsed * 1000);

			lightTimeoutsRef.current.push(stopId);
		},
		[clearLightTimeouts]
	);

	const startLightDemo = useCallback(() => {
		if (!normalizedMorse) {
			showToast(strings.notifications.noMorse, "error");
			return;
		}

		const events = buildMorseTimings(normalizedMorse, wpm);
		if (!events.length) {
			showToast(strings.notifications.noMorse, "error");
			return;
		}

		scheduleLightEvents(events);
	}, [normalizedMorse, scheduleLightEvents, showToast, strings.notifications.noMorse, wpm]);

	const handleClear = () => {
		setSourceValue("");
		setTargetValue("");
		setResolvedMode(mode === "auto" ? "text" : mode);
		stopAudio();
		stopLightDemo();
	};

	const handleHistoryRestore = (entry: HistoryEntry) => {
		setMode(entry.direction);
		setSourceValue(entry.source);
		setTargetValue(entry.result);
	};

	const handleClearHistory = () => {
		setHistory([]);
		persistHistory([]);
		showToast(strings.notifications.historyCleared, "info");
	};

	const modeOptions: TranslatorMode[] = ["auto", "text", "morse"];

	const activeModeLabel =
		mode === "auto"
			? resolvedMode === "morse"
				? strings.mode.autoDetectedMorse
				: strings.mode.autoDetectedText
			: mode === "morse"
				? strings.mode.morse
				: strings.mode.text;

	const sourcePlaceholder =
		(mode === "auto" ? resolvedMode : mode) === "morse"
			? strings.inputs.morsePlaceholder
			: strings.inputs.textPlaceholder;

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">
							{strings.mode.label}
						</span>
						{mode === "auto" && sourceValue.trim().length > 0 ? (
							<span className="text-xs text-[var(--muted-foreground)]">{activeModeLabel}</span>
						) : null}
					</div>
					<div className="flex w-full flex-wrap gap-2 sm:w-auto">
						{modeOptions.map((option) => (
							<button
								key={option}
								type="button"
								onClick={() => setMode(option)}
								className={`flex-1 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition sm:flex-none ${
									mode === option
										? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
										: "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
								}`}
							>
								{option === "auto"
									? strings.mode.auto
									: option === "morse"
										? strings.mode.morse
										: strings.mode.text}
							</button>
						))}
					</div>
				</div>

				<p className="text-xs text-[var(--muted-foreground)]">{strings.actions.historyHint}</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<div className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
					<label className="flex flex-col gap-2">
						<span className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
							{strings.inputs.sourceLabel}
						</span>
						<textarea
							value={sourceValue}
							onChange={(event) => setSourceValue(event.target.value)}
							placeholder={sourcePlaceholder}
							className="min-h-[220px] resize-y rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"
						/>
					</label>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={handleClear}
							className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
						>
							{strings.actions.clear}
						</button>
						<button
							type="button"
							onClick={handleCopy}
							className="rounded-full border border-[var(--primary)] bg-[var(--primary)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary)] transition hover:bg-[var(--primary)]/15"
						>
							{strings.actions.copy}
						</button>
						<button
							type="button"
							onClick={handleShare}
							className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
						>
							{strings.actions.share}
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
					<label className="flex flex-col gap-2">
						<span className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
							{strings.inputs.targetLabel}
						</span>
						<textarea
							value={targetValue}
							placeholder={strings.inputs.targetPlaceholder}
							readOnly
							className="min-h-[220px] resize-none rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)]/90 shadow-inner"
						/>
					</label>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={isPlaying ? stopAudio : startAudio}
							className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
								isPlaying
									? "border border-[var(--destructive)] text-[var(--destructive)]"
									: "border border-[var(--primary)] text-[var(--primary)]"
							}`}
						>
							{isPlaying ? strings.actions.stop : strings.actions.play}
						</button>
						<button
							type="button"
							onClick={handleDownloadAudio}
							className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
						>
							{strings.actions.download}
						</button>
						<button
							type="button"
							onClick={flashActive ? stopLightDemo : startLightDemo}
							className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
								flashActive
									? "border border-[var(--destructive)] text-[var(--destructive)]"
									: "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
							}`}
						>
							{flashActive ? strings.actions.flashStop : strings.actions.flashStart}
						</button>
					</div>
					<div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
						<span className={`h-3.5 w-3.5 rounded-full transition ${lightOn ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`} aria-hidden />
						<span>{strings.actions.flashLabel}</span>
					</div>
				</div>
			</div>

			<div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div className="flex flex-col gap-1">
						<span className="text-sm font-semibold text-[var(--foreground)]">{strings.controls.heading}</span>
						<span className="text-xs text-[var(--muted-foreground)]">{strings.controls.speedHelp}</span>
						<span className="text-xs text-[var(--muted-foreground)]">{strings.controls.toneHelp}</span>
					</div>
					<div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-8">
						<label className="flex flex-col gap-2 md:flex-1">
							<span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
								{strings.controls.speed}
							</span>
							<input
								type="range"
								min={5}
								max={40}
								step={1}
								value={wpm}
								onChange={(event) => setWpm(Number(event.target.value))}
							/>
							<span className="text-xs text-[var(--muted-foreground)]">
								{wpm} {strings.controls.speedUnit}
							</span>
						</label>
						<label className="flex flex-col gap-2 md:flex-1">
							<span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
								{strings.controls.tone}
							</span>
							<input
								type="range"
								min={300}
								max={900}
								step={10}
								value={frequency}
								onChange={(event) => setFrequency(Number(event.target.value))}
							/>
							<span className="text-xs text-[var(--muted-foreground)]">
								{frequency} {strings.controls.toneUnit}
							</span>
						</label>
					</div>
				</div>
			</div>

			<div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
				<div className="mb-4 flex items-start justify-between gap-4">
					<div>
						<h2 className="text-lg font-semibold text-[var(--foreground)]">{strings.history.title}</h2>
						<p className="text-xs text-[var(--muted-foreground)]">{strings.actions.historyHint}</p>
					</div>
					{history.length ? (
						<button
							type="button"
							onClick={handleClearHistory}
							className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
						>
							{strings.history.clear}
						</button>
					) : null}
				</div>
				{history.length === 0 ? (
					<p className="text-sm text-[var(--muted-foreground)]">{strings.history.empty}</p>
				) : (
					<ul className="grid gap-3 md:grid-cols-2">
						{history.map((entry) => (
							<li key={entry.id} className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4">
								<div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">
									{entry.direction === "morse" ? strings.mode.morse : strings.mode.text}
								</div>
								<div className="text-xs text-[var(--muted-foreground)]">
									<span className="block truncate text-[var(--foreground)]">{entry.source}</span>
									<span className="block truncate text-[var(--muted-foreground)]">{entry.result}</span>
								</div>
								<button
									type="button"
									onClick={() => handleHistoryRestore(entry)}
									className="self-start rounded-full border border-[var(--primary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)] transition hover:bg-[var(--primary)]/10"
								>
									{strings.history.restore}
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			{toast ? (
				<div
					className={`fixed bottom-6 right-6 z-50 rounded-2xl border px-4 py-2 text-sm shadow-lg ${
						toast.variant === "error"
							? "border-[var(--destructive)] bg-[var(--destructive)]/10 text-[var(--destructive)]"
							: toast.variant === "success"
								? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
								: "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
					}`}
				>
					{toast.message}
				</div>
			) : null}
		</div>
	);
}

