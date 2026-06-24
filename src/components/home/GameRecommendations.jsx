import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

function GameRecommendations({ currentGame, allGames }) {
  // Algorithm to find similar games
  const getSimilarGames = () => {
    const recommendations = [];
    
    // 1. Same category games (highest priority)
    const sameCategory = allGames.filter(
      g => g.id !== currentGame.id && g.category === currentGame.category
    );
    recommendations.push(...sameCategory.slice(0, 2));
    
    // 2. Same difficulty level
    const sameDifficulty = allGames.filter(
      g => g.id !== currentGame.id && 
           g.difficulty === currentGame.difficulty &&
           !recommendations.find(r => r.id === g.id)
    );
    if (recommendations.length < 3) {
      recommendations.push(...sameDifficulty.slice(0, 3 - recommendations.length));
    }
    
    // 3. Same player count pattern
    if (recommendations.length < 3) {
      const samePlayerCount = allGames.filter(
        g => g.id !== currentGame.id && 
             g.players === currentGame.players &&
             !recommendations.find(r => r.id === g.id)
      );
      recommendations.push(...samePlayerCount.slice(0, 3 - recommendations.length));
    }
    
    // 4. Fill remaining with random popular games
    if (recommendations.length < 3) {
      const remaining = allGames.filter(
        g => g.id !== currentGame.id && !recommendations.find(r => r.id === g.id)
      );
      recommendations.push(...remaining.slice(0, 3 - recommendations.length));
    }
    
    return recommendations.slice(0, 3);
  };

  const similarGames = getSimilarGames();

  if (similarGames.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
          <Sparkles className="text-white" size={18} />
        </div>
        <h3 className="font-bold text-warm-900">Bunu Beğendiyseniz</h3>
      </div>
      
      <p className="text-sm text-warm-600 mb-4">Sizin için önerilen benzer oyunlar:</p>
      
      <div className="space-y-3">
        {similarGames.map((game) => (
          <Link
            key={game.id}
            to={`/oyun/${game.slug}`}
            className="block group"
          >
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all border border-orange-100">
              <img
                src={game.image}
                alt={game.name}
                className="w-16 h-16 rounded-lg object-cover"
                loading="lazy"
                decoding="async"
                width="64"
                height="64"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-warm-900 group-hover:text-orange-600 transition-colors text-sm mb-1 truncate">
                  {game.name}
                </h4>
                <p className="text-xs text-warm-600 line-clamp-2">
                  {game.shortDescription}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                    {game.category}
                  </span>
                  <span className="text-xs text-warm-500">
                    {game.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GameRecommendations;
