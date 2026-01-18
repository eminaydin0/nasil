import { useState } from 'react';
import { Dices, RefreshCw } from 'lucide-react';

export default function DiceRoller() {
  const [result, setResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [numDice, setNumDice] = useState(1);
  const [history, setHistory] = useState([]);

  const rollDice = () => {
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      const newRoll = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
      setResult(newRoll);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setIsRolling(false);
        setHistory(prev => [newRoll, ...prev.slice(0, 4)]);
      }
    }, 80);
  };

  const getDiceDots = (value) => {
    const dotPositions = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
    };
    return dotPositions[value];
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10 blur-3xl"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Dices size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Zar At
          </h2>
          <p className="text-gray-500 text-sm mt-2">Şansını dene ve zarları at!</p>
        </div>

        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 mb-6 min-h-[280px] flex flex-col items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-4 left-4 w-24 h-24 border-2 border-white rounded-lg transform rotate-12"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-white rounded-lg transform -rotate-12"></div>
          </div>
          
          {result ? (
            <>
              <div className="flex gap-6 mb-6 relative z-10">
                {result.map((val, idx) => (
                  <div
                    key={idx}
                    className={`relative w-28 h-28 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-gray-100 transform transition-all duration-300 ${
                      isRolling ? 'animate-bounce scale-110' : 'hover:scale-105'
                    }`}
                    style={{
                      animationDelay: `${idx * 0.1}s`,
                      transform: isRolling ? `rotate(${Math.random() * 360}deg)` : 'rotate(0deg)'
                    }}
                  >
                    <div className="grid grid-cols-3 gap-2 p-4">
                      {getDiceDots(val).map(([row, col], i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-md"
                          style={{
                            gridColumn: col + 1,
                            gridRow: row + 1
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center relative z-10">
                <div className="text-white/60 text-sm mb-1">Toplam</div>
                <div className="text-5xl font-black text-white drop-shadow-lg">
                  {result.reduce((a, b) => a + b, 0)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center relative z-10">
              <div className="w-20 h-20 border-4 border-white/20 border-dashed rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Dices size={40} className="text-white/40" />
              </div>
              <p className="text-white/60 text-lg">Zar atmak için hazır!</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setNumDice(1)}
            disabled={isRolling}
            className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              numDice === 1
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🎲 Tek Zar
          </button>
          <button
            onClick={() => setNumDice(2)}
            disabled={isRolling}
            className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              numDice === 2
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🎲🎲 Çift Zar
          </button>
        </div>

        <button
          onClick={rollDice}
          disabled={isRolling}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-xl font-black text-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          <RefreshCw size={24} className={isRolling ? 'animate-spin' : ''} />
          {isRolling ? 'Zarlar Atılıyor...' : 'Zarları At!'}
        </button>

        {history.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
              Son Atışlar
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {history.map((roll, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg px-4 py-2 border border-gray-200"
                >
                  <div className="flex gap-1 items-center">
                    {roll.map((val, i) => (
                      <div key={i} className="w-8 h-8 bg-white rounded border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
                        {val}
                      </div>
                    ))}
                    <div className="ml-2 text-sm font-bold text-indigo-600">
                      = {roll.reduce((a, b) => a + b, 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
