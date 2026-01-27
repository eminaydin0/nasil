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
      iconColor="blue"
      onReset={resetScores}
      className="h-full"
    >
      <div className="p-6">

        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-sm font-bold text-gray-600">
                {index + 1}
              </div>
              <div className="grow">
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updateName(player.id, e.target.value)}
                  className="bg-transparent font-medium text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateScore(player.id, -1)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
                >
                  <Minus size={16} />
                </button>
                <div className="w-14 text-center font-bold text-xl text-gray-900">
                  {player.score}
                </div>
                <button 
                  onClick={() => updateScore(player.id, 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addPlayer}
            className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <Users size={18} />
            Oyuncu Ekle
          </button>
        </div>
      </div>
    </GameTableContainer>
  );
}
