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
import { trackPageView } from '../../utils/analytics';

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
    const query = searchParams.get('search');
    trackPageView(
      query ? `/oyunlar?search=${encodeURIComponent(query)}` : '/oyunlar'
    );
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
  const seoTitle = searchQuery
    ? `"${searchQuery}" Arama Sonuçları - Tüm Oyunlar`
    : PAGE_SEO.allGames.title;
  const seoDescription = searchQuery
    ? `"${searchQuery}" araması için ${filteredGames.length} oyun bulundu. Geleneksel Türk oyunları arşivinde arama yapın.`
    : PAGE_SEO.allGames.description;
  const seoUrl = searchQuery
    ? `/oyunlar?search=${encodeURIComponent(searchQuery)}`
    : '/oyunlar';

  // SEO için structured data
  const structuredData = [
    SCHEMA_TEMPLATES.webPage(seoTitle, seoDescription, seoUrl),
    games.length > 0 ? generateItemListSchema(filteredGames, searchQuery ? `"${searchQuery}" Arama Sonuçları` : 'Tüm Oyunlar') : null,
  ].filter(Boolean);

  // Breadcrumb
  const breadcrumbs = [
    { name: 'Tüm Oyunlar', url: null },
  ];

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={PAGE_SEO.allGames.keywords}
        url={seoUrl}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Gamepad2 className="text-orange-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-warm-900">
                {searchQuery ? `"${searchQuery}" Arama Sonuçları` : 'Tüm Oyunlar'}
              </h1>
              <p className="text-warm-600">
                {searchQuery
                  ? `${filteredGames.length} oyun bulundu`
                  : `Arşivimizdeki tüm oyunları keşfedin (${games.length} oyun)`}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-warm-100 flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-start gap-1.5 w-full md:flex-1 overflow-x-auto">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
