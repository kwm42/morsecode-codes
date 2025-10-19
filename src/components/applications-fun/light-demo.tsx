'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LightCopy, LightPresetOption } from "./types";

type LightSequenceSegment = {
  type: "light" | "gap";
  duration: number;
  stepIndex: number | null;
};

type LightPreviewSegment = {
  symbol: string;
  stepIndex: number | null;
};

type LightMorseData = {
  sequence: LightSequenceSegment[];
  preview: LightPreviewSegment[];
  hasContent: boolean;
};

const MORSE_MAP: Record<string, string> = {
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
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  "&": ".-...",
  "@": ".--.-.",
  ":": "---...",
  ",": "--..--",
  ".": ".-.-.-",
  "?": "..--..",
  "!": "-.-.--",
  "'": ".----.",
  '"': ".-..-.",
  "/": "-..-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  "(": "-.--.",
  ")": "-.--.-",
};

const SANITIZE_REGEX = /[^A-Z0-9&@'".,?:=\/\-()!+\s]/g;

const sanitizeMessage = (input: string): string =>
  input
    .toUpperCase()
    .replace(SANITIZE_REGEX, " ")
    .replace(/\s+/g, " ")
    .trim();

const COLOR_PRESETS: Record<string, { hex: string }> = {
  warm: { hex: "#FACC15" },
  cool: { hex: "#38BDF8" },
  emerald: { hex: "#34D399" },
};

const DEFAULT_COLOR_KEY = "warm";
const CUSTOM_COLOR_KEY = "custom";

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

const DEFAULT_RGB: RgbColor = { r: 250, g: 204, b: 21 };

const hexToRgb = (hex: string): RgbColor | null => {
  const normalized = hex.replace("#", "");
  if (!/^([0-9A-Fa-f]{6})$/.test(normalized)) {
    return null;
  }
  const value = parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return { r, g, b };
};

const mixWithWhite = (rgb: RgbColor, ratio: number): string => {
  const clampRatio = Math.min(Math.max(ratio, 0), 1);
  const r = Math.round(rgb.r + (255 - rgb.r) * clampRatio);
  const g = Math.round(rgb.g + (255 - rgb.g) * clampRatio);
  const b = Math.round(rgb.b + (255 - rgb.b) * clampRatio);
  return `rgb(${r}, ${g}, ${b})`;
};

const toRgba = (rgb: RgbColor, alpha: number): string => {
  const clampAlpha = Math.min(Math.max(alpha, 0), 1);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampAlpha})`;
};

const buildLightMorseData = (message: string, wpm: number): LightMorseData => {
  const sanitized = sanitizeMessage(message);
  if (!sanitized) {
    return { sequence: [], preview: [], hasContent: false };
  }

  const words = sanitized.split(" ").filter(Boolean);
  const morseWords = words
    .map((word) =>
      word
        .split("")
        .map((char) => MORSE_MAP[char])
        .filter(Boolean)
    )
    .filter((letters) => letters.length > 0);

  if (!morseWords.length) {
    return { sequence: [], preview: [], hasContent: false };
  }

  const unit = 1.2 / Math.max(wpm, 1);
  const dot = unit;
  const dash = unit * 3;
  const intraGap = unit;
  const letterGap = unit * 3;
  const wordGap = unit * 7;

  const sequence: LightSequenceSegment[] = [];
  const preview: LightPreviewSegment[] = [];
  let stepIndex = 0;

  morseWords.forEach((letters, wordIndex) => {
    letters.forEach((letter, letterIndex) => {
      const symbols = letter.split("");

      symbols.forEach((symbol, symbolIndex) => {
        sequence.push({
          type: "light",
          duration: symbol === "." ? dot : dash,
          stepIndex,
        });
        preview.push({ symbol, stepIndex });
        stepIndex += 1;

        if (symbolIndex < symbols.length - 1) {
          sequence.push({ type: "gap", duration: intraGap, stepIndex: null });
        }
      });

      if (letterIndex < letters.length - 1) {
        sequence.push({ type: "gap", duration: letterGap, stepIndex: null });
      }
    });

    if (wordIndex < morseWords.length - 1) {
      sequence.push({ type: "gap", duration: wordGap, stepIndex: null });
      preview.push({ symbol: "/", stepIndex: null });
    }
  });

  return {
    sequence,
    preview,
    hasContent: stepIndex > 0,
  };
};

export function LightDemo({ copy }: { copy: LightCopy }) {
  const { controls } = copy;
  const presets = controls.presets ?? [];
  const defaultPreset = presets[0];
  const colorOptionsFromCopy = controls.colorOptions ?? [];
  const validColorOptions = useMemo(
    () => colorOptionsFromCopy.filter((option) => Boolean(COLOR_PRESETS[option.value])),
    [colorOptionsFromCopy]
  );
  const fallbackColorKey = validColorOptions[0]?.value ?? DEFAULT_COLOR_KEY;
  const fallbackHex = COLOR_PRESETS[fallbackColorKey]?.hex ?? COLOR_PRESETS[DEFAULT_COLOR_KEY].hex;
  const colorOptionsForSelect = useMemo(() => {
    const options =
      validColorOptions.length > 0
        ? validColorOptions
        : Object.keys(COLOR_PRESETS).map((value) => ({ value, label: value }));
    return [...options, { value: CUSTOM_COLOR_KEY, label: controls.customColorLabel }];
  }, [controls.customColorLabel, validColorOptions]);

  const [mode, setMode] = useState<string>(defaultPreset?.value ?? controls.customValue);
  const [customMessage, setCustomMessage] = useState<string>("HELLO");
  const [selectedMessage, setSelectedMessage] = useState<string>(
    defaultPreset?.message ?? "HELLO"
  );
  const [wpm, setWpm] = useState<number>(defaultPreset?.speed ?? 12);
  const [brightness, setBrightness] = useState<number>(80);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLightOn, setIsLightOn] = useState<boolean>(false);
  const [activeSymbolIndex, setActiveSymbolIndex] = useState<number | null>(null);
  const [colorKey, setColorKey] = useState<string>(() => fallbackColorKey);
  const [customColor, setCustomColor] = useState<string>(() => fallbackHex);

  const timeoutsRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  const stopSequence = useCallback(() => {
    clearTimers();
    setIsPlaying(false);
    setIsLightOn(false);
    setActiveSymbolIndex(null);
  }, [clearTimers]);

  const activePreset: LightPresetOption | undefined = useMemo(
    () => presets.find((preset) => preset.value === mode),
    [mode, presets]
  );

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (mode === controls.customValue) {
      setSelectedMessage(customMessage);
      return;
    }

    if (activePreset) {
      setSelectedMessage(activePreset.message);
      setWpm(activePreset.speed ?? 12);
    }
  }, [mode, activePreset, controls.customValue, customMessage]);

  useEffect(() => {
    if (colorKey === CUSTOM_COLOR_KEY) {
      return;
    }

    if (!COLOR_PRESETS[colorKey]) {
      setColorKey(fallbackColorKey);
      return;
    }
    if (validColorOptions.length > 0 && !validColorOptions.some((option) => option.value === colorKey)) {
      setColorKey(fallbackColorKey);
    }
  }, [colorKey, fallbackColorKey, validColorOptions]);

  const isPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlayingRef.current) {
      return;
    }
    stopSequence();
  }, [selectedMessage, wpm, stopSequence]);

  const morseData = useMemo(() => buildLightMorseData(selectedMessage, wpm), [selectedMessage, wpm]);

  const isMessageValid = morseData.hasContent;
  const statusText = isMessageValid
    ? isPlaying
      ? controls.playingStatus
      : controls.readyStatus
    : controls.emptyStatus;
  const buttonDisabled = !isMessageValid && !isPlaying;

  const startSequence = useCallback(() => {
    if (isPlaying) {
      stopSequence();
      return;
    }

    if (!isMessageValid) {
      return;
    }

    setIsPlaying(true);
    setIsLightOn(false);
    setActiveSymbolIndex(null);
    clearTimers();

    let elapsed = 0;
    morseData.sequence.forEach((segment) => {
      const timeoutId = window.setTimeout(() => {
        if (segment.type === "light") {
          setIsLightOn(true);
          setActiveSymbolIndex(segment.stepIndex);
        } else {
          setIsLightOn(false);
          setActiveSymbolIndex(null);
        }
      }, elapsed * 1000);

      timeoutsRef.current.push(timeoutId);
      elapsed += segment.duration;
    });

    const finishId = window.setTimeout(() => {
      stopSequence();
    }, elapsed * 1000 + 30);
    timeoutsRef.current.push(finishId);
  }, [clearTimers, isMessageValid, isPlaying, morseData.sequence, stopSequence]);

  const handleModeChange = (nextMode: string) => {
    setMode(nextMode);
    if (nextMode === controls.customValue) {
      setSelectedMessage(customMessage);
    } else {
      const preset = presets.find((option) => option.value === nextMode);
      if (preset) {
        setSelectedMessage(preset.message);
        setWpm(preset.speed ?? wpm);
      }
    }

    if (isPlaying) {
      stopSequence();
    }
  };

  const handleCustomMessageChange = (value: string) => {
    const upper = value.toUpperCase();
    setCustomMessage(upper);
    if (mode === controls.customValue) {
      setSelectedMessage(upper);
    }
  };

  const handleColorSelectChange = useCallback((value: string) => {
    if (value === CUSTOM_COLOR_KEY) {
      setColorKey(CUSTOM_COLOR_KEY);
      return;
    }
    setColorKey(value);
  }, []);

  const handleCustomColorChange = useCallback(
    (value: string) => {
      const next = value && value.startsWith("#") ? value : fallbackHex;
      setCustomColor(next);
      setColorKey(CUSTOM_COLOR_KEY);
    },
    [fallbackHex]
  );

  const sanitizedForPreview = useMemo(() => sanitizeMessage(selectedMessage), [selectedMessage]);

  const glowStrength = brightness / 100;
  const activeColorKey = colorKey === CUSTOM_COLOR_KEY ? CUSTOM_COLOR_KEY : colorKey;
  const baseRgb = useMemo(() => {
    if (activeColorKey === CUSTOM_COLOR_KEY) {
      return hexToRgb(customColor) ?? DEFAULT_RGB;
    }
    const presetHex = COLOR_PRESETS[activeColorKey]?.hex ?? COLOR_PRESETS[DEFAULT_COLOR_KEY].hex;
    return hexToRgb(presetHex) ?? DEFAULT_RGB;
  }, [activeColorKey, customColor]);
  const { outerStyle, innerStyle } = useMemo(() => {
    const rgb = baseRgb ?? DEFAULT_RGB;
    const activeGlowAlpha = 0.25 + glowStrength * 0.35;
    const outer = {
      boxShadow: isLightOn
        ? `0 0 ${12 + glowStrength * 28}px ${4 + glowStrength * 12}px ${toRgba(rgb, activeGlowAlpha)}`
        : `0 0 12px 2px ${toRgba(rgb, 0.2)}`,
      background: isLightOn ? mixWithWhite(rgb, 0.2) : mixWithWhite(rgb, 0.72),
    } as const;
    const inner = {
      background: isLightOn ? mixWithWhite(rgb, 0.08) : mixWithWhite(rgb, 0.78),
      boxShadow: isLightOn
        ? `0 0 ${10 + glowStrength * 18}px ${toRgba(rgb, 0.35 + glowStrength * 0.3)}`
        : `inset 0 0 10px ${toRgba(rgb, 0.25)}`,
    } as const;
    return { outerStyle: outer, innerStyle: inner };
  }, [baseRgb, glowStrength, isLightOn]);

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <header className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">{copy.title}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{copy.summary}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p
              className={`text-sm ${
                !isMessageValid && !isPlaying
                  ? "text-[var(--destructive)]"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              {statusText}
            </p>
            <button
              type="button"
              onClick={startSequence}
              disabled={buttonDisabled}
              className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPlaying ? controls.stop : controls.start}
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                {controls.presetLabel}
              </span>
              <select
                value={mode}
                onChange={(event) => handleModeChange(event.target.value)}
                disabled={isPlaying}
                className="w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {presets.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
                <option value={controls.customValue}>{controls.customLabel}</option>
              </select>
              {activePreset?.value === "classroom" && (
                <span className="text-xs text-[var(--muted-foreground)]">
                  {controls.classroomHint}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                {controls.messageLabel}
              </span>
              <input
                type="text"
                value={mode === controls.customValue ? customMessage : selectedMessage}
                onChange={(event) => handleCustomMessageChange(event.target.value)}
                placeholder={controls.messagePlaceholder}
                maxLength={48}
                disabled={mode !== controls.customValue || isPlaying}
                className="w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                {controls.speedLabel}
              </span>
              <input
                type="range"
                min={4}
                max={30}
                step={1}
                value={wpm}
                onChange={(event) => setWpm(Number(event.target.value))}
                disabled={isPlaying}
                className="w-full accent-[var(--primary)]"
              />
              <span className="text-xs text-[var(--muted-foreground)]">
                {wpm} {controls.speedUnit}
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                {controls.brightnessLabel}
              </span>
              <input
                type="range"
                min={30}
                max={100}
                step={5}
                value={brightness}
                onChange={(event) => setBrightness(Number(event.target.value))}
                className="w-full accent-[var(--secondary)]"
              />
              <span className="text-xs text-[var(--muted-foreground)]">{brightness}%</span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                {controls.colorLabel}
              </span>
              <select
                value={colorKey}
                onChange={(event) => handleColorSelectChange(event.target.value)}
                className="w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
              >
                {colorOptionsForSelect.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 md:col-span-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                {controls.colorPickerLabel}
              </span>
              <input
                type="color"
                value={customColor}
                onChange={(event) => handleCustomColorChange(event.target.value)}
                className="h-10 w-full cursor-pointer rounded-full border border-[var(--border)] bg-[var(--background)] p-1 transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
              />
              {controls.colorPickerHint ? (
                <span className="text-xs text-[var(--muted-foreground)]">{controls.colorPickerHint}</span>
              ) : null}
            </label>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-6">
          <div
            className="relative flex h-48 w-48 items-center justify-center rounded-full transition duration-150"
            style={outerStyle}
          >
            <div
              className="h-28 w-28 rounded-full transition duration-150"
              style={innerStyle}
            />
          </div>
          <div className="w-full space-y-2">
            <p className="text-center text-sm text-[var(--muted-foreground)]">
              {sanitizedForPreview || "—"}
            </p>
            <div className="flex flex-wrap justify-center gap-1">
              {morseData.preview.length > 0 ? (
                morseData.preview.map((segment, index) => {
                  const isActive =
                    segment.stepIndex !== null && segment.stepIndex === activeSymbolIndex;
                  if (segment.symbol === "/") {
                    return (
                      <span
                        key={`word-gap-${index}`}
                        className="flex h-8 min-w-[24px] items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] px-2 text-xs font-semibold uppercase text-[var(--muted-foreground)]"
                      >
                        /
                      </span>
                    );
                  }
                  return (
                    <span
                      key={`symbol-${index}`}
                      className={`flex h-8 min-w-[32px] items-center justify-center rounded-xl border px-2 text-sm font-semibold transition ${
                        isActive
                          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      {segment.symbol}
                    </span>
                  );
                })
              ) : (
                <span className="text-xs text-[var(--muted-foreground)]">
                  {controls.emptyStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {copy.modes.map((modeCard) => (
          <article
            key={modeCard.title}
            className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5"
          >
            <h3 className="text-base font-semibold text-[var(--foreground)]">{modeCard.title}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">{modeCard.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
        <ul className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm text-[var(--muted-foreground)]">
          {copy.tips.map((tip) => (
            <li key={tip} className="leading-relaxed">
              {tip}
            </li>
          ))}
        </ul>
        <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4 text-xs text-[var(--muted-foreground)]">
          {copy.accessibility}
        </p>
      </div>
    </section>
  );
}
