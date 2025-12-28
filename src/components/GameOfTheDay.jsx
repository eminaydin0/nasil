import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Sparkles } from 'lucide-react';

function GameOfTheDay({ games }) {
  // Günün oyununu seç (günlük değişen deterministik algoritma)
  const getGameOfTheDay = () => {
    if (games.length === 0) return null;
    
    // Bugünün tarihini kullanarak seed oluştur
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const seed = dayOfYear + today.getFullYear() * 365;
    
    // Deterministik rastgele seçim (her gün aynı oyun)
    const index = seed % games.length;
    return games[index];
  };

  const gameOfTheDay = getGameOfTheDay();

  if (!gameOfTheDay) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-2xl mb-8">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTIwIDE0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDIwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] animate-[scroll_20s_linear_infinite]"></div>
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <Sparkles className="text-yellow-300 animate-pulse" size={20} />
            <span className="text-white font-bold text-sm tracking-wide">GÜNÜN OYUNU</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Calendar size={18} />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Game Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
            <img 
              src={gameOfTheDay.image} 
              alt={gameOfTheDay.name}
              className="w-full h-64 md:h-80 object-cover rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded">
                  {gameOfTheDay.category}
                </span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded">
                  {gameOfTheDay.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Game Info */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              {gameOfTheDay.name}
            </h2>
            <p className="text-white/90 text-lg mb-4 leading-relaxed">
              {gameOfTheDay.shortDescription}
            </p>
            
            <div className="flex items-center gap-4 mb-6 text-white/80">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} />
                <span className="text-sm">{gameOfTheDay.players}</span>
              </div>
            </div>

            <Link
              to={`/oyun/${gameOfTheDay.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-all hover:scale-105 shadow-xl"
            >
              <span>Detaylı İncele</span>
              <Sparkles size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameOfTheDay;
