import { useState } from 'react';
import { Dices, RefreshCw } from 'lucide-react';

export default function DiceRoller() {
  const [result, setResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [numDice, setNumDice] = useState(1);

  const rollDice = () => {
    setIsRolling(true);
    
    // Animation effect
    let counter = 0;
    const interval = setInterval(() => {
      setResult(Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1));
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 100);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 rounded-xl">
          <Dices className="text-orange-600 w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Zar At</h3>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex gap-4 min-h-[100px] items-center justify-center">
          {result ? (
            result.map((val, idx) => (
              <div 
                key={idx}
                className={`w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg transform transition-all ${isRolling ? 'scale-90 rotate-12' : 'scale-100 rotate-0'}`}
              >
                {val}
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-lg">Zar atmak için butona basın</div>
          )}
        </div>

        <div className="flex flex-col w-full gap-4">
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => setNumDice(1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${numDice === 1 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              1 Zar
            </button>
            <button 
              onClick={() => setNumDice(2)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${numDice === 2 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              2 Zar
            </button>
          </div>

          <button
            onClick={rollDice}
            disabled={isRolling}
            className="w-full py-3 bg-linear-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            {isRolling ? 'Zarlar Atılıyor...' : 'Zar At'}
          </button>
        </div>
      </div>
    </div>
  );
}
