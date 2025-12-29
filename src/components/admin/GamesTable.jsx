import { Plus, Edit2, Trash2, Download, ArrowUpDown, ArrowUp, ArrowDown, Star, MessageCircle, Eye } from 'lucide-react';

function GamesTable({ 
  games, 
  sortedGames, 
  selectedGames, 
  setSelectedGames,
  sortBy, 
  sortDirection, 
  onSort, 
  onEdit, 
  onDelete, 
  onBulkDelete,
  onExport,
  onAddNew
}) {
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedGames(sortedGames.map(g => g.id));
    } else {
      setSelectedGames([]);
    }
  };

  const handleSelectGame = (gameId, checked) => {
    if (checked) {
      setSelectedGames([...selectedGames, gameId]);
    } else {
      setSelectedGames(selectedGames.filter(id => id !== gameId));
    }
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortDirection === 'asc' ? 
        <ArrowUp size={16} className="text-orange-600" /> : 
        <ArrowDown size={16} className="text-orange-600" />;
    }
    return <ArrowUpDown size={16} className="text-gray-400 group-hover:text-orange-600" />;
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Oyunlar</h2>
          <p className="text-gray-600">Toplam {games.length} oyun</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedGames.length > 0 && (
            <button
              onClick={onBulkDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={18} />
              <span>Seçilileri Sil ({selectedGames.length})</span>
            </button>
          )}
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download size={18} />
            <span>Verileri İndir</span>
          </button>
          <button
            onClick={onAddNew}
            className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            <span>Yeni Oyun Ekle</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedGames.length === sortedGames.length && sortedGames.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => onSort('id')}
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                  >
                    <span>ID</span>
                    {getSortIcon('id')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Görsel</th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => onSort('name')}
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                  >
                    <span>Oyun Adı</span>
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => onSort('category')}
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                  >
                    <span>Kategori</span>
                    {getSortIcon('category')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => onSort('rating')}
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                  >
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span>Puan</span>
                    {getSortIcon('rating')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => onSort('comments')}
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                  >
                    <MessageCircle size={16} className="text-blue-500" />
                    <span>Yorum</span>
                    {getSortIcon('comments')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => onSort('views')}
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                  >
                    <Eye size={16} className="text-green-500" />
                    <span>Görüntülenme</span>
                    {getSortIcon('views')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedGames.map((game) => (
                <tr key={game.id} className="hover:bg-orange-50/30 transition-all duration-200 group">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedGames.includes(game.id)}
                      onChange={(e) => handleSelectGame(game.id, e.target.checked)}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 group-hover:bg-orange-100 text-gray-700 group-hover:text-orange-700 rounded-lg font-semibold text-sm transition-colors">
                      {game.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-20 h-14 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{game.name}</div>
                    <div className="text-sm text-gray-500">{game.players}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
                      {game.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {game.rating > 0 ? (
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-gray-900">{game.rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={14} className="text-blue-500" />
                      <span className="font-semibold text-blue-600">{game.commentCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye size={14} className="text-green-500" />
                      <span className="font-semibold text-green-600">{(game.views || 0).toLocaleString('tr-TR')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(game)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:scale-110"
                        title="Düzenle"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(game.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-110"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default GamesTable;
