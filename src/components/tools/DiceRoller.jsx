import { useState } from "react";
import { Dices, RefreshCw, Sparkles } from "lucide-react";
import { tool } from "./toolStyles";

export default function DiceRoller() {
  const [result, setResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [numDice, setNumDice] = useState(1);
  const [history, setHistory] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setShowConfetti(false);
    let counter = 0;
    const interval = setInterval(() => {
      const newRoll = Array.from(
        { length: numDice },
        () => Math.floor(Math.random() * 6) + 1,
      );
      setResult(newRoll);
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        setIsRolling(false);
        setHistory((prev) => [newRoll, ...prev.slice(0, 9)]);

        const total = newRoll.reduce((a, b) => a + b, 0);
        if ((numDice === 1 && total === 6) || (numDice === 2 && total === 12)) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
        }
      }
    }, 60);
  };

  const getDiceDots = (value) => {
    const dotPositions = {
      1: [[1, 1]],
      2: [
        [0, 0],
        [2, 2],
      ],
      3: [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      4: [
        [0, 0],
        [0, 2],
        [2, 0],
        [2, 2],
      ],
      5: [
        [0, 0],
        [0, 2],
        [1, 1],
        [2, 0],
        [2, 2],
      ],
      6: [
        [0, 0],
        [0, 2],
        [1, 0],
        [1, 2],
        [2, 0],
        [2, 2],
      ],
    };
    return dotPositions[value];
  };

  return (
    <div className="relative">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className={`${tool.cardPadded} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-400/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className={tool.headerRow}>
          <div className={tool.iconWrap}>
            <Dices className={tool.iconClass} />
          </div>
          <div>
            <h2 className={tool.title}>Dijital zar</h2>
            <p className="mt-0.5 text-sm text-warm-500">
              Şansını dene ve zarları at!
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 rounded-2xl p-8 sm:p-12 min-h-[280px] flex flex-col items-center justify-center overflow-hidden shadow-inner border border-orange-900/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(249,115,22,0.12),transparent_55%)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />

              {result ? (
                <>
                  <div className="flex gap-4 sm:gap-6 mb-6 relative z-10 flex-wrap justify-center">
                    {result.map((val, idx) => (
                      <div
                        key={idx}
                        className={`relative group ${
                          isRolling ? "animate-roll" : "animate-land"
                        }`}
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity" />
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl flex items-center justify-center border-2 border-orange-100/30 transform transition-all duration-300 hover:scale-105">
                          <div className="grid grid-cols-3 gap-2 p-3 sm:p-4">
                            {getDiceDots(val).map(([row, col], i) => (
                              <div
                                key={i}
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full shadow-md"
                                style={{
                                  gridColumn: col + 1,
                                  gridRow: row + 1,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center relative z-10">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-500" />
                      <span className="text-warm-400 text-xs font-semibold uppercase tracking-wider">
                        Toplam
                      </span>
                      <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-500" />
                    </div>
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full scale-150" />
                      <div className="relative text-5xl sm:text-6xl font-black text-white drop-shadow-lg">
                        {result.reduce((a, b) => a + b, 0)}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-gray-700 border-dashed rounded-2xl flex items-center justify-center mx-auto mb-5 bg-gray-800/40">
                    <Dices size={40} className="text-warm-500" />
                  </div>
                  <p className="text-warm-300 text-base font-medium">
                    Zar atmaya hazır...
                  </p>
                  <p className="mt-2 text-sm text-warm-500">
                    Aşağıdaki düğmeye bas
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setNumDice(1)}
                disabled={isRolling}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 ${
                  numDice === 1
                    ? "border-orange-500 bg-orange-600 text-white shadow-md shadow-orange-900/10"
                    : "border-orange-100 bg-white text-warm-700 hover:bg-orange-50/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  <span className="text-xl" aria-hidden>🎲</span>
                  <span>Tek Zar</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setNumDice(2)}
                disabled={isRolling}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 ${
                  numDice === 2
                    ? "border-orange-500 bg-orange-600 text-white shadow-md shadow-orange-900/10"
                    : "border-orange-100 bg-white text-warm-700 hover:bg-orange-50/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  <span className="text-xl" aria-hidden>🎲🎲</span>
                  <span>Çift Zar</span>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={rollDice}
              disabled={isRolling}
              className={`${tool.primaryBtn} py-4 text-base relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <RefreshCw
                size={22}
                className={
                  isRolling
                    ? "animate-spin"
                    : "transition-transform group-hover:rotate-180"
                }
              />
              <span>{isRolling ? "Zarlar Atılıyor..." : "Zarları At!"}</span>
              {!isRolling && <Sparkles size={18} className="animate-pulse" />}
            </button>
          </div>

          <div className="lg:w-[min(100%,280px)] shrink-0">
            {history.length > 0 ? (
              <div className={`${tool.panel} lg:sticky lg:top-4`}>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-charcoal-900">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  Son Atışlar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {history.slice(0, 6).map((roll, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl px-3 py-2.5 border border-orange-100 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-1">
                          {roll.map((val, i) => (
                            <div
                              key={i}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-100 bg-cream-50 text-xs font-bold text-charcoal-800"
                            >
                              {val}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-warm-400 tabular-nums">=</span>
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-sm font-bold text-white shadow-sm">
                            {roll.reduce((a, b) => a + b, 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`${tool.panel} flex min-h-[120px] items-center justify-center text-center text-sm font-medium text-warm-400 lg:sticky lg:top-4`}
              >
                İlk atıştan sonra geçmiş burada görünür
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes roll {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(0.9); }
          75% { transform: rotate(270deg) scale(1.1); }
        }
        @keyframes land {
          0% { transform: scale(1.2) rotate(10deg); }
          50% { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-roll { animation: roll 0.6s ease-in-out; }
        .animate-land { animation: land 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-confetti { animation: confetti linear forwards; }
      `}</style>
    </div>
  );
}
