import { useState } from 'react';
import { Trophy, Save } from 'lucide-react';
import GameTableContainer from '../common/GameTableContainer';
import { tool } from './toolStyles';
import { useConfirm } from '../ui';

export default function OkeyScore() {
  const confirm = useConfirm();
  const [players, setPlayers] = useState(['Oyuncu 1', 'Oyuncu 2', 'Oyuncu 3', 'Oyuncu 4']);
  const [scores, setScores] = useState([20, 20, 20, 20]);
  const [winner, setWinner] = useState(0);
  const [winType, setWinType] = useState('normal');
  const [startScore, setStartScore] = useState(20);

  const resetGame = async () => {
    const ok = await confirm({
      title: 'Yeni oyun',
      description: 'Puankartı sıfırlanır ve başlangıç puana göre sıfırlanır.',
      confirmText: 'Baştan Başlat',
      cancelText: 'Vazgeç',
      type: 'warning',
    });
    if (!ok) return;
    setScores([startScore, startScore, startScore, startScore]);
  };

  const applyRound = () => {
    const penalty = winType === 'normal' ? 2 : 4;
    setScores((prevScores) =>
      prevScores.map((score, index) =>
        index === winner ? score : score - penalty
      )
    );
  };

  const updateName = (index, value) => {
    const next = [...players];
    next[index] = value;
    setPlayers(next);
  };

  return (
    <GameTableContainer
      title="Okey Sayacı"
      subtitle="Düşmeli okey — el kazananı seç, bitiş türünü işaretle."
      icon={Trophy}
      onReset={resetGame}
      className="h-full"
    >
      <div className="space-y-8 p-5 sm:p-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {players.map((player, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-b p-4 text-center transition-colors ${
                scores[idx] <= 0
                  ? 'border-orange-400/80 from-orange-50 to-amber-50/80 shadow-warm-glow'
                  : 'border-warm-200/70 from-white to-cream-50/70 hover:border-warm-300'
              }`}
            >
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-orange-400/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
              <input
                type="text"
                value={player}
                onChange={(e) => updateName(idx, e.target.value)}
                className="relative mb-3 w-full rounded-xl border border-warm-200/80 bg-white/95 px-2 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-warm-600 outline-none ring-2 ring-transparent transition-all focus:border-orange-400 focus:text-charcoal-900 focus:ring-orange-500/15"
              />
              <div
                className={`font-display relative text-[2rem] font-black leading-none tracking-tighter sm:text-4xl ${scores[idx] <= 0 ? 'text-orange-700' : 'text-charcoal-900'}`}
              >
                {scores[idx]}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <span className={tool.label}>Eli kim kazandı?</span>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {players.map((player, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setWinner(idx)}
                  className={`truncate rounded-xl border-2 px-3 py-3 text-xs font-bold transition-all sm:text-sm ${winner === idx ? `${tool.toggleOn}` : `${tool.toggleOff}`}`}
                >
                  {player}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className={tool.label}>Bitiş türü</span>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setWinType('normal')}
                className={`flex-1 rounded-xl border-2 py-3 text-xs font-bold sm:text-sm ${winType === 'normal' ? `${tool.toggleOn}` : `${tool.toggleOff}`}`}
              >
                Normal (-2)
              </button>
              <button
                type="button"
                onClick={() => setWinType('cift')}
                className={`flex-1 rounded-xl border-2 py-3 text-xs font-bold sm:text-sm ${winType === 'cift' ? `${tool.toggleOn}` : `${tool.toggleOff}`}`}
              >
                Okey/Çift (-4)
              </button>
            </div>
          </div>

          <button type="button" onClick={applyRound} className={tool.primaryBtn}>
            <Save size={18} aria-hidden />
            Puanları işle
          </button>

          <div className="flex flex-wrap items-center gap-4 border-t border-warm-200/70 pt-6">
            <span className="text-xs font-bold uppercase tracking-wide text-warm-500">
              Başlangıç puanı
            </span>
            <input
              type="number"
              value={startScore}
              onChange={(e) => setStartScore(Number(e.target.value))}
              className={`${tool.input} w-28 text-center font-bold`}
              min={0}
            />
          </div>
        </div>
      </div>
    </GameTableContainer>
  );
}
