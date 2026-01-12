import { useState } from 'react';
import { Users, Plus, Minus, RotateCcw, Trophy } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Trophy className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Skor Tablosu</h3>
        </div>
        <button 
          onClick={resetScores}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Skorları Sıfırla"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {players.map((player) => (
          <div key={player.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
            <div className="grow">
              <input
                type="text"
                value={player.name}
                onChange={(e) => updateName(player.id, e.target.value)}
                className="bg-transparent font-medium text-gray-700 w-full focus:outline-none focus:border-b-2 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => updateScore(player.id, -1)}
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
              >
                <Minus size={16} />
              </button>
              <div className="w-12 text-center font-bold text-2xl text-gray-900">
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
          className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl font-medium hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          <Users size={18} />
          Oyuncu Ekle
        </button>
      </div>
    </div>
  );
}
