import { useState } from 'react';
import { PencilLine, RotateCcw, Plus, Calculator } from 'lucide-react';

export default function BatakScore() {
  const [players, setPlayers] = useState(['Oyuncu 1', 'Oyuncu 2', 'Oyuncu 3', 'Oyuncu 4']);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(['', '', '', '']);

  const addRound = () => {
    // Check if at least one score is entered
    if (currentRound.every(score => score === '')) return;
    
    // Convert empty strings to 0 for calculation, but keep inputs flexible
    const roundValues = currentRound.map(val => val === '' ? 0 : Number(val));
    setRounds([...rounds, roundValues]);
    setCurrentRound(['', '', '', '']); // Reset inputs
  };

  const updateCurrentRound = (idx, value) => {
    const newRound = [...currentRound];
    newRound[idx] = value;
    setCurrentRound(newRound);
  };

  const updatePlayerName = (idx, value) => {
    const newPlayers = [...players];
    newPlayers[idx] = value;
    setPlayers(newPlayers);
  };

  const calculateTotals = () => {
    const totals = [0, 0, 0, 0];
    rounds.forEach(round => {
      round.forEach((score, idx) => {
        totals[idx] += score;
      });
    });
    return totals;
  };

  const totals = calculateTotals();

  const resetGame = () => {
    if (window.confirm('Tüm tablo temizlenecek. Emin misiniz?')) {
      setRounds([]);
      setCurrentRound(['', '', '', '']);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <PencilLine className="text-indigo-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Batak/King Yazboz</h3>
        </div>
        <button 
          onClick={resetGame}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Temizle"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="overflow-x-auto grow">
        <table className="w-full text-sm text-center">
          <thead>
            <tr>
              {players.map((player, idx) => (
                <th key={idx} className="p-1 pb-3">
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => updatePlayerName(idx, e.target.value)}
                    className="w-full text-center font-bold text-gray-700 bg-gray-50 rounded p-1 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {rounds.map((round, roundIdx) => (
              <tr key={roundIdx} className="border-t border-gray-100 hover:bg-gray-50">
                {round.map((score, scoreIdx) => (
                  <td key={scoreIdx} className="py-2 px-1">
                    {score}
                  </td>
                ))}
              </tr>
            ))}
            
            {/* Input Row */}
            <tr className="border-t-2 border-indigo-100 bg-indigo-50/30">
              {currentRound.map((val, idx) => (
                <td key={idx} className="p-1">
                  <input
                    type="number"
                    value={val}
                    placeholder="0"
                    onChange={(e) => updateCurrentRound(idx, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addRound()}
                    className="w-full p-2 text-center border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </td>
              ))}
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-800">
              {totals.map((total, idx) => (
                <td key={idx} className="pt-3 pb-1 font-black text-lg text-gray-900">
                  {total}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <button
        onClick={addRound}
        className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Turu Ekle
      </button>
    </div>
  );
}
