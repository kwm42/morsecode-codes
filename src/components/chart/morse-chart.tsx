'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";
import {
  LETTER_ENTRIES,
  NUMBER_ENTRIES,
  SYMBOL_ENTRIES,
  type MorseChartEntry,
  type MorseChartPattern,
} from "@/lib/morse-chart";
import { buildMorseTimings, getTotalDuration, type MorseTimingEvent } from "@/lib/morse-audio";
import { normalizeMorse } from "@/lib/morse";

const DEFAULT_WPM = 18;
const DEFAULT_FREQUENCY = 650;

export type ChartStrings = {
  search: {
    label: string;
    placeholder: string;
    clear: string;
    results: {
      zero: string;
      one: string;
      other: string;
    };
  };
  columns: {
    section: string;
    symbol: string;
    morse: string;
    pronunciation: string;
  };
  sections: {
    letters: {
      title: string;
      description: string;
    };
    numbers: {
      title: string;
      description: string;
    };
    symbols: {
      title: string;
      description: string;
    };
  };
  actions: {
    play: string;
    stop: string;
    copy: string;
    download: string;
    print: string;
    copied: string;
    copyError: string;
    downloadReady: string;
    downloadError: string;
    noAudio: string;
  };
  pronunciation: {
    dot: string;
    dash: string;
  };
};

type ToastVariant = "success" | "error" | "info";

type ToastState = {
  message: string;
  variant: ToastVariant;
};

