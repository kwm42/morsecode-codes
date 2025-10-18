import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/routing";

export default createMiddleware({
  defaultLocale,
  locales,
  localeDetection: true,
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)"],
};
