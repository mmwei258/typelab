import TypingTest from "@/components/TypingTest";

const FAQS = [
  {
    q: "What is a good WPM typing speed?",
    a: "Average is 40 WPM. Above 60 is considered good, 80+ is excellent, and 100+ puts you in the top 1% of typists.",
  },
  {
    q: "How is WPM calculated?",
    a: "WPM = (total correct characters ÷ 5) × (60 ÷ seconds). Every 5 characters count as one word — this is the industry standard.",
  },
  {
    q: "How can I improve my typing speed?",
    a: "Practice daily for 10-15 minutes. Focus on accuracy first — speed follows naturally. Learn touch typing with all ten fingers.",
  },
  {
    q: "What languages does TypeLab support?",
    a: "English, Hindi (हिन्दी), Indonesian (Bahasa Indonesia), Tagalog, and Spanish. More languages are on the way.",
  },
  {
    q: "Is this typing test really free?",
    a: "Yes — no registration, no fees, no watermarks. Just a clean typing test that works on desktop and mobile.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111] text-gray-200 flex flex-col">
      <TypingTest defaultLang="en" />

      {/* SEO / FAQ */}
      <footer className="border-t border-gray-800 px-6 py-16 max-w-3xl mx-auto w-full">
        <section className="space-y-5 text-gray-400 text-sm leading-relaxed">
          <h2 className="text-white text-lg font-semibold">
            Free Online Typing Speed Test — Check Your WPM
          </h2>
          <p>
            TypeLab is a free, minimal typing test that measures your typing
            speed in WPM (words per minute). Choose your language, select a test
            duration, and start typing. No sign-up required.
          </p>

          <h3 className="text-gray-300 font-medium mt-8">
            Frequently Asked Questions
          </h3>

          {FAQS.map((faq) => (
            <div key={faq.q}>
              <h4 className="text-gray-200 font-medium">{faq.q}</h4>
              <p className="text-gray-500">{faq.a}</p>
            </div>
          ))}

          <div className="mt-10 pt-8 border-t border-gray-800 text-center text-gray-700 text-xs">
            TypeLab © {new Date().getFullYear()} ·
            <a href="/privacy" className="hover:text-gray-400 mx-1">
              Privacy
            </a>
            ·
            <a href="/terms" className="hover:text-gray-400 mx-1">
              Terms
            </a>
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
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
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
