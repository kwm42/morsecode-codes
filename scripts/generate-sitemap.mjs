#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const SITE_ORIGIN = "https://morsecode.codes";
const LOCALES = ["en", "zh"];

const ISO_DATE = new Date().toISOString().split("T")[0];

const ROOT_ENTRY = {
  loc: `${SITE_ORIGIN}/`,
  changefreq: "weekly",
  priority: "0.9",
};

const LOCALIZED_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/translator", changefreq: "weekly", priority: "0.9" },
  { path: "/chart", changefreq: "weekly", priority: "0.8" },
  { path: "/learn-practice", changefreq: "weekly", priority: "0.7" },
  { path: "/applications-fun", changefreq: "monthly", priority: "0.6" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/about-resources", changefreq: "monthly", priority: "0.5" },
  { path: "/community", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.4" },
  { path: "/terms", changefreq: "yearly", priority: "0.4" },
];

const buildLocalizedPath = (locale, path) => {
  if (path === "/") {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
};

const buildEntry = (loc, changefreq, priority) => ({
  loc,
  changefreq,
  priority,
});

const entries = [buildEntry(ROOT_ENTRY.loc, ROOT_ENTRY.changefreq, ROOT_ENTRY.priority)];

LOCALES.forEach((locale) => {
  LOCALIZED_ROUTES.forEach((route) => {
    const localizedPath = buildLocalizedPath(locale, route.path);
    entries.push(
      buildEntry(`${SITE_ORIGIN}${localizedPath}`, route.changefreq, route.priority),
    );
  });
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((entry) => {
    return [
      "  <url>",
      `    <loc>${entry.loc}</loc>`,
      `    <lastmod>${ISO_DATE}</lastmod>`,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
      "  </url>",
    ].join("\n");
  }),
  "</urlset>",
  "",
].join("\n");

const outputPath = resolve(process.cwd(), "public", "sitemap.xml");

try {
  await writeFile(outputPath, xml, "utf8");
  console.log(`已生成 sitemap：${outputPath}`);
} catch (error) {
  console.error("生成 sitemap 时出错", error);
  process.exitCode = 1;
}
