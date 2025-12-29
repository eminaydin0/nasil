import { TrendingUp, Star, Eye } from 'lucide-react';

function TopGames({ sortedGames }) {
  const topViewedGames = sortedGames
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const topRatedGames = sortedGames
    .filter(game => game.commentCount > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2 text-green-600" />
          En Çok Görüntülenen Oyunlar
        </h3>
        <div className="space-y-3">
          {topViewedGames.map((game, index) => (
            <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <img src={game.image} alt={game.name} className="w-12 h-12 object-cover rounded" />
                <div>
                  <div className="font-semibold text-gray-900">{game.name}</div>
                  <div className="text-sm text-gray-500">{game.category}</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600 font-semibold">
                <Eye size={16} />
                <span>{(game.views || 0).toLocaleString('tr-TR')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Star size={20} className="mr-2 text-yellow-600" />
          En Yüksek Puanlı Oyunlar
        </h3>
        <div className="space-y-3">
          {topRatedGames.map((game, index) => (
            <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <img src={game.image} alt={game.name} className="w-12 h-12 object-cover rounded" />
                <div>
                  <div className="font-semibold text-gray-900">{game.name}</div>
                  <div className="text-sm text-gray-500">{game.commentCount || 0} yorum</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-yellow-600 font-semibold">
                <Star size={16} className="fill-yellow-600" />
                <span>{(game.rating || 0).toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopGames;
