import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/blocks/site-footer";
import { SiteHeader } from "@/components/blocks/site-header";
import { locales, type Locale } from "@/i18n/routing";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
}

const getLocalizedPath = (locale: Locale, pathname: string) => {
  if (pathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathname}`;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const navigationT = await getTranslations("navigation");
  const brandT = await getTranslations("brand");
  const headerT = await getTranslations("header");
  const footerT = await getTranslations("footer");
  const languageT = await getTranslations("language");

  const navigation = [
    { name: navigationT("home"), href: getLocalizedPath(locale, "/") },
    { name: navigationT("translator"), href: getLocalizedPath(locale, "/translator") },
    { name: navigationT("chart"), href: getLocalizedPath(locale, "/chart") },
    // { name: navigationT("learn"), href: getLocalizedPath(locale, "/learn-practice") },
    { name: navigationT("fun"), href: getLocalizedPath(locale, "/applications-fun") },
    // { name: navigationT("community"), href: getLocalizedPath(locale, "/community") },
    // { name: navigationT("posts"), href: getLocalizedPath(locale, "/posts") },
  ];

  const languages = locales.map((localeOption) => ({
    locale: localeOption,
    label: languageT(localeOption),
    href: getLocalizedPath(localeOption, "/"),
    isActive: localeOption === locale,
  }));

  const contactEmailLabel = footerT("emailLabel");
  const contactWebsiteLabel = footerT("websiteLabel");

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SiteHeader
        navigation={navigation}
        brandLabel={brandT("name")}
        brandHref={getLocalizedPath(locale, "/")}
        cta={{
          href: getLocalizedPath(locale, "/translator"),
          label: headerT("cta"),
        }}
        languages={languages}
        languageLabel={languageT("label")}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        contactHeading={footerT("contactHeading")}
        contactEmail={{
          label: contactEmailLabel,
          href: `mailto:${contactEmailLabel}`,
        }}
        contactWebsite={{
          label: contactWebsiteLabel,
          href: contactWebsiteLabel,
        }}
        rightsNotice={footerT("rights", { year: new Date().getFullYear() })}
        legalLinks={[
          {
            label: footerT("legalLinks.privacy"),
            href: getLocalizedPath(locale, "/privacy"),
          },
          {
            label: footerT("legalLinks.terms"),
            href: getLocalizedPath(locale, "/terms"),
          },
          {
            label: footerT("legalLinks.about"),
            href: getLocalizedPath(locale, "/about"),
          },
        ]}
      />
    </NextIntlClientProvider>
  );
}
