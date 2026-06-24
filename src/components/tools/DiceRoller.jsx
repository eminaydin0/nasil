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
        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden rounded-2xl">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 animate-confetti rounded-full bg-gradient-to-br from-amber-300 to-orange-500"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="min-w-0 flex-1 space-y-6">
            <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-warm-200 bg-charcoal-900 p-8 sm:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(249,115,22,0.12),transparent_55%)]" />

              {result ? (
                <>
                  <div className="relative z-10 mb-6 flex flex-wrap justify-center gap-4 sm:gap-6">
                    {result.map((val, idx) => (
                      <div
                        key={idx}
                        className={`relative ${isRolling ? 'animate-roll' : 'animate-land'}`}
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-orange-100/30 bg-gradient-to-br from-white to-cream-50 shadow-xl sm:h-28 sm:w-28">
                          <div className="grid grid-cols-3 gap-2 p-3 sm:p-4">
                            {getDiceDots(val).map(([row, col], i) => (
                              <div
                                key={i}
                                className="h-3.5 w-3.5 rounded-full bg-charcoal-800 shadow-md sm:h-4 sm:w-4"
                                style={{ gridColumn: col + 1, gridRow: row + 1 }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="relative z-10 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-warm-400">
                      Toplam
                    </span>
                    <div className="mt-1 text-5xl font-black text-white sm:text-6xl">
                      {result.reduce((a, b) => a + b, 0)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative z-10 text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-dashed border-warm-600 bg-charcoal-800/40 sm:h-24 sm:w-24">
                    <Dices size={40} className="text-warm-400" />
                  </div>
                  <p className="font-medium text-warm-300">Zar atmaya hazır…</p>
                  <p className="mt-2 text-sm text-warm-500">Aşağıdaki düğmeye bas</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setNumDice(1)}
                disabled={isRolling}
                className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:text-base ${
                  numDice === 1
                    ? 'border-orange-500 bg-orange-600 text-white shadow-md'
                    : 'border-warm-200 bg-white text-warm-700 hover:bg-orange-50'
                }`}
              >
                Tek Zar
              </button>
              <button
                type="button"
                onClick={() => setNumDice(2)}
                disabled={isRolling}
                className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:text-base ${
                  numDice === 2
                    ? 'border-orange-500 bg-orange-600 text-white shadow-md'
                    : 'border-warm-200 bg-white text-warm-700 hover:bg-orange-50'
                }`}
              >
                Çift Zar
              </button>
            </div>

            <button
              type="button"
              onClick={rollDice}
              disabled={isRolling}
              className={`${tool.primaryBtn} relative overflow-hidden py-4 text-base`}
            >
              <RefreshCw size={22} className={isRolling ? 'animate-spin' : ''} />
              <span>{isRolling ? 'Zarlar atılıyor…' : 'Zarları at!'}</span>
              {!isRolling && <Sparkles size={18} className="animate-pulse" />}
            </button>
          </div>

          <div className="shrink-0 lg:w-[min(100%,280px)]">
            {history.length > 0 ? (
              <div className={`${tool.panel} lg:sticky lg:top-4`}>
                <h3 className="mb-4 text-sm font-bold text-warm-900">Son atışlar</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {history.slice(0, 6).map((roll, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-warm-200 bg-cream-50 px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-1">
                          {roll.map((val, i) => (
                            <div
                              key={i}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-warm-200 bg-white text-xs font-bold text-charcoal-800"
                            >
                              {val}
                            </div>
                          ))}
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-sm font-bold text-white">
                          {roll.reduce((a, b) => a + b, 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`${tool.panel} flex min-h-[120px] items-center justify-center text-center text-sm text-warm-500 lg:sticky lg:top-4`}>
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
