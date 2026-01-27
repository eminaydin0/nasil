import { useState } from 'react';
import { PencilLine, Plus } from 'lucide-react';
import GameTableContainer from '../common/GameTableContainer';
import { showSuccess } from '../../utils/toast';

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
    setRounds([]);
    setCurrentRound(['', '', '', '']);
    showSuccess('Tablo temizlendi');
  };

  return (
    <GameTableContainer
      title="Batak/King Yazboz"
      icon={PencilLine}
      iconColor="indigo"
      onReset={resetGame}
      className="h-full"
    >
      <div className="p-6">

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="border-b border-gray-200">
                {players.map((player, idx) => (
                  <th key={idx} className="p-3 pb-4">
                    <input
                      type="text"
                      value={player}
                      onChange={(e) => updatePlayerName(idx, e.target.value)}
                      className="w-full text-center font-bold text-gray-700 bg-gray-50 rounded-lg px-3 py-2 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none border border-gray-200"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {rounds.map((round, roundIdx) => (
                <tr key={roundIdx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {round.map((score, scoreIdx) => (
                    <td key={scoreIdx} className="py-3 px-2">
                      {score}
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Input Row */}
              <tr className="border-t-2 border-indigo-200 bg-indigo-50/50">
                {currentRound.map((val, idx) => (
                  <td key={idx} className="p-2">
                    <input
                      type="number"
                      value={val}
                      placeholder="0"
                      onChange={(e) => updateCurrentRound(idx, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addRound()}
                      className="w-full p-2 text-center border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                {totals.map((total, idx) => (
                  <td key={idx} className="py-4 font-black text-lg text-gray-900">
                    {total}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <button
          onClick={addRound}
          className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-sm hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Turu Ekle
        </button>
      </div>
    </GameTableContainer>
  );
}
