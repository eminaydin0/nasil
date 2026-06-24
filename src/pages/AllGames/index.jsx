import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Gamepad2, Search } from 'lucide-react';
import GameCard from '../../components/home/GameCard';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useGames } from '../../hooks/useGames';
import { useCategories } from '../../hooks/useCategories';
import { useGameStats } from '../../hooks/useGameStats';
import { getCategoriesWithCounts } from '../../constants/categories';
import { PAGE_SEO, generateItemListSchema, SCHEMA_TEMPLATES } from '../../constants/seo';
import { buildAllGamesSeoMeta } from '../../lib/seoEngine';
import { trackGameSearch } from '../../utils/analytics';

// Kategori eşleştirme - büyük/küçük harf duyarsız
const categoryMatches = (gameCategory, selectedCategory) => {
  if (!gameCategory || selectedCategory === 'Tümü') return selectedCategory === 'Tümü';
  const g = String(gameCategory).toLocaleLowerCase('tr-TR').trim();
  const s = String(selectedCategory).toLocaleLowerCase('tr-TR').trim();
  return g === s;
};

function AllGames() {
  const { games, loading } = useGames();
  const { categories: dbCategories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') ?? '');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  // Gerçek kategoriler: DB + constants, sıralı, tüm aktif kategoriler
  const categoryTabs = useMemo(() => {
    const withCounts = getCategoriesWithCounts(games, dbCategories);
    return [
      { name: 'Tümü', count: games.length },
      ...withCounts.map((c) => ({ name: c.name, count: c.count || 0 })),
    ];
  }, [games, dbCategories]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  useEffect(() => {
    const query = searchParams.get('search')?.trim();
    if (query) trackGameSearch(query);
  }, [searchParams]);

  // Geri/ileri navigasyonda URL'den arama terimini senkronize et
  useEffect(() => {
    setSearchTerm(searchParams.get('search') ?? '');
  }, [searchParams]);

  // Arama terimi değişince URL'yi güncelle (SearchAction ile uyumlu)
  useEffect(() => {
    const trimmed = searchTerm.trim();
    const current = (searchParams.get('search') ?? '').trim();
    if (trimmed === current) return;

    const timer = setTimeout(() => {
      if (trimmed) {
        setSearchParams({ search: trimmed }, { replace: true });
      } else if (searchParams.has('search')) {
        setSearchParams({}, { replace: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, setSearchParams]);

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || categoryMatches(game.category, selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const allGameIds = useMemo(() => games.map((g) => g.id), [games]);
  const { statsMap } = useGameStats(allGameIds);

  const searchQuery = searchParams.get('search')?.trim() ?? '';

  const seoMeta = useMemo(
    () => buildAllGamesSeoMeta(filteredGames, {
      searchQuery,
      category: selectedCategory,
    }),
    [filteredGames, searchQuery, selectedCategory]
  );

  const structuredData = useMemo(() => [
    SCHEMA_TEMPLATES.webPage(seoMeta.title, seoMeta.description, seoMeta.url),
    filteredGames.length > 0
      ? generateItemListSchema(
          filteredGames,
          searchQuery ? `"${searchQuery}" Arama Sonuçları` : 'Tüm Oyunlar'
        )
      : null,
  ].filter(Boolean), [seoMeta, filteredGames, searchQuery]);

  // Breadcrumb
  const breadcrumbs = [
    { name: 'Tüm Oyunlar', url: null },
  ];

  return (
    <div className="min-h-screen bg-cream-50 py-8 sm:py-12">
      <SEO 
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords || PAGE_SEO.allGames.keywords}
        url={seoMeta.url}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="shrink-0 rounded-xl bg-orange-100 p-3 self-start">
              <Gamepad2 className="text-orange-600" size={32} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-warm-900 sm:text-3xl">
                {searchQuery ? `"${searchQuery}" Arama Sonuçları` : 'Tüm Oyunlar'}
              </h1>
              <p className="text-sm text-warm-600 sm:text-base">
                {searchQuery
                  ? `${filteredGames.length} oyun bulundu`
                  : `Arşivimizdeki tüm oyunları keşfedin (${games.length} oyun)`}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 rounded-xl border border-warm-100 bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
            {/* Category Tabs */}
            <div className="scroll-touch -mx-1 flex w-full items-center gap-1.5 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-1 md:flex-wrap md:justify-start md:overflow-visible md:pb-0">
              {categoryTabs.map(({ name, count }) => (
                <button
                  key={name}
                  onClick={() => setSelectedCategory(name)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === name
                      ? 'bg-charcoal-900 text-white shadow-md'
                      : 'bg-cream-50 text-warm-600 hover:bg-warm-100 hover:text-warm-900'
                  }`}
                >
                  <span>{name}</span>
                  <span className={selectedCategory === name ? 'text-white/80' : 'text-warm-400'}>
                    ({count})
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-56 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" size={18} />
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cream-50 border border-warm-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                aria-label="Oyun ara"
              />
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map(game => {
                const stats = statsMap[game.id];
                return (
                  <GameCard
                    key={game.id}
                    game={game}
                    rating={stats?.average || 0}
                    commentCount={stats?.count || 0}
                  />
                );
              })}
            </div>
            
            {/* Sonuç bilgisi */}
            <p className="text-center text-warm-500 mt-8 text-sm">
              {filteredGames.length} oyun gösteriliyor
              {selectedCategory !== 'Tümü' && ` • ${selectedCategory}`}
              {searchTerm && ` • "${searchTerm}" araması`}
            </p>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-warm-100">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-xl font-bold text-warm-900 mb-2">Oyun bulunamadı</h3>
            <p className="text-warm-500">Aramanızla eşleşen oyun bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllGames;
