import { useMemo, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  MessageCircle,
  Eye,
  Search,
  Gamepad2,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
  onAddNew,
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(games.map((g) => g.category).filter(Boolean));
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'tr'))];
  }, [games]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sortedGames.filter((g) => {
      if (categoryFilter !== 'all' && g.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        g.name?.toLowerCase().includes(q) ||
        g.category?.toLowerCase().includes(q) ||
        g.slug?.toLowerCase().includes(q)
      );
    });
  }, [sortedGames, search, categoryFilter]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedGames(filtered.map((g) => g.id));
    } else {
      setSelectedGames([]);
    }
  };

  const handleSelectGame = (gameId, checked) => {
    if (checked) setSelectedGames([...selectedGames, gameId]);
    else setSelectedGames(selectedGames.filter((id) => id !== gameId));
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortDirection === 'asc' ? (
        <ArrowUp size={14} className="text-orange-600" />
      ) : (
        <ArrowDown size={14} className="text-orange-600" />
      );
    }
    return <ArrowUpDown size={14} className="text-warm-400 group-hover:text-orange-600" />;
  };

  return (
    <div className="space-y-5">
      {/* Üst bar */}
      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-charcoal-900">
              <Gamepad2 size={20} className="text-orange-600" />
              Oyunlar
            </h2>
            <p className="mt-0.5 text-sm text-warm-500">
              Toplam {games.length} oyun · {filtered.length} sonuç gösteriliyor
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selectedGames.length > 0 && (
              <button
                type="button"
                onClick={onBulkDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-rose-600"
              >
                <Trash2 size={16} />
                Sil ({selectedGames.length})
              </button>
            )}
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-1.5 rounded-xl border border-warm-200 bg-cream-50 px-3.5 py-2.5 text-sm font-semibold text-warm-800 transition-all hover:bg-warm-100"
            >
              <Download size={16} />
              Yedekle
            </button>
            <button
              type="button"
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-warm-glow transition-all hover:-translate-y-0.5 hover:shadow-warm-glow-lg"
            >
              <Plus size={16} />
              Yeni Oyun
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Oyun adı, kategori veya slug ile ara..."
              className="w-full rounded-xl border border-warm-200 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-charcoal-900 placeholder-warm-400 transition-colors focus:border-orange-400 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="overflow-x-auto">
            <div className="inline-flex rounded-xl border border-warm-200 bg-cream-50 p-1">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    categoryFilter === cat
                      ? 'bg-white text-charcoal-900 shadow-soft'
                      : 'text-warm-500 hover:text-charcoal-900'
                  }`}
                >
                  {cat === 'all' ? 'Tümü' : cat}
                </button>
              ))}
              {categories.length > 6 && (
                <select
                  value={categories.slice(0, 6).includes(categoryFilter) ? '' : categoryFilter}
                  onChange={(e) => e.target.value && setCategoryFilter(e.target.value)}
                  className="ml-1 rounded-lg border border-warm-200 bg-white px-2 py-1.5 text-xs font-semibold text-warm-700 focus:outline-none"
                >
                  <option value="">Daha fazla...</option>
                  {categories.slice(6).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tablo - Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-warm-200/60 bg-white shadow-soft md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-warm-200 bg-cream-50">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedGames.length === filtered.length && filtered.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-warm-300 text-orange-500 focus:ring-orange-500/30"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => onSort('id')}
                    className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-warm-600 hover:text-charcoal-900"
                  >
                    ID {getSortIcon('id')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => onSort('name')}
                    className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-warm-600 hover:text-charcoal-900"
                  >
                    Oyun {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => onSort('category')}
                    className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-warm-600 hover:text-charcoal-900"
                  >
                    Kategori {getSortIcon('category')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => onSort('rating')}
                    className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-warm-600 hover:text-charcoal-900"
                  >
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    Puan {getSortIcon('rating')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => onSort('comments')}
                    className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-warm-600 hover:text-charcoal-900"
                  >
                    <MessageCircle size={12} className="text-purple-500" />
                    Yorum {getSortIcon('comments')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => onSort('views')}
                    className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-warm-600 hover:text-charcoal-900"
                  >
                    <Eye size={12} className="text-emerald-500" />
                    Görüntülenme {getSortIcon('views')}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-warm-600">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-16 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-warm-500">
                      <Search size={24} className="text-warm-400" />
                      <p className="text-sm font-semibold">Sonuç bulunamadı</p>
                      <p className="text-xs">Arama veya filtreleri temizleyin.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((game) => (
                  <tr
                    key={game.id}
                    className="group border-b border-warm-100 transition-colors hover:bg-cream-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedGames.includes(game.id)}
                        onChange={(e) => handleSelectGame(game.id, e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-warm-300 text-orange-500 focus:ring-orange-500/30"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-grid h-7 w-9 place-items-center rounded-md bg-warm-100 text-xs font-bold text-warm-700 group-hover:bg-orange-100 group-hover:text-orange-700">
                        {game.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={game.image}
                          alt={game.name}
                          loading="lazy"
                          className="h-12 w-16 shrink-0 rounded-lg object-cover ring-1 ring-warm-200/60"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-charcoal-900 group-hover:text-orange-600">
                            {game.name}
                          </div>
                          <div className="truncate text-xs text-warm-500">{game.players}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-warm-100 px-2 py-0.5 text-xs font-semibold text-warm-700">
                        {game.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {game.rating > 0 ? (
                        <div className="inline-flex items-center gap-1 text-sm">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          <span className="font-bold text-charcoal-900">
                            {game.rating.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-warm-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1 text-sm font-bold text-purple-600">
                        <MessageCircle size={13} />
                        {game.commentCount || 0}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                        <Eye size={13} />
                        {(game.views || 0).toLocaleString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {game.slug && (
                          <Link
                            to={`/${game.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="grid h-8 w-8 place-items-center rounded-lg text-warm-500 transition-all hover:bg-warm-100 hover:text-charcoal-900"
                            title="Sitede aç"
                          >
                            <ExternalLink size={15} />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => onEdit(game)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-blue-600 transition-all hover:bg-blue-50"
                          title="Düzenle"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(game.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition-all hover:bg-rose-50"
                          title="Sil"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobil Kart Görünümü */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-warm-200/60 bg-white p-10 text-center shadow-soft">
            <Search size={24} className="mx-auto mb-2 text-warm-400" />
            <p className="text-sm font-semibold text-warm-700">Sonuç bulunamadı</p>
            <p className="mt-1 text-xs text-warm-500">Arama veya filtreleri temizleyin.</p>
          </div>
        ) : (
          filtered.map((game) => (
            <div
              key={game.id}
              className="overflow-hidden rounded-2xl border border-warm-200/60 bg-white shadow-soft"
            >
              <div className="flex gap-3 p-3">
                <img
                  src={game.image}
                  alt={game.name}
                  loading="lazy"
                  className="h-20 w-28 shrink-0 rounded-xl object-cover ring-1 ring-warm-200/60"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-charcoal-900">
                        {game.name}
                      </div>
                      <div className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-warm-500">
                        <span className="rounded-md bg-warm-100 px-1.5 py-0.5 font-semibold text-warm-700">
                          #{game.id}
                        </span>
                        <span className="rounded-md bg-orange-100 px-1.5 py-0.5 font-semibold text-orange-700">
                          {game.category}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedGames.includes(game.id)}
                      onChange={(e) => handleSelectGame(game.id, e.target.checked)}
                      className="h-4 w-4 shrink-0 cursor-pointer rounded border-warm-300 text-orange-500 focus:ring-orange-500/30"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px]">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Eye size={12} /> {(game.views || 0).toLocaleString('tr-TR')}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-600">
                      <MessageCircle size={12} /> {game.commentCount || 0}
                    </span>
                    {game.rating > 0 && (
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        {game.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex border-t border-warm-200/60">
                {game.slug && (
                  <Link
                    to={`/${game.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-warm-700 hover:bg-warm-50"
                  >
                    <ExternalLink size={13} />
                    Görüntüle
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => onEdit(game)}
                  className="flex flex-1 items-center justify-center gap-1.5 border-l border-warm-200/60 py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                >
                  <Edit2 size={13} />
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(game.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 border-l border-warm-200/60 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 size={13} />
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GamesTable;
