import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-9C7QN176VE";
const GSC_VERIFICATION = ""; // 手动填入 GSC 验证码

export const metadata: Metadata = {
  title: "Free Online Typing Test — Check Your WPM Speed | TypeLab",
  description:
    "Test your typing speed in multiple languages. Free, no sign-up. English, Hindi, Indonesian, Tagalog, Spanish. Check your WPM now.",
  keywords:
    "typing test, typing speed test, WPM test, free typing test, online typing, typing practice, Hindi typing test, English typing test",
  verification: {
    google: GSC_VERIFICATION || undefined,
  },
  alternates: {
    canonical: "https://typelab.co/",
    languages: {
      en: "https://typelab.co/",
      hi: "https://typelab.co/hi/",
      id: "https://typelab.co/id/",
      tl: "https://typelab.co/tl/",
      es: "https://typelab.co/es/",
    },
  },
  openGraph: {
    title: "TypeLab — Free Online Typing Test",
    description:
      "Check your WPM in English, Hindi, Indonesian, Tagalog & Spanish.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="alternate" hrefLang="en" href="https://typelab.co/" />
        <link rel="alternate" hrefLang="hi" href="https://typelab.co/hi/" />
        <link rel="alternate" hrefLang="id" href="https://typelab.co/id/" />
        <link rel="alternate" hrefLang="tl" href="https://typelab.co/tl/" />
        <link rel="alternate" hrefLang="es" href="https://typelab.co/es/" />
        <link rel="alternate" hrefLang="x-default" href="https://typelab.co/" />
      </head>
      <body className="min-h-full bg-[#111] text-gray-200 antialiased">
        {children}
      </body>
      {/* Google Analytics (GA4) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_location: window.location.href,
            page_title: document.title,
          });
        `}
      </Script>
    </html>
  );
}
