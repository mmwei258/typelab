import type { Metadata } from "next";
import { LANGUAGES } from "./word-lists";

export const SUPPORTED_LANGS = Object.keys(LANGUAGES); // ["en","hi","id","tl","es"]

const SEO: Record<string, { title: string; desc: string; keywords: string; ogTitle: string; ogDesc: string }> = {
  en: {
    title: "Free Online Typing Test — Check Your WPM Speed | TypeLab",
    desc: "Test your typing speed in multiple languages. Free, no sign-up. English, Hindi, Indonesian, Tagalog, Spanish. Check your WPM now.",
    keywords: "typing test, typing speed test, WPM test, free typing test, online typing, English typing test, typing practice",
    ogTitle: "TypeLab — Free Online Typing Test",
    ogDesc: "Check your WPM speed. English, Hindi, Indonesian & more.",
  },
  hi: {
    title: "मुफ़्त ऑनलाइन टाइपिंग टेस्ट — WPM स्पीड जांचें | TypeLab",
    desc: "हिंदी में टाइपिंग स्पीड टेस्ट करें। मुफ़्त, कोई साइन-अप नहीं। WPM और सटीकता जांचें।",
    keywords: "हिंदी टाइपिंग टेस्ट, Hindi typing test, WPM test, free typing, टाइपिंग स्पीड",
    ogTitle: "TypeLab — हिंदी टाइपिंग टेस्ट",
    ogDesc: "हिंदी में मुफ़्त टाइपिंग स्पीड टेस्ट। WPM और सटीकता जांचें।",
  },
  id: {
    title: "Tes Mengetik Online Gratis — Cek Kecepatan WPM | TypeLab",
    desc: "Tes kecepatan mengetik online gratis dalam Bahasa Indonesia. Tanpa daftar. Cek WPM dan akurasi Anda sekarang.",
    keywords: "tes mengetik, tes kecepatan mengetik, WPM test, typing test Indonesia, latihan mengetik online",
    ogTitle: "TypeLab — Tes Mengetik Online Gratis",
    ogDesc: "Cek kecepatan mengetik WPM Anda. Gratis, tanpa daftar.",
  },
  tl: {
    title: "Libreng Online Typing Test — Suriin ang WPM Speed | TypeLab",
    desc: "Subukan ang iyong bilis sa pagta-type sa Tagalog. Libre, walang sign-up. Suriin ang WPM at accuracy ngayon.",
    keywords: "typing test Tagalog, Filipino typing test, WPM test, libreng typing, pagta-type online",
    ogTitle: "TypeLab — Tagalog Typing Test",
    ogDesc: "Libreng online typing test sa Tagalog. Suriin ang iyong WPM.",
  },
  es: {
    title: "Test de Velocidad de Escritura Online Gratis | TypeLab",
    desc: "Prueba tu velocidad de escritura en español y otros idiomas. Gratis, sin registro. Mide tu WPM ahora.",
    keywords: "test de velocidad, escritura, WPM test, typing test español, mecanografía online gratis",
    ogTitle: "TypeLab — Test de Velocidad de Escritura",
    ogDesc: "Prueba tu velocidad de escritura. Gratis, sin registro.",
  },
};

export function getMetadata(lang: string, path: string): Metadata {
  const seo = SEO[lang] ?? SEO.en;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://typelab.co";

  const alternates: Record<string, string> = {};
  for (const l of SUPPORTED_LANGS) {
    alternates[l] = l === "en" ? `${baseUrl}${path || "/"}` : `${baseUrl}/${l}${path || "/"}`;
  }

  return {
    title: seo.title,
    description: seo.desc,
    keywords: seo.keywords,
    alternates: {
      canonical: lang === "en" ? `${baseUrl}${path || "/"}` : `${baseUrl}/${lang}${path || "/"}`,
      languages: alternates,
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDesc,
      type: "website",
      locale: lang === "en" ? "en_US" : `${lang}_${lang.toUpperCase()}`,
    },
  };
}
