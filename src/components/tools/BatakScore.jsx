import { useState } from 'react';
import { PencilLine, Plus } from 'lucide-react';
import GameTableContainer from '../common/GameTableContainer';
import { tool } from './toolStyles';
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
      title="Batak & King yazboz"
      subtitle="Her turu yaz; Enter ile hızlı ekle. Dip satır hep toplanır."
      icon={PencilLine}
      onReset={resetGame}
      className="h-full"
    >
      <div className="bg-gradient-to-b from-transparent to-cream-50/40 p-5 sm:p-8">
        <div className="overflow-x-auto rounded-2xl border border-warm-200/70 bg-white/90 shadow-soft">
          <table className="w-full text-center text-sm">
            <thead>
              <tr className="border-b border-orange-100/80 bg-gradient-to-r from-orange-50 via-cream-50 to-amber-50/40">
                {players.map((player, idx) => (
                  <th key={idx} className="p-4 pb-3">
                    <input
                      type="text"
                      value={player}
                      onChange={(e) => updatePlayerName(idx, e.target.value)}
                      className="w-full rounded-xl border-2 border-warm-200/80 bg-white px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-charcoal-800 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 sm:text-[13px] sm:normal-case sm:tracking-normal"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-warm-700">
              {rounds.map((round, roundIdx) => (
                <tr
                  key={roundIdx}
                  className="border-b border-warm-100 bg-white/60 transition-colors odd:bg-cream-50/50 hover:bg-orange-50/25"
                >
                  {round.map((score, scoreIdx) => (
                    <td key={scoreIdx} className="px-3 py-3 font-semibold tabular-nums">
                      {score}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t-2 border-orange-300/70 bg-gradient-to-br from-orange-500/12 via-orange-50/65 to-transparent">
                {currentRound.map((val, idx) => (
                  <td key={idx} className="p-3">
                    <input
                      type="number"
                      value={val}
                      placeholder="0"
                      onChange={(e) => updateCurrentRound(idx, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addRound()}
                      className={tool.tableInput}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-orange-400/70 bg-charcoal-900 text-cream-50">
                {totals.map((total, idx) => (
                  <td key={idx} className="py-4 font-display text-lg font-black tabular-nums sm:text-xl">
                    {total}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <button
          onClick={addRound}
          className={`${tool.primaryBtn} mt-6 rounded-xl`}
        >
          <Plus size={18} />
          Turu Ekle
        </button>
      </div>
    </GameTableContainer>
  );
}
