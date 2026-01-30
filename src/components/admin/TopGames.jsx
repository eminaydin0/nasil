import { TrendingUp, Star, Eye, MessageCircle, ArrowRight } from 'lucide-react';

function TopGames({ sortedGames, onTabChange }) {
  const list = [...(sortedGames || [])];
  const topViewedGames = list
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const topRatedGames = list
    .filter((game) => game.commentCount > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  const topCommentedGames = list
    .filter((game) => game.commentCount > 0)
    .sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))
    .slice(0, 5);

  const TopList = ({ title, icon: Icon, iconColor, games, formatter, onTabChange }) => (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 h-full flex flex-col">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
        <Icon size={20} className={`mr-2 shrink-0 ${iconColor}`} />
        <span className="truncate">{title}</span>
      </h3>
      <div className="space-y-2 flex-1">
        {games.map((game, index) => (
          <div
            key={game.id}
            className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <span className="text-sm font-bold text-gray-400 shrink-0 w-6">#{index + 1}</span>
              <img src={game.image} alt={game.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{game.name}</div>
                <div className="text-xs text-gray-500 truncate">{game.category}</div>
              </div>
            </div>
            <div className={`flex items-center gap-1 font-semibold text-sm shrink-0 ${iconColor}`}>
              {formatter(game)}
            </div>
          </div>
        ))}
      </div>
      {games.length > 0 && onTabChange && (
        <button
          onClick={() => onTabChange('games')}
          className="mt-3 w-full py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors flex items-center justify-center gap-1"
        >
          Tüm Oyunlar
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
      <TopList
        title="En Çok Görüntülenen"
        icon={Eye}
        iconColor="text-green-600"
        games={topViewedGames}
        onTabChange={onTabChange}
        formatter={(g) => (
          <>
            <Eye size={16} />
            <span>{(g.views || 0).toLocaleString('tr-TR')}</span>
          </>
        )}
      />
      <TopList
        title="En Yüksek Puanlı"
        icon={Star}
        iconColor="text-yellow-600"
        games={topRatedGames}
        onTabChange={onTabChange}
        formatter={(g) => (
          <>
            <Star size={16} className="fill-yellow-600" />
            <span>{(g.rating || 0).toFixed(1)}</span>
          </>
        )}
      />
      <TopList
        title="En Çok Yorum Alan"
        icon={MessageCircle}
        iconColor="text-purple-600"
        games={topCommentedGames}
        onTabChange={onTabChange}
        formatter={(g) => (
          <>
            <MessageCircle size={16} />
            <span>{g.commentCount || 0}</span>
          </>
        )}
      />
    </div>
  );
}

export default TopGames;
