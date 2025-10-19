'use client';

import * as Select from "@radix-ui/react-select";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type LanguageLink = {
  locale: string;
  label: string;
  href: string;
  isActive: boolean;
};

type LanguageSwitcherProps = {
  languages: LanguageLink[];
  label: string;
};

export function LanguageSwitcher({ languages, label }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const supportedLocales = useMemo(() => new Set(languages.map((language) => language.locale)), [languages]);

  const activeLocale = languages.find((language) => language.isActive)?.locale ?? languages[0]?.locale ?? "";

  const handleChange = (nextLocale: string) => {
    if (!supportedLocales.has(nextLocale)) {
      return;
    }

    const currentPathname = pathname ?? "/";
    const segments = currentPathname.split("/").filter(Boolean);
    const currentHasLocale = segments.length > 0 && supportedLocales.has(segments[0]);
    const restSegments = currentHasLocale ? segments.slice(1) : segments;

    // const nextSegments = nextLocale === defaultLocale ? restSegments : [nextLocale, ...restSegments];
    const nextSegments = [nextLocale, ...restSegments];
    const nextPath = nextSegments.length ? `/${nextSegments.join("/")}` : "/";
    const search = searchParams.toString();
    const resolvedPath = search ? `${nextPath}?${search}` : nextPath;
    const currentFullPath = search ? `${currentPathname}?${search}` : currentPathname;

    if (resolvedPath === currentFullPath) {
      return;
    }

    router.push(resolvedPath);
  };

  return (
    <div className="inline-flex items-center">
      <span className="sr-only">{label}</span>
      <Select.Root value={activeLocale} onValueChange={handleChange}>
        <Select.Trigger
          aria-label={label}
          className="flex min-w-[150px] items-center justify-between gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 data-[state=open]:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Select.Value>
            {languages.find((language) => language.locale === activeLocale)?.label ?? label}
          </Select.Value>
          <Select.Icon>
            <svg
              aria-hidden="true"
              className="h-2.5 w-2.5 text-[var(--muted-foreground)]"
              viewBox="0 0 10 6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L5 5L9 1" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--popover)] text-[var(--foreground)] shadow-lg"
            position="popper"
            sideOffset={8}
          >
            <Select.Viewport className="p-1">
              {languages.map((language) => (
                <Select.Item
                  key={language.locale}
                  value={language.locale}
                  className="flex cursor-pointer select-none items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] outline-none transition data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-[var(--accent-foreground)] data-[state=checked]:text-[var(--primary)]"
                >
                  <Select.ItemText>{language.label}</Select.ItemText>
                  <Select.ItemIndicator className="ml-2 text-[var(--primary)]">✓</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
