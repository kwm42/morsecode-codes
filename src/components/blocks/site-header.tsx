import Image from "next/image";
import Link from "next/link";

export type NavigationLink = {
  name: string;
  href: string;
};

export type LanguageLink = {
  locale: string;
  label: string;
  href: string;
  isActive: boolean;
};

type SiteHeaderProps = {
  navigation: NavigationLink[];
  brandLabel: string;
  brandHref: string;
  cta: {
    label: string;
    href: string;
  };
  languages: LanguageLink[];
  languageLabel: string;
};

export function SiteHeader({
  navigation,
  brandLabel,
  brandHref,
  cta,
  languages,
  languageLabel,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={brandHref}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-[var(--primary)]"
        >
          <Image
            src="/favicon.ico"
            alt="MorseCode logo"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          {brandLabel}
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-[var(--muted-foreground)] sm:flex">
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors duration-150 hover:text-[var(--primary)]"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2"
            aria-label={languageLabel}
          >
            <span className="sr-only">{languageLabel}</span>
            {languages.map((language) => (
              <Link
                key={language.locale}
                href={language.href}
                className={`text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${language.isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--primary)]"}`}
              >
                {language.label}
              </Link>
            ))}
          </div>
          <Link
            href={cta.href}
            className="inline-flex items-center rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-95"
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
