import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/metadata";

const SITE_HOST = new URL(SITE_ORIGIN).host;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: [`${SITE_ORIGIN}/sitemap.xml`],
    host: SITE_HOST,
  };
}
