import { Link } from 'react-router-dom';
import { ChevronRight, GitCompareArrows } from 'lucide-react';
import { buildComparisonPath } from '../../constants/seo';
import GameRecommendations from '../../components/home/GameRecommendations';

function pickComparisonCandidates(currentGame, allGames, max = 3) {
  if (!currentGame || !Array.isArray(allGames)) return [];
  const others = allGames.filter((g) => g && g.id !== currentGame.id && g.slug);
  if (others.length === 0) return [];

  const sameCategory = others.filter((g) => g.category === currentGame.category);
  const ordered = [
    ...sameCategory,
    ...others.filter((g) => !sameCategory.includes(g)),
  ];

  return ordered.slice(0, max);
}

export default function GameSidebar({ game, games }) {
  if (!Array.isArray(games) || games.length === 0) {
    return null;
  }
  const currentIndex = games.findIndex(g => g.id === game.id);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextGame = games[(safeIndex + 1) % games.length];
  const prevGame = games[(safeIndex - 1 + games.length) % games.length];
  const compareCandidates = pickComparisonCandidates(game, games);

  return (
    <div className="space-y-6">
      {/* Game Recommendations */}
      <GameRecommendations currentGame={game} allGames={games} />

      {/* Karsilastirma onerileri */}
      {compareCandidates.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-sm p-5 border border-orange-100">
          <div className="flex items-center gap-2 mb-3">
            <GitCompareArrows className="text-orange-500" size={18} />
            <h3 className="font-semibold text-warm-900 text-sm">Karşılaştır</h3>
          </div>
          <p className="text-xs text-warm-600 mb-3">
            {game.name} ile başka oyunlar arasındaki farkları yan yana incele.
          </p>
          <div className="space-y-2">
            {compareCandidates.map((other) => (
              <Link
                key={other.id}
                to={buildComparisonPath(game.slug, other.slug)}
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/80 hover:bg-white border border-orange-100 hover:border-orange-300 transition-all group"
              >
                <span className="text-sm font-medium text-warm-900 truncate">
                  <span className="text-warm-500">{game.name} vs</span> {other.name}
                </span>
                <ChevronRight className="text-orange-400 group-hover:text-orange-600 shrink-0 transition-colors" size={16} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Next/Previous Games */}
      {prevGame && nextGame && (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-warm-100">
          <h3 className="font-semibold text-warm-900 mb-3 text-sm">Diğer Oyunlar</h3>
          <div className="space-y-2">
            <Link
              to={`/oyun/${prevGame.slug}`}
              className="block group"
            >
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream-50 transition-colors">
                <div className="w-14 h-14 shrink-0 bg-warm-100 rounded-lg overflow-hidden">
                  <img
                    src={prevGame.image}
                    alt={prevGame.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width="56"
                    height="56"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-warm-500 mb-0.5">Önceki</p>
                  <p className="font-medium text-warm-900 group-hover:text-warm-700 transition-colors truncate text-sm">
                    {prevGame.name}
                  </p>
                </div>
                <ChevronRight className="text-warm-400 transform rotate-180 shrink-0" size={18} />
              </div>
            </Link>

            <Link
              to={`/oyun/${nextGame.slug}`}
              className="block group"
            >
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream-50 transition-colors">
                <div className="w-14 h-14 shrink-0 bg-warm-100 rounded-lg overflow-hidden">
                  <img
                    src={nextGame.image}
                    alt={nextGame.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width="56"
                    height="56"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-warm-500 mb-0.5">Sonraki</p>
                  <p className="font-medium text-warm-900 group-hover:text-warm-700 transition-colors truncate text-sm">
                    {nextGame.name}
                  </p>
                </div>
                <ChevronRight className="text-warm-400 shrink-0" size={18} />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
