import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./routing";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const requested = locale ?? (await requestLocale);
  const resolvedLocale = hasLocale(locales, requested) ? requested : defaultLocale;

  const messages = (await import(`./messages/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale,
    messages,
  };
});
