import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://atelix.uz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`,          lastModified: now, changeFrequency: "weekly",  priority: 1 },
    { url: `${SITE_URL}/tailors`,   lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/auth/register`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/auth/login`,    lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
