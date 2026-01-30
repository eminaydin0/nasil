import { useState, useEffect } from 'react';
import { Gamepad2, Search } from 'lucide-react';
import GameCard from '../../components/home/GameCard';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useGames } from '../../hooks/useGames';
import { useCategories } from '../../hooks/useCategories';
import { CATEGORY_NAMES } from '../../constants';
import { PAGE_SEO, generateItemListSchema, SCHEMA_TEMPLATES } from '../../constants/seo';
import { trackPageView } from '../../utils/analytics';

function AllGames() {
  const { games, loading } = useGames();
  const { categories: dbCategories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [categories, setCategories] = useState(['Tümü']);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/oyunlar');
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      const gameCats = new Set(games.map((g) => g.category).filter(Boolean));
      // Sadece aktif kategorileri al (isActive !== false)
      const categoryNames = dbCategories?.length > 0
        ? dbCategories.filter((c) => c.isActive !== false).map((c) => c.name)
        : CATEGORY_NAMES;
      const ordered = categoryNames.filter((c) => gameCats.has(c));
      setCategories(['Tümü', ...ordered]);
    }
  }, [games, dbCategories]);

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // SEO için structured data
  const structuredData = [
    SCHEMA_TEMPLATES.webPage(
      PAGE_SEO.allGames.title,
      PAGE_SEO.allGames.description,
      '/oyunlar'
    ),
    games.length > 0 ? generateItemListSchema(games, 'Tüm Oyunlar') : null,
  ].filter(Boolean);

  // Breadcrumb
  const breadcrumbs = [
    { name: 'Tüm Oyunlar', url: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO 
        title={PAGE_SEO.allGames.title}
        description={PAGE_SEO.allGames.description}
        keywords={PAGE_SEO.allGames.keywords}
        url="/oyunlar"
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
              <h1 className="text-3xl font-black text-gray-900">Tüm Oyunlar</h1>
              <p className="text-gray-600">Arşivimizdeki tüm oyunları keşfedin ({games.length} oyun)</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-start gap-1.5 w-full md:flex-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-56 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
            
            {/* Sonuç bilgisi */}
            <p className="text-center text-gray-500 mt-8 text-sm">
              {filteredGames.length} oyun gösteriliyor
              {selectedCategory !== 'Tümü' && ` (${selectedCategory})`}
              {searchTerm && ` - "${searchTerm}" araması`}
            </p>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oyun bulunamadı</h3>
            <p className="text-gray-500">Aramanızla eşleşen oyun bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllGames;
