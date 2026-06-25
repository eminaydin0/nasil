import { useState } from 'react';
import { Users, Plus, Minus, Medal } from 'lucide-react';
import GameTableContainer from '../common/GameTableContainer';
import { useConfirm } from '../ui';

export default function ScoreBoard() {
  const confirm = useConfirm();
  const [players, setPlayers] = useState([
    { id: 1, name: 'Oyuncu 1', score: 0 },
    { id: 2, name: 'Oyuncu 2', score: 0 },
  ]);

  const updateScore = (id, delta) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, score: Math.max(-999999, p.score + delta) } : p
      )
    );
  };

  const addPlayer = () => {
    const newId = Math.max(...players.map((p) => p.id), 0) + 1;
    setPlayers([...players, { id: newId, name: `Oyuncu ${newId}`, score: 0 }]);
  };

  const resetScores = async () => {
    const ok = await confirm({
      type: 'warning',
      title: 'Skorları sıfırla?',
      description: 'Tüm oyuncuların puanı sıfırlanır. İsimler korunur.',
      confirmText: 'Sıfırla',
      cancelText: 'Vazgeç',
    });
    if (!ok) return;
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
  };

  const updateName = (id, name) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const podiumStyle = (rank) => {
    if (rank === 0)
      return 'border-amber-400/70 bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-transparent shadow-soft-md ring-2 ring-amber-400/30';
    if (rank === 1)
      return 'border-warm-300/70 bg-gradient-to-r from-warm-100/80 via-cream-50/70 to-transparent';
    if (rank === 2)
      return 'border-orange-400/35 bg-gradient-to-r from-orange-50/55 to-transparent';
    return 'border-warm-200/70 bg-white/95';
  };

  const rankBadge = (rank) =>
    ({
      0: { emoji: '🥇', color: 'text-amber-600' },
      1: { emoji: '🥈', color: 'text-warm-500' },
      2: { emoji: '🥉', color: 'text-orange-600' },
    }[rank] || null);

  return (
    <GameTableContainer onReset={resetScores}>
      <div className="min-w-0 space-y-3 overflow-x-clip p-4 sm:space-y-4 sm:p-8">
        {sortedPlayers.map((player, index) => {
          const podium = podiumStyle(index);
          const badge = rankBadge(index);
          return (
            <div
              key={player.id}
              className={`group flex flex-wrap items-center gap-4 rounded-[1.25rem] border-2 px-4 py-4 shadow-soft transition-colors hover:bg-cream-50/70 sm:flex-nowrap sm:px-5 ${podium}`}
            >
              <div className="flex w-full shrink-0 items-center gap-4 sm:w-auto">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-lg font-black text-orange-700 ring-2 ring-orange-400/35">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1 sm:flex-initial sm:max-w-[14rem]">
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updateName(player.id, e.target.value)}
                    className="w-full truncate bg-transparent py-1 text-sm font-bold text-charcoal-900 outline-none ring-2 ring-transparent focus:ring-orange-400/35 sm:text-[15px]"
                  />
                  {badge && (
                    <span className={`mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide ${badge.color}`}>
                      <Medal className="h-3 w-3" aria-hidden /> {badge.emoji} sıra {index + 1}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => updateScore(player.id, -1)}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-warm-200 bg-white text-charcoal-800 shadow-soft transition-all hover:bg-warm-100 active:scale-95"
                  aria-label="Bir eksilt"
                >
                  <Minus size={17} aria-hidden />
                </button>
                <div className="min-w-[3.25rem] text-center font-display text-2xl font-black tracking-tighter text-charcoal-900 tabular-nums">
                  {player.score}
                </div>
                <button
                  type="button"
                  onClick={() => updateScore(player.id, 1)}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-warm-200 bg-white text-charcoal-800 shadow-soft transition-all hover:bg-orange-50 hover:border-orange-300 active:scale-95"
                  aria-label="Bir artır"
                >
                  <Plus size={17} aria-hidden />
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addPlayer}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-warm-300 py-4 text-sm font-bold text-warm-700 transition-colors hover:border-orange-400 hover:bg-orange-50/70"
        >
          <Users size={19} aria-hidden />
          Oyuncu ekle
        </button>
      </div>
    </GameTableContainer>
  );
}
