import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://atelix.uz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tailors"],
        // Shaxsiy panel va autentifikatsiya sahifalarini indekslamaymiz
        disallow: ["/dashboard", "/orders", "/tailor", "/measurements", "/auth"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
