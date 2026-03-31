// app/robots.ts
import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.makatu.co.za";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/studio/",
          "/quote-success/",
          "/rates/bulk",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
