import Link from "next/link";

export type FooterLink = {
  label: string;
  href: string;
};

type SiteFooterProps = {
  contactHeading: string;
  contactEmail: FooterLink;
  contactWebsite: FooterLink;
  rightsNotice: string;
  legalLinks: FooterLink[];
};

export function SiteFooter({
  contactHeading,
  contactEmail,
  contactWebsite,
  rightsNotice,
  legalLinks,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] py-10 text-[var(--muted-foreground)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">{contactHeading}</p>
          <p className="text-xs">
            <a
              className="text-[var(--primary)] transition hover:opacity-80"
              href={contactEmail.href}
            >
              {contactEmail.label}
            </a>
          </p>
          <p className="text-xs">
            <a
              className="text-[var(--primary)] transition hover:opacity-80"
              href={contactWebsite.href}
              target="_blank"
              rel="noreferrer"
            >
              {contactWebsite.label}
            </a>
          </p>
        </div>
        <div className="space-y-1 text-xs">
          <p>{rightsNotice}</p>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                className="text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
