import type { MetadataRoute } from "next";

const BASE = "https://typelab.co"; // 最终域名, 先指向 vercel.app
// TODO: 买域名后改为 https://typelab.co

const LANGS = ["en", "hi", "id", "tl", "es"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          LANGS.map((l) => [l, l === "en" ? `${BASE}/` : `${BASE}/${l}/`])
        ),
      },
    },
  ];

  for (const lang of LANGS) {
    entries.push({
      url: lang === "en" ? BASE : `${BASE}/${lang}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: lang === "en" ? 0.9 : 0.8,
    });
  }

  return entries;
}
