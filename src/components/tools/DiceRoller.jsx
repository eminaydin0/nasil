import { useState } from "react";
import { Dices, RefreshCw, Sparkles } from "lucide-react";

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
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-confetti"
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

      <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl p-8 border border-slate-200/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform">
              <Dices size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Dijital Zar
            </h2>
            <p className="text-slate-500">Şansını dene ve zarları at!</p>
          </div>
          <div
            className="flex"
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <div
              className="left"
              style={{
                width: "60%",
                                padding:'10px'

              }}
            >
              <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-12 mb-6 min-h-[320px] flex flex-col items-center justify-center overflow-hidden shadow-inner">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="absolute inset-0 opacity-[0.02]">
                  <div className="absolute top-6 left-6 w-20 h-20 border-2 border-white rounded-xl transform rotate-12"></div>
                  <div className="absolute bottom-6 right-6 w-24 h-24 border-2 border-white rounded-xl transform -rotate-12"></div>
                  <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-lg transform rotate-45"></div>
                </div>

                {result ? (
                  <>
                    <div className="flex gap-6 mb-8 relative z-10">
                      {result.map((val, idx) => (
                        <div
                          key={idx}
                          className={`relative group ${
                            isRolling ? "animate-roll" : "animate-land"
                          }`}
                          style={{
                            animationDelay: `${idx * 0.1}s`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                          <div className="relative w-28 h-28 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl flex items-center justify-center border-2 border-slate-200 transform transition-all duration-300 hover:scale-105 hover:-rotate-6">
                            <div className="grid grid-cols-3 gap-2.5 p-4">
                              {getDiceDots(val).map(([row, col], i) => (
                                <div
                                  key={i}
                                  className="w-4 h-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full shadow-lg"
                                  style={{
                                    gridColumn: col + 1,
                                    gridRow: row + 1,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center relative z-10">
                      <div className="inline-flex items-center gap-2 mb-2">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-slate-400"></div>
                        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                          Toplam
                        </span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-slate-400"></div>
                      </div>
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 blur-2xl opacity-30"></div>
                        <div className="relative text-6xl font-bold text-white drop-shadow-2xl">
                          {result.reduce((a, b) => a + b, 0)}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center relative z-10">
                    <div className="w-24 h-24 border-4 border-slate-700 border-dashed rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm bg-slate-800/30">
                      <Dices size={48} className="text-slate-600" />
                    </div>
                    <p className="text-slate-400 text-lg font-medium">
                      Zar atmak için hazır!
                    </p>
                    <p className="text-slate-600 text-sm mt-2">
                      Aşağıdaki butona tıklayın
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setNumDice(1)}
                  disabled={isRolling}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                    numDice === 1
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/30"
                      : "bg-white text-slate-700 hover:bg-slate-50 shadow-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🎲</span>
                    <span>Tek Zar</span>
                  </div>
                </button>
                <button
                  onClick={() => setNumDice(2)}
                  disabled={isRolling}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                    numDice === 2
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/30"
                      : "bg-white text-slate-700 hover:bg-slate-50 shadow-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🎲🎲</span>
                    <span>Çift Zar</span>
                  </div>
                </button>
              </div>

              <button
                onClick={rollDice}
                disabled={isRolling}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 text-white py-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <RefreshCw
                  size={24}
                  className={
                    isRolling
                      ? "animate-spin"
                      : "transition-transform group-hover:rotate-180"
                  }
                />
                <span>{isRolling ? "Zarlar Atılıyor..." : "Zarları At!"}</span>
                {!isRolling && <Sparkles size={20} className="animate-pulse" />}
              </button>
            </div>
            <div
              className="right"
              style={{
                width: "40%",
                padding:'10px'
              }}
            >
              {history.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                    Son Atışlar
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {history.slice(0, 6).map((roll, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-white to-slate-50 rounded-xl px-4 py-3 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:scale-105"
                      >
                        <div className="flex gap-2 items-center justify-between">
                          <div className="flex gap-1.5">
                            {roll.map((val, i) => (
                              <div
                                key={i}
                                className="w-9 h-9 bg-white rounded-lg border-2 border-slate-300 flex items-center justify-center text-sm font-bold text-slate-800 shadow-sm"
                              >
                                {val}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">=</span>
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/30">
                              {roll.reduce((a, b) => a + b, 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-roll {
          animation: roll 0.6s ease-in-out;
        }

        .animate-land {
          animation: land 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}
