'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SosCopy } from "./types";

type SequenceSegment = {
  type: "tone" | "gap";
  duration: number;
  symbol?: "." | "-";
  stepIndex?: number;
};

const TIMELINE_SYMBOLS: Array<"." | "-"> = [".", ".", ".", "-", "-", "-", ".", ".", "."];

const LETTER_LABELS = [
  { label: "S", range: [0, 3] },
  { label: "O", range: [3, 6] },
  { label: "S", range: [6, 9] },
];

const buildSequence = (wpm: number): SequenceSegment[] => {
  const unit = 1.2 / Math.max(wpm, 1);
  const dot = unit;
  const dash = unit * 3;
  const intraGap = unit;
  const letterGap = unit * 3;
  const wordGap = unit * 7;
  const letters: Array<Array<"." | "-">> = [
    [".", ".", "."],
    ["-", "-", "-"],
    [".", ".", "."],
  ];

  const sequence: SequenceSegment[] = [];
  let stepIndex = 0;

  letters.forEach((symbols, letterIndex) => {
    symbols.forEach((symbol, symbolIndex) => {
      sequence.push({
        type: "tone",
        duration: symbol === "." ? dot : dash,
        symbol,
        stepIndex,
      });
      stepIndex += 1;
      if (symbolIndex < symbols.length - 1) {
        sequence.push({ type: "gap", duration: intraGap });
      }
    });

    const gapDuration = letterIndex === letters.length - 1 ? wordGap : letterGap;
    sequence.push({ type: "gap", duration: gapDuration });
  });

  return sequence;
};

export function SosDemo({ copy }: { copy: SosCopy }) {
  const [wpm, setWpm] = useState<number>(18);
  const [frequency, setFrequency] = useState<number>(550);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const sequence = useMemo(() => buildSequence(wpm), [wpm]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  const stopPlayback = useCallback(() => {
    clearTimers();

    if (gainRef.current) {
      try {
        const ctx = audioContextRef.current;
        if (ctx) {
          gainRef.current.gain.cancelScheduledValues(ctx.currentTime);
          gainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
        }
      } catch (_error) {
        // 忽略硬件不支持导致的异常
        console.warn("Error stopping gain node", _error);
      }
      gainRef.current.disconnect();
      gainRef.current = null;
    }

    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (_error) {
        // Safari 若已停止会抛错，忽略即可
        console.warn("Error stopping oscillator", _error);
      }
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }

    setActiveStep(null);
    setIsPlaying(false);
  }, [clearTimers]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const win = window as typeof window & { webkitAudioContext?: typeof AudioContext };
    const ctor = win.AudioContext ?? win.webkitAudioContext;
    setIsSupported(Boolean(ctor));

    return () => {
      stopPlayback();
      audioContextRef.current?.close().catch(() => undefined);
      audioContextRef.current = null;
    };
  }, [stopPlayback]);

  useEffect(() => {
    if (!oscillatorRef.current || !audioContextRef.current) {
      return;
    }
    const ctx = audioContextRef.current;
    oscillatorRef.current.frequency.setTargetAtTime(frequency, ctx.currentTime, 0.01);
  }, [frequency]);

  const startPlayback = useCallback(async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    if (!isSupported) {
      return;
    }

    let context = audioContextRef.current;
    if (!context) {
      const win = window as typeof window & { webkitAudioContext?: typeof AudioContext };
      const Ctor = win.AudioContext ?? win.webkitAudioContext;
      if (!Ctor) {
        setIsSupported(false);
        return;
      }
      context = new Ctor();
      audioContextRef.current = context;
    }

    if (context.state === "suspended") {
      try {
        await context.resume();
      } catch (_error) {
        console.warn("Error resuming audio context", _error);
        setIsSupported(false);
        return;
      }
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    gainNode.gain.value = 0;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();

    oscillatorRef.current = oscillator;
    gainRef.current = gainNode;
    setIsPlaying(true);

    let elapsed = 0;
    sequence.forEach((segment) => {
      const startMs = elapsed * 1000;
      const timeoutId = window.setTimeout(() => {
        const ctx = audioContextRef.current;
        const activeGain = gainRef.current;
        if (!ctx || !activeGain) {
          return;
        }

        if (segment.type === "tone") {
          activeGain.gain.setTargetAtTime(1, ctx.currentTime, 0.01);
          setActiveStep(segment.stepIndex ?? null);

          const stopId = window.setTimeout(() => {
            gainRef.current?.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
            setActiveStep(null);
          }, segment.duration * 1000);
          timeoutsRef.current.push(stopId);
        } else {
          activeGain.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
          setActiveStep(null);
        }
      }, startMs);

      timeoutsRef.current.push(timeoutId);
      elapsed += segment.duration;
    });

    const finishId = window.setTimeout(() => {
      stopPlayback();
    }, elapsed * 1000 + 30);
    timeoutsRef.current.push(finishId);
  }, [frequency, isPlaying, isSupported, sequence, stopPlayback]);

  const statusText = isSupported ? (isPlaying ? copy.status.playing : copy.status.ready) : copy.audioUnsupported;

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <header className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">{copy.title}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{copy.summary}</p>
      </header>

      <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">{statusText}</p>
          <button
            type="button"
            onClick={startPlayback}
            disabled={!isSupported}
            className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPlaying ? copy.stopLabel : copy.playLabel}
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            {copy.timelineTitle}
          </p>
          <div className="flex items-center justify-between gap-2 md:gap-3">
            {TIMELINE_SYMBOLS.map((symbol, index) => (
              <span
                key={`${symbol}-${index}`}
                className={`flex h-10 w-full max-w-[48px] items-center justify-center rounded-xl border text-lg font-semibold transition ${
                  activeStep === index
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]"
                }`}
              >
                {symbol}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            {LETTER_LABELS.map((item) => (
              <span key={`${item.label}-${item.range[0]}`} className="flex-1 text-center">
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <label className="flex w-full flex-col gap-2 md:w-1/2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              {copy.speedLabel}
            </span>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={wpm}
              onChange={(event) => setWpm(Number(event.target.value))}
              disabled={isPlaying}
              className="w-full accent-[var(--primary)]"
            />
            <span className="text-xs text-[var(--muted-foreground)]">
              {wpm} {copy.speedUnit}
            </span>
          </label>
          <label className="flex w-full flex-col gap-2 md:w-1/2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              {copy.toneLabel}
            </span>
            <input
              type="range"
              min={350}
              max={900}
              step={10}
              value={frequency}
              onChange={(event) => setFrequency(Number(event.target.value))}
              className="w-full accent-[var(--secondary)]"
            />
            <span className="text-xs text-[var(--muted-foreground)]">
              {frequency} {copy.toneUnit}
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {copy.features.map((feature) => (
          <article
            key={feature.title}
            className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5"
          >
            <h3 className="text-base font-semibold text-[var(--foreground)]">{feature.title}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">{feature.description}</p>
          </article>
        ))}
      </div>

      <p className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4 text-xs text-[var(--muted-foreground)]">
        {copy.notes}
      </p>
    </section>
  );
}
