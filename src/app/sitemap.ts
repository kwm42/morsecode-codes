import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { buildAbsoluteUrl, buildSiteUrl } from "@/lib/metadata";

const ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }>
  = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/translator", priority: 0.9, changeFrequency: "weekly" },
    { path: "/chart", priority: 0.8, changeFrequency: "weekly" },
    { path: "/learn-practice", priority: 0.7, changeFrequency: "weekly" },
    { path: "/applications-fun", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/about-resources", priority: 0.5, changeFrequency: "monthly" },
    { path: "/community", priority: 0.4, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  ];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const rootEntry: MetadataRoute.Sitemap = [
    {
      url: buildSiteUrl(),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const localizedEntries = locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: buildAbsoluteUrl(locale, route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  );

  return [...rootEntry, ...localizedEntries];
}
