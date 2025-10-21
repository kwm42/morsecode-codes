"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	buildMorseTimings,
	createMorseWaveBlob,
	getTotalDuration,
} from "@/lib/morse-audio";
import { normalizeMorse } from "@/lib/morse";

export type WordAudioLabels = {
	play: string;
	stop: string;
	download: string;
	speed: string;
	speedUnit: string;
	tone: string;
	toneUnit: string;
	statusIdle: string;
	statusPlaying: string;
	statusStopped: string;
	statusDownloadReady: string;
	statusDownloadError: string;
	statusUnavailable: string;
};

export type WordAudioPlayerProps = {
	morse: string;
	labels: WordAudioLabels;
};

const DEFAULT_WPM = 20;
const DEFAULT_FREQUENCY = 600;

export function WordAudioPlayer({ morse, labels }: WordAudioPlayerProps) {
	const [wpm, setWpm] = useState(DEFAULT_WPM);
	const [frequency, setFrequency] = useState(DEFAULT_FREQUENCY);
	const [isPlaying, setIsPlaying] = useState(false);
	const [status, setStatus] = useState(labels.statusIdle);

	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);
	const gainRef = useRef<GainNode | null>(null);
	const playbackTimeoutRef = useRef<number | null>(null);

	const normalizedMorse = useMemo(() => normalizeMorse(morse), [morse]);

	const stopAudio = useCallback(() => {
		if (oscillatorRef.current) {
			try {
				oscillatorRef.current.stop();
			} catch {
				// 振荡器可能已经停止
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
		setStatus(labels.statusStopped);
	}, [labels.statusStopped]);

	const startAudio = useCallback(() => {
		if (!normalizedMorse) {
			setStatus(labels.statusUnavailable);
			return;
		}

		const events = buildMorseTimings(normalizedMorse, wpm);
		if (!events.length) {
			setStatus(labels.statusUnavailable);
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
			setStatus(labels.statusStopped);
		};

		oscillatorRef.current = oscillator;
		gainRef.current = gain;

		const totalDuration = getTotalDuration(events);
		playbackTimeoutRef.current = window.setTimeout(() => {
			setIsPlaying(false);
			setStatus(labels.statusStopped);
		}, totalDuration * 1000 + 60);

		setIsPlaying(true);
		setStatus(labels.statusPlaying);
	}, [frequency, labels.statusPlaying, labels.statusStopped, labels.statusUnavailable, normalizedMorse, stopAudio, wpm]);

	const handleDownload = useCallback(() => {
		if (!normalizedMorse) {
			setStatus(labels.statusUnavailable);
			return;
		}

		const blob = createMorseWaveBlob(normalizedMorse, { frequency, wpm });

		if (!blob) {
			setStatus(labels.statusDownloadError);
			return;
		}

		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `morse-${Date.now()}.wav`;
		anchor.click();
		URL.revokeObjectURL(url);
		setStatus(labels.statusDownloadReady);
	}, [frequency, labels.statusDownloadError, labels.statusDownloadReady, labels.statusUnavailable, normalizedMorse, wpm]);

	useEffect(() => {
		return () => {
			stopAudio();
			if (audioContextRef.current) {
				audioContextRef.current.close().catch(() => {
					// 忽略关闭时的异常
				});
				audioContextRef.current = null;
			}
		};
	}, [stopAudio]);

	return (
		<div className="flex flex-col gap-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
			<div className="flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={isPlaying ? stopAudio : startAudio}
					className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide transition ${
						isPlaying
							? "border border-[var(--destructive)] text-[var(--destructive)]"
							: "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
					}`}
				>
					{isPlaying ? labels.stop : labels.play}
				</button>
				<button
					type="button"
					onClick={handleDownload}
					className="rounded-full border border-[var(--border)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
				>
					{labels.download}
				</button>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<label className="flex flex-col gap-2">
					<span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
						{labels.speed}
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
						{wpm} {labels.speedUnit}
					</span>
				</label>
				<label className="flex flex-col gap-2">
					<span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
						{labels.tone}
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
						{frequency} {labels.toneUnit}
					</span>
				</label>
			</div>
			<p className="text-xs text-[var(--muted-foreground)]">{status}</p>
		</div>
	);
}