type ChartSection = {
  id: "letters" | "numbers" | "symbols";
  title: string;
  description: string;
  entries: MorseChartEntry[];
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildPronunciation = (pattern: MorseChartPattern[], strings: ChartStrings["pronunciation"]) =>
  pattern
    .map((unit) => (unit === "dot" ? strings.dot : strings.dash))
    .join(" ");

export function MorseChart({ locale, strings }: { locale: Locale; strings: ChartStrings }) {
  const [query, setQuery] = useState("");
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const playbackTimeoutRef = useRef<number | null>(null);

  const pluralRules = useMemo(() => new Intl.PluralRules(locale), [locale]);

  const sections = useMemo<ChartSection[]>(
    () => [
      {
        id: "letters",
        title: strings.sections.letters.title,
        description: strings.sections.letters.description,
        entries: LETTER_ENTRIES,
      },
      {
        id: "numbers",
        title: strings.sections.numbers.title,
        description: strings.sections.numbers.description,
        entries: NUMBER_ENTRIES,
      },
      {
        id: "symbols",
        title: strings.sections.symbols.title,
        description: strings.sections.symbols.description,
        entries: SYMBOL_ENTRIES,
      },
    ],
    [strings.sections]
  );

  const pronounce = useCallback(
    (entry: MorseChartEntry) => buildPronunciation(entry.pattern, strings.pronunciation),
    [strings.pronunciation]
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    if (!normalizedQuery) {
      return sections.map((section) => ({ ...section, rows: section.entries }));
    }

    return sections.map((section) => {
      const rows = section.entries.filter((entry) => {
        const pron = pronounce(entry).toLowerCase();
        return (
          entry.symbol.toLowerCase().includes(normalizedQuery) ||
          entry.code.toLowerCase().includes(normalizedQuery) ||
          pron.includes(normalizedQuery)
        );
      });

      return { ...section, rows };
    });
  }, [normalizedQuery, pronounce, sections]);

  const totalResults = useMemo(
    () => filteredSections.reduce((acc, section) => acc + section.rows.length, 0),
    [filteredSections]
  );

  const resultsLabel = useMemo(() => {
    if (!normalizedQuery) {
      return "";
    }

    if (totalResults === 0) {
      return strings.search.results.zero;
    }

    const rule = pluralRules.select(totalResults);
    if (rule === "one") {
      return strings.search.results.one;
    }

    return strings.search.results.other.replace("{count}", totalResults.toString());
  }, [normalizedQuery, pluralRules, strings.search.results, totalResults]);

  const showToast = useCallback((message: string, variant: ToastVariant) => {
    setToast({ message, variant });
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const stopAudio = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch {
        // Oscillator might already be stopped.
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

    setActiveSymbol(null);
  }, []);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const scheduleAudio = useCallback(
    (events: MorseTimingEvent[]) => {
      const audioContext = audioContextRef.current ?? new AudioContext();
      audioContextRef.current = audioContext;

      if (audioContext.state === "suspended") {
        void audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.frequency.setValueAtTime(DEFAULT_FREQUENCY, audioContext.currentTime);
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
        setActiveSymbol(null);
      };

      oscillatorRef.current = oscillator;
      gainRef.current = gain;

      const totalDuration = getTotalDuration(events);
      playbackTimeoutRef.current = window.setTimeout(() => {
        setActiveSymbol(null);
      }, totalDuration * 1000 + 50);
    },
    []
  );

  const handlePlay = useCallback(
    (symbol: string, code: string) => {
      if (activeSymbol === symbol) {
        stopAudio();
        return;
      }

      const normalized = normalizeMorse(code);
      if (!normalized) {
        showToast(strings.actions.noAudio, "error");
        return;
      }

      const events = buildMorseTimings(normalized, DEFAULT_WPM);
      if (!events.length) {
        showToast(strings.actions.noAudio, "error");
        return;
      }

      stopAudio();
      setActiveSymbol(symbol);
      scheduleAudio(events);
    },
    [activeSymbol, scheduleAudio, showToast, stopAudio, strings.actions.noAudio]
  );

  const handleCopy = useCallback(
    async (code: string) => {
      try {
        await navigator.clipboard.writeText(code);
        showToast(strings.actions.copied, "success");
      } catch {
        showToast(strings.actions.copyError, "error");
      }
    },
    [showToast, strings.actions.copied, strings.actions.copyError]
  );

  const flattenedRows = useMemo(() => {
    return sections.flatMap((section) =>
      section.entries.map((entry) => ({
        section: section.title,
        entry,
      }))
    );
  }, [sections]);

  const handleDownload = useCallback(() => {
    try {
      const header = [
        strings.columns.section,
        strings.columns.symbol,
        strings.columns.morse,
        strings.columns.pronunciation,
      ].join(",");

      const rows = flattenedRows
        .map(({ section, entry }) => {
          const values = [section, entry.symbol, entry.code, pronounce(entry)];
          return values
            .map((value) => {
              const safeValue = String(value).replace(/"/g, '""');
              return `"${safeValue}"`;
            })
            .join(",");
        })
        .join("\n");

      const csv = `${header}\n${rows}`;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `morse-chart-${Date.now()}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);

      showToast(strings.actions.downloadReady, "success");
    } catch (error) {
      console.error(error);
      showToast(strings.actions.downloadError, "error");
    }
  }, [
    flattenedRows,
    pronounce,
    showToast,
    strings.actions.downloadError,
    strings.actions.downloadReady,
    strings.columns.morse,
    strings.columns.pronunciation,
    strings.columns.section,
    strings.columns.symbol,
  ]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const highlightMatch = useCallback(
    (text: string) => {
      if (!normalizedQuery) {
        return text;
      }

      const regex = new RegExp(`(${escapeRegExp(normalizedQuery)})`, "gi");
      const parts = text.split(regex);

      return parts.map((part, index) => {
        if (!part) {
          return null;
        }

        if (part.toLowerCase() === normalizedQuery) {
          return (
            <mark key={`${part}-${index}`} className="rounded bg-[var(--primary)]/20 px-1 text-[var(--primary)]">
              {part}
            </mark>
          );
        }

        return <span key={`${part}-${index}`}>{part}</span>;
      });
    },
    [normalizedQuery]
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <label className="flex flex-col gap-2 lg:max-w-lg">
            <span className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              {strings.search.label}
            </span>
            <div className="relative">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={strings.search.placeholder}
                className="w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full border border-[var(--border)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  {strings.search.clear}
                </button>
              ) : null}
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {strings.actions.download}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {strings.actions.print}
            </button>
          </div>
        </div>
        {resultsLabel ? <p className="text-xs text-[var(--muted-foreground)]">{resultsLabel}</p> : null}
      </div>

      {filteredSections.map((section) => (
        <section key={section.id} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <header className="mb-4 flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">{section.title}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">{section.description}</p>
          </header>
          {section.rows.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">{strings.search.results.zero}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
                <thead className="bg-[var(--background)]">
                  <tr className="text-[var(--muted-foreground)]">
                    <th scope="col" className="px-4 py-2 font-medium uppercase tracking-wide">
                      {strings.columns.symbol}
                    </th>
                    <th scope="col" className="px-4 py-2 font-medium uppercase tracking-wide">
                      {strings.columns.morse}
                    </th>
                    <th scope="col" className="px-4 py-2 font-medium uppercase tracking-wide">
                      {strings.columns.pronunciation}
                    </th>
                    <th scope="col" className="px-4 py-2 text-right font-medium uppercase tracking-wide">
                      {strings.actions.play}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {section.rows.map((entry) => {
                    const pron = pronounce(entry);
                    const isActive = activeSymbol === entry.symbol;

                    return (
                      <tr key={`${section.id}-${entry.symbol}`} className="transition hover:bg-[var(--background)]">
                        <td className="px-4 py-2 font-semibold text-[var(--foreground)]">
                          <span className="text-base">{highlightMatch(entry.symbol)}</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm text-[var(--primary)]">
                          {highlightMatch(entry.code)}
                        </td>
                        <td className="px-4 py-2 text-sm text-[var(--muted-foreground)]">
                          {highlightMatch(pron)}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handlePlay(entry.symbol, entry.code)}
                              className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${
                                isActive
                                  ? "border border-[var(--destructive)] text-[var(--destructive)]"
                                  : "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                              }`}
                              aria-pressed={isActive}
                              aria-label={`${isActive ? strings.actions.stop : strings.actions.play} ${entry.symbol}`}
                            >
                              {isActive ? strings.actions.stop : strings.actions.play}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(entry.code)}
                              className="rounded-full border border-[var(--primary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)] transition hover:bg-[var(--primary)]/10"
                              aria-label={`${strings.actions.copy} ${entry.symbol}`}
                            >
                              {strings.actions.copy}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}

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
