import type { Locale } from "@/i18n/routing";

const ROOT_PATH = "/";
export const SITE_ORIGIN = "https://morsecode.codes";

const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === ROOT_PATH) {
    return "";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
};

export const buildCanonicalPath = (locale: Locale, pathname: string = ROOT_PATH) => {
  const normalized = normalizePathname(pathname);
  return normalized ? `/${locale}${normalized}` : `/${locale}`;
};

export const buildSiteUrl = (pathname: string = ROOT_PATH) => {
  const normalized = normalizePathname(pathname);
  return normalized ? `${SITE_ORIGIN}${normalized}` : SITE_ORIGIN;
};

export const buildAbsoluteUrl = (locale: Locale, pathname: string = ROOT_PATH) => {
  return `${SITE_ORIGIN}${buildCanonicalPath(locale, pathname)}`;
};
