import { useState } from 'react';
import { Users, Plus, Minus, Trophy } from 'lucide-react';
import GameTableContainer from '../common/GameTableContainer';

export default function ScoreBoard() {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Oyuncu 1', score: 0 },
    { id: 2, name: 'Oyuncu 2', score: 0 }
  ]);

  const updateScore = (id, delta) => {
    setPlayers(players.map(p => 
      p.id === id ? { ...p, score: p.score + delta } : p
    ));
  };

  const addPlayer = () => {
    const newId = Math.max(...players.map(p => p.id)) + 1;
    setPlayers([...players, { id: newId, name: `Oyuncu ${newId}`, score: 0 }]);
  };

  const resetScores = () => {
    if (window.confirm('Tüm skorlar sıfırlansın mı?')) {
      setPlayers(players.map(p => ({ ...p, score: 0 })));
    }
  };

  const updateName = (id, name) => {
    setPlayers(players.map(p => 
      p.id === id ? { ...p, name } : p
    ));
  };

  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <GameTableContainer
      title="Skor Tablosu"
      icon={Trophy}
      onReset={resetScores}
      className="h-full"
    >
      <div className="p-6">

        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-orange-100 hover:bg-orange-50/40 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-orange-100 text-sm font-bold text-orange-700">
                {index + 1}
              </div>
              <div className="grow">
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updateName(player.id, e.target.value)}
                  className="bg-transparent font-medium text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-orange-500/30 rounded-lg px-2 py-1"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateScore(player.id, -1)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-orange-100 rounded-lg text-gray-600 hover:bg-orange-50 active:scale-95 transition-all"
                >
                  <Minus size={16} />
                </button>
                <div className="w-14 text-center font-bold text-xl text-gray-900">
                  {player.score}
                </div>
                <button 
                  onClick={() => updateScore(player.id, 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-orange-100 rounded-lg text-gray-600 hover:bg-orange-50 active:scale-95 transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addPlayer}
            className="w-full py-3 border-2 border-dashed border-orange-200 text-orange-700/80 rounded-xl font-medium hover:border-orange-400 hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
          >
            <Users size={18} />
            Oyuncu Ekle
          </button>
        </div>
      </div>
    </GameTableContainer>
  );
}
