import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TypingTest from "@/components/TypingTest";
import { getMetadata, SUPPORTED_LANGS } from "@/lib/metadata";
import { LANGUAGES } from "@/lib/word-lists";

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!SUPPORTED_LANGS.includes(lang)) return {};
  return getMetadata(lang, "/");
}

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!SUPPORTED_LANGS.includes(lang)) notFound();

  const info = LANGUAGES[lang];
  const faqs = [
    {
      q: lang === "en" ? "What is a good WPM typing speed?"
        : lang === "hi" ? "एक अच्छी WPM टाइपिंग स्पीड क्या है?"
        : lang === "id" ? "Berapa kecepatan mengetik WPM yang baik?"
        : lang === "tl" ? "Ano ang magandang WPM typing speed?"
        : "¿Qué es una buena velocidad de escritura WPM?",
      a: lang === "en" ? "Average is 40 WPM. Above 60 is good, 80+ is excellent, 100+ is top 1%."
        : lang === "hi" ? "औसत 40 WPM है। 60 से ऊपर अच्छा, 80+ उत्कृष्ट, 100+ शीर्ष 1% है।"
        : lang === "id" ? "Rata-rata 40 WPM. Di atas 60 bagus, 80+ luar biasa, 100+ top 1%."
        : lang === "tl" ? "Average ay 40 WPM. Above 60 ay magaling, 80+ mahusay, 100+ top 1%."
        : "La media es 40 WPM. +60 es bueno, 80+ excelente, 100+ es top 1%.",
    },
    {
      q: lang === "en" ? "How is WPM calculated?"
        : lang === "hi" ? "WPM की गणना कैसे की जाती है?"
        : lang === "id" ? "Bagaimana cara menghitung WPM?"
        : lang === "tl" ? "Paano kinakalkula ang WPM?"
        : "¿Cómo se calcula el WPM?",
      a: lang === "en" ? "WPM = (correct characters ÷ 5) × (60 ÷ seconds). Every 5 characters = 1 word."
        : lang === "hi" ? "WPM = (सही अक्षर ÷ 5) × (60 ÷ सेकंड)। हर 5 अक्षर = 1 शब्द।"
        : lang === "id" ? "WPM = (karakter benar ÷ 5) × (60 ÷ detik). Setiap 5 karakter = 1 kata."
        : lang === "tl" ? "WPM = (tamang karakter ÷ 5) × (60 ÷ segundo). Bawat 5 karakter = 1 salita."
        : "WPM = (caracteres correctos ÷ 5) × (60 ÷ segundos). 5 caracteres = 1 palabra.",
    },
    {
      q: lang === "en" ? "How to improve typing speed?"
        : lang === "hi" ? "टाइपिंग स्पीड कैसे सुधारें?"
        : lang === "id" ? "Bagaimana meningkatkan kecepatan mengetik?"
        : lang === "tl" ? "Paano pagbutihin ang bilis ng pag-type?"
        : "¿Cómo mejorar la velocidad de escritura?",
      a: lang === "en" ? "Practice 10-15 min daily. Focus on accuracy first. Learn touch typing with all ten fingers."
        : lang === "hi" ? "रोज़ 10-15 मिनट अभ्यास करें। पहले सटीकता पर ध्यान दें। सभी दस उंगलियों से टच टाइपिंग सीखें।"
        : lang === "id" ? "Latihan 10-15 menit setiap hari. Fokus pada akurasi dulu. Belajar mengetik sentuh dengan sepuluh jari."
        : lang === "tl" ? "Magsanay 10-15 minuto araw-araw. Unahin ang accuracy. Matutong touch typing gamit ang lahat ng daliri."
        : "Practica 10-15 min al día. Enfócate en la precisión primero. Aprende mecanografía con los diez dedos.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 flex flex-col">
      <TypingTest defaultLang={lang} />

      {/* SEO content */}
      <footer className="border-t border-gray-800 px-6 py-16 max-w-3xl mx-auto w-full">
        <section className="space-y-5 text-gray-300 text-sm leading-relaxed">
          <h2 className="text-white text-lg font-semibold">
            {lang === "hi" ? `${info.nativeName} में मुफ़्त टाइपिंग टेस्ट`
              : lang === "id" ? `Tes Mengetik ${info.nativeName} Online Gratis`
              : lang === "tl" ? `Libreng ${info.nativeName} Typing Test Online`
              : lang === "es" ? `Test de Velocidad en ${info.nativeName} Gratis`
              : `Free Online Typing Speed Test — Check Your WPM`}
          </h2>
          <p>
            {lang === "hi" ? `${info.nativeName} में टाइपिंग स्पीड टेस्ट करें। मुफ़्त, कोई साइन-अप नहीं। अपना WPM और सटीकता जांचें।`
              : lang === "id" ? `Tes kecepatan mengetik online gratis dalam ${info.nativeName}. Tanpa daftar. Cek WPM dan akurasi Anda sekarang.`
              : lang === "tl" ? `Subukan ang iyong bilis sa pag-type sa ${info.nativeName}. Libre, walang sign-up. Suriin ang iyong WPM ngayon.`
              : lang === "es" ? `Prueba tu velocidad de escritura en ${info.nativeName}. Gratis, sin registro. Mide tu WPM y precisión ahora.`
              : `TypeLab is a free, minimal typing test that measures your typing speed in WPM. Choose your language, select a duration, and start typing. No sign-up.`}
          </p>

          <h3 className="text-gray-300 font-medium mt-8">
            {lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न"
              : lang === "id" ? "Pertanyaan Umum"
              : lang === "tl" ? "Mga Madalas Itanong"
              : lang === "es" ? "Preguntas Frecuentes"
              : "Frequently Asked Questions"}
          </h3>

          {faqs.map((faq) => (
            <div key={faq.q}>
              <h4 className="text-gray-200 font-medium">{faq.q}</h4>
              <p className="text-gray-300">{faq.a}</p>
            </div>
          ))}

          <div className="mt-10 pt-8 border-t border-gray-800 text-center text-gray-400 text-xs">
            TypeLab © {new Date().getFullYear()} ·
            <a href="/privacy" className="hover:text-gray-400 mx-1">Privacy</a>
            ·
            <a href="/terms" className="hover:text-gray-400 mx-1">Terms</a>
          </div>
        </section>
      </footer>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question" as const,
              name: f.q,
              acceptedAnswer: { "@type": "Answer" as const, text: f.a },
            })),
          }),
        }}
      />

      {/* Ad placeholder */}
      <div className="max-w-3xl mx-auto w-full px-6 pb-8">
        <div className="h-24 bg-gray-800/30 border border-gray-800 rounded-lg flex items-center justify-center text-gray-600 text-sm">
          Ad — 广告位
        </div>
      </div>
    </div>
  );
}
