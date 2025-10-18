import Link from "next/link";

export function SiteFooter() {
  return (
  <footer className="border-t border-[var(--border)] bg-[var(--card)] py-10 text-[var(--muted-foreground)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">Stay in touch</p>
          <p className="text-xs">
            <a
              className="text-[var(--primary)] transition hover:opacity-80"
              href="mailto:support@morsecode.codes"
            >
              support@morsecode.codes
            </a>
          </p>
          <p className="text-xs">
            <a
              className="text-[var(--primary)] transition hover:opacity-80"
              href="https://morsecode.codes"
              target="_blank"
              rel="noreferrer"
            >
              https://morsecode.codes
            </a>
          </p>
        </div>
        <div className="space-y-1 text-xs">
          <p>© {new Date().getFullYear()} MorseCode. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
            <Link
              className="text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
              href="/terms"
            >
              Terms of Use
            </Link>
            <Link
              className="text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
              href="/about"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
