import { useState } from 'react';
import { Trophy, RotateCcw, Save, Trash2 } from 'lucide-react';

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
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-xl">
            <div className="text-red-600 font-bold text-lg">OK</div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Okey Sayacı</h3>
        </div>
        <button 
          onClick={resetGame}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Sıfırla"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-4 gap-2 mb-6 bg-red-50 p-4 rounded-xl">
        {players.map((player, idx) => (
          <div key={idx} className="flex flex-col items-center">
             <input
                type="text"
                value={player}
                onChange={(e) => updateName(idx, e.target.value)}
                className="w-full text-center bg-transparent text-xs font-semibold text-gray-500 mb-1 focus:outline-none focus:text-gray-900"
              />
            <div className={`text-2xl font-black ${scores[idx] <= 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {scores[idx]}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="space-y-4 grow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Eli Kim Kazandı?</label>
          <div className="grid grid-cols-2 gap-2">
            {players.map((player, idx) => (
              <button
                key={idx}
                onClick={() => setWinner(idx)}
                className={`p-2 rounded-lg text-sm font-medium transition-all truncate ${
                  winner === idx 
                    ? 'bg-red-600 text-white shadow-md' 
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
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                winType === 'normal' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Normal (-2)
            </button>
            <button
              onClick={() => setWinType('cift')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                winType === 'cift' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Okey/Çift (-4)
            </button>
          </div>
        </div>

        <button
          onClick={applyRound}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-auto"
        >
          <Save size={18} />
          Puanları İşle
        </button>
        
        <div className="pt-4 border-t border-gray-100">
           <div className="flex items-center gap-2">
             <span className="text-xs text-gray-500 whitespace-nowrap">Başlangıç Puanı:</span>
             <input 
               type="number" 
               value={startScore}
               onChange={(e) => setStartScore(Number(e.target.value))}
               className="w-16 p-1 text-sm border border-gray-200 rounded text-center"
             />
           </div>
        </div>
      </div>
    </div>
  );
}
