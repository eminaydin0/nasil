import { useState } from 'react';
import { Trophy, Save } from 'lucide-react';
import GameTableContainer from '../common/GameTableContainer';

export default function OkeyScore() {
  const [players, setPlayers] = useState(['Oyuncu 1', 'Oyuncu 2', 'Oyuncu 3', 'Oyuncu 4']);
  const [scores, setScores] = useState([20, 20, 20, 20]);
  const [winner, setWinner] = useState(0); // Index of winner
  const [winType, setWinType] = useState('normal'); // normal (2), cift (4)
  const [startScore, setStartScore] = useState(20);

  const resetGame = () => {
    if (window.confirm('Yeni oyun başlatmak istediğinize emin misiniz?')) {
      setScores([startScore, startScore, startScore, startScore]);
    }
  };

  const applyRound = () => {
    const penalty = winType === 'normal' ? 2 : 4;
    
    setScores(prevScores => prevScores.map((score, index) => {
      // The winner's score doesn't change in classic drop-down Okey
      if (index === winner) return score;
      // Others lose points
      return score - penalty;
    }));
  };

  const updateName = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  return (
    <GameTableContainer
      title="Okey Sayacı"
      icon={Trophy}
      iconColor="red"
      onReset={resetGame}
      className="h-full"
    >
      <div className="p-6">

        {/* Score Display */}
        <div className="grid grid-cols-4 gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
          {players.map((player, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <input
                type="text"
                value={player}
                onChange={(e) => updateName(idx, e.target.value)}
                className="w-full text-center bg-white text-xs font-semibold text-gray-600 mb-2 focus:outline-none focus:text-gray-900 focus:ring-2 focus:ring-red-500 rounded-lg px-2 py-1 border border-gray-200"
              />
              <div className={`text-2xl font-black ${scores[idx] <= 0 ? 'text-red-600' : 'text-gray-800'}`}>
                {scores[idx]}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Eli Kim Kazandı?</label>
            <div className="grid grid-cols-2 gap-2">
              {players.map((player, idx) => (
                <button
                  key={idx}
                  onClick={() => setWinner(idx)}
                  className={`p-2.5 rounded-lg text-sm font-medium transition-all truncate ${
                    winner === idx 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {player}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Türü</label>
            <div className="flex gap-2">
              <button
                onClick={() => setWinType('normal')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  winType === 'normal' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Normal (-2)
              </button>
              <button
                onClick={() => setWinType('cift')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  winType === 'cift' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Okey/Çift (-4)
              </button>
            </div>
          </div>

          <button
            onClick={applyRound}
            className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold shadow-sm hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Puanları İşle
          </button>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">Başlangıç Puanı:</span>
              <input 
                type="number" 
                value={startScore}
                onChange={(e) => setStartScore(Number(e.target.value))}
                className="w-16 p-1.5 text-sm border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </GameTableContainer>
  );
}
