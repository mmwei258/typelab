"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { generateWords, LANGUAGES, DEFAULT_LANGUAGE } from "@/lib/word-lists";

// ============================================================
// Types
// ============================================================
interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  duration: number;
}

type TestState = "idle" | "running" | "finished";

// ============================================================
// Constants
// ============================================================
const TEST_DURATIONS = [15, 30, 60, 120];
const DEFAULT_DURATION = 30;
const WORD_COUNT = 80;

// ============================================================
// Utils
// ============================================================
function calculateWpm(correctChars: number, seconds: number): number {
  if (seconds <= 0) return 0;
  return Math.round((correctChars / 5) * (60 / seconds));
}

function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

// ============================================================
// Component
// ============================================================
interface TypingTestProps {
  defaultLang?: string;
}

export default function TypingTest({ defaultLang = DEFAULT_LANGUAGE }: TypingTestProps) {
  const [lang, setLang] = useState<string>(defaultLang);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [testState, setTestState] = useState<TestState>("idle");
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [typedHistory, setTypedHistory] = useState<
    Array<{ word: string; typed: string; correct: boolean }>
  >([]);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION);
  const [result, setResult] = useState<TestResult | null>(null);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [totalIncorrectChars, setTotalIncorrectChars] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [shareText, setShareText] = useState("Copy Result");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize and start test
  const startTest = useCallback((dur?: number) => {
    const d = dur ?? duration;
    setDuration(d);
    const testWords = generateWords(lang, WORD_COUNT);
    setWords(testWords);
    setCurrentWordIndex(0);
    setCurrentInput("");
    setTypedHistory([]);
    setTimeLeft(d);
    setResult(null);
    setTotalCorrectChars(0);
    setTotalIncorrectChars(0);
    setTotalKeystrokes(0);
    setTestState("running");

    setTimeout(() => inputRef.current?.focus(), 50);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
  }, [lang, duration]);

  // Timer finish
  useEffect(() => {
    if (timeLeft === 0 && testState === "running") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTestState("finished");

      const elapsedSeconds = duration;
      const wpm = calculateWpm(totalCorrectChars, elapsedSeconds);
      const rawWpm = calculateWpm(
        totalCorrectChars + totalIncorrectChars,
        elapsedSeconds
      );
      const accuracy = calculateAccuracy(totalCorrectChars, totalKeystrokes);

      setResult({
        wpm,
        rawWpm,
        accuracy,
        correctChars: totalCorrectChars,
        incorrectChars: totalIncorrectChars,
        totalChars: totalKeystrokes,
        duration: elapsedSeconds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const currentWord = words[currentWordIndex];
      if (!currentWord) return;

      if (value.endsWith(" ")) {
        const typed = value.trim();
        const isCorrect = typed === currentWord;

        let correct = 0;
        let incorrect = 0;
        for (let i = 0; i < Math.max(typed.length, currentWord.length); i++) {
          if (i < typed.length && i < currentWord.length) {
            if (typed[i] === currentWord[i]) correct++;
            else incorrect++;
          } else {
            incorrect++;
          }
        }
        setTotalCorrectChars((p) => p + correct);
        setTotalIncorrectChars((p) => p + incorrect);
        setTotalKeystrokes((p) => p + Math.max(typed.length, currentWord.length));

        setTypedHistory((p) => [
          ...p,
          { word: currentWord, typed, correct: isCorrect },
        ]);
        setCurrentWordIndex((p) => p + 1);
        setCurrentInput("");

        if (currentWordIndex >= words.length - 10) {
          setWords((p) => [...p, ...generateWords(lang, 30)]);
        }
      } else {
        setCurrentInput(value);
      }
    },
    [words, currentWordIndex, lang]
  );

  const handleRestart = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTest(duration);
  }, [startTest, duration]);

  const handleShare = async () => {
    if (!result) return;
    const text = `I scored ${result.wpm} WPM with ${result.accuracy}% accuracy!`;
    try {
      await navigator.clipboard.writeText(
        `${text} Try TypeLab: ${window.location.origin}`
      );
      setShareText("Copied!");
      setTimeout(() => setShareText("Copy Result"), 2000);
    } catch {
      setShareText("Failed");
      setTimeout(() => setShareText("Copy Result"), 2000);
    }
  };

  // Keyboard shortcut: press any key to start test (monkeytype UX)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (testState !== "idle") return;
      // Ignore modifier keys, function keys, and UI navigation
      if (e.key === "Tab" || e.key === "Enter" || e.key === "Escape") return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      startTest();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [testState, startTest]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // --- RENDER HELPERS ---

  const renderChars = () => {
    const word = words[currentWordIndex] || "";
    if (testState !== "running") return null;
    return word.split("").map((char, i) => {
      let cls = "text-gray-500";
      if (i < currentInput.length) {
        cls =
          currentInput[i] === char
            ? "text-green-400"
            : "text-red-500 bg-red-500/10";
      } else if (i === currentInput.length) {
        cls = "border-l-2 border-amber-400 animate-pulse";
      }
      return (
        <span key={i} className={cls}>
          {char}
        </span>
      );
    });
  };

  const liveWpm =
    testState === "running"
      ? calculateWpm(totalCorrectChars, duration - timeLeft)
      : 0;

  return (
    <div className="flex flex-col flex-1">
      {/* --- HEADER --- */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <a href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          <span className="text-amber-400">Type</span>Lab
        </a>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            aria-label="Test language"
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              if (testState !== "running") {
                setTestState("idle");
              }
            }}
            className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-1.5 border border-gray-700 focus:border-amber-400 outline-none"
            disabled={testState === "running"}
          >
            {Object.entries(LANGUAGES).map(([code, info]) => (
              <option key={code} value={code}>
                {info.nativeName}
              </option>
            ))}
          </select>
          <div className="flex bg-gray-800 rounded-lg p-0.5 border border-gray-700">
            {TEST_DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDuration(d);
                  setTimeLeft(d);
                }}
                disabled={testState === "running"}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  duration === d
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-gray-400 hover:text-gray-200"
                } ${testState === "running" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Running stats */}
        {testState === "running" && (
          <div className="flex gap-10 mb-14 text-center">
            <div>
              <div className="text-5xl font-mono font-bold text-amber-400">
                {timeLeft}
              </div>
              <div className="text-xs text-gray-500 mt-1">seconds</div>
            </div>
            <div>
              <div className="text-5xl font-mono font-bold text-green-400">
                {liveWpm}
              </div>
              <div className="text-xs text-gray-500 mt-1">wpm</div>
            </div>
          </div>
        )}

        {/* Idle */}
        {testState === "idle" && (
          <div className="text-center mb-14">
            <div className="text-8xl mb-6">⌨️</div>
            <p className="text-gray-400 text-lg mb-8">
              Start typing to test your speed
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {TEST_DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => startTest(d)}
                  className="px-8 py-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-colors font-medium"
                >
                  {d} sec test
                </button>
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-6">
              or press any key to start
            </p>
          </div>
        )}

        {/* Typing area */}
        {testState === "running" && (
          <div
            className="max-w-2xl w-full cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="font-mono text-2xl md:text-3xl leading-relaxed select-none">
              <span className="opacity-30">
                {typedHistory.slice(-6).map((e, idx) => (
                  <span
                    key={idx}
                    className={
                      e.correct
                        ? "text-gray-500"
                        : "text-red-500/60 line-through"
                    }
                  >
                    {e.word}{" "}
                  </span>
                ))}
              </span>
              <span className="text-white">{renderChars()}</span>{" "}
              <span className="opacity-15">
                {words
                  .slice(currentWordIndex + 1, currentWordIndex + 15)
                  .join(" ")}
              </span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInput}
              className="absolute opacity-0 w-0 h-0"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Type here"
            />
            <div className="text-center mt-10 text-gray-500 text-xs">
              <kbd className="px-2 py-0.5 bg-gray-800 rounded">tab</kbd> +{" "}
              <kbd className="px-2 py-0.5 bg-gray-800 rounded">enter</kbd>{" "}
              restart
            </div>
          </div>
        )}

        {/* Result */}
        {testState === "finished" && result && (
          <div className="text-center max-w-md">
            <div className="text-6xl font-mono font-bold text-amber-400 mb-2">
              {result.wpm}
              <span className="text-lg text-gray-500 ml-2">WPM</span>
            </div>
            <div className="flex gap-6 justify-center mb-8 text-sm">
              <div>
                <span className="text-gray-500">accuracy </span>
                <span
                  className={
                    result.accuracy >= 95 ? "text-green-400" : "text-amber-400"
                  }
                >
                  {result.accuracy}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">raw </span>
                <span className="text-gray-300">{result.rawWpm} wpm</span>
              </div>
              <div>
                <span className="text-gray-500">chars </span>
                <span className="text-gray-300">
                  {result.correctChars}/{result.totalChars}
                </span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleShare}
                className="px-5 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
              >
                {shareText}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
