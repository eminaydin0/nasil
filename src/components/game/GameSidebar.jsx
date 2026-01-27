import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import GameRecommendations from '../../components/home/GameRecommendations';

export default function GameSidebar({ game, games }) {
  const currentIndex = games.findIndex(g => g.id === game.id);
  const nextGame = games[(currentIndex + 1) % games.length];
  const prevGame = games[(currentIndex - 1 + games.length) % games.length];

  return (
    <div className="space-y-6">
      {/* Game Recommendations */}
      <GameRecommendations currentGame={game} allGames={games} />
      
      {/* Next/Previous Games */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Diğer Oyunlar</h3>
        <div className="space-y-2">
          <Link
            to={`/oyun/${prevGame.slug}`}
            className="block group"
          >
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-14 h-14 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={prevGame.image} 
                  alt={prevGame.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Önceki</p>
                <p className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors truncate text-sm">
                  {prevGame.name}
                </p>
              </div>
              <ChevronRight className="text-gray-400 transform rotate-180 shrink-0" size={18} />
            </div>
          </Link>

          <Link
            to={`/oyun/${nextGame.slug}`}
            className="block group"
          >
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-14 h-14 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={nextGame.image} 
                  alt={nextGame.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Sonraki</p>
                <p className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors truncate text-sm">
                  {nextGame.name}
                </p>
              </div>
              <ChevronRight className="text-gray-400 shrink-0" size={18} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
