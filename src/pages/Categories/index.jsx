import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, ArrowLeft, Eye } from 'lucide-react';
import GameCard from '../../components/home/GameCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import SEO from '../../components/common/SEO';
import Breadcrumb, { BREADCRUMB_TEMPLATES } from '../../components/common/Breadcrumb';
import { supabase } from '../../lib/supabase';
import { CATEGORY_NAMES, getCategoryConfig, getCategoryDescription } from '../../constants';
import { useCategories } from '../../hooks/useCategories';
import { trackPageView } from '../../utils/analytics';
import { 
  CATEGORY_SEO, 
  generateCollectionPageSchema,
  generateItemListSchema 
} from '../../constants/seo';

function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { categories: dbCategories } = useCategories();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodedCategoryName = decodeURIComponent(categoryName || '');

  const loadGames = useCallback(async () => {
    setLoading(true);
    try {
      // Sadece aktif kategorileri kontrol et
      const validNames = dbCategories?.length > 0
        ? dbCategories.filter((c) => c.isActive !== false).map((c) => c.name)
        : CATEGORY_NAMES;
      if (!validNames.includes(decodedCategoryName)) {
        setGames([]);
        setLoading(false);
        return;
      }

      // Tam eşleşme ile kategoriye göre oyunları getir
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('category', decodedCategoryName)
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      const formattedGames = data.map(game => ({
        id: game.id,
        slug: game.slug,
        name: game.name,
        category: game.category,
        players: game.players,
        difficulty: game.difficulty,
        image: game.image,
        shortDescription: game.short_description,
        description: game.description,
        rules: game.rules,
        tips: game.tips
      }));
      
      setGames(formattedGames);
    } catch (error) {
      console.error('Error loading games:', error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [decodedCategoryName, dbCategories]);

  useEffect(() => {
    loadGames();
    window.scrollTo(0, 0);
    trackPageView(`/kategori/${categoryName}`);
  }, [loadGames, categoryName]);

  const config = getCategoryConfig(decodedCategoryName, dbCategories);
  const description = getCategoryDescription(decodedCategoryName, dbCategories);
  const IconComponent = config.icon;
  
  // Renk class mapping - Tailwind için
  const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600' },
    red: { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'text-orange-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'text-indigo-600' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-600' }
  };
  
  const colorClass = colorClasses[config.color] || colorClasses.gray;

  // SEO Meta
  const seoMeta = useMemo(() => {
    const categoryData = CATEGORY_SEO[decodedCategoryName] || {};
    return {
      title: categoryData.title || `${decodedCategoryName} Oyunları - Nasıl Oynanır?`,
      description: categoryData.description || description,
      keywords: categoryData.keywords || `${decodedCategoryName}, ${decodedCategoryName.toLowerCase()} oyunları, nasıl oynanır`,
    };
  }, [decodedCategoryName, description]);

  // Structured Data
  const structuredData = useMemo(() => {
    if (!games.length) return null;
    return [
      generateCollectionPageSchema(decodedCategoryName, games),
      generateItemListSchema(games, `${decodedCategoryName} Oyunları`),
    ];
  }, [decodedCategoryName, games]);

  // Breadcrumb
  const breadcrumbs = BREADCRUMB_TEMPLATES.category(decodedCategoryName);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="h-48 bg-gray-200 rounded-2xl animate-shimmer mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SkeletonLoader type="game-card" />
            <SkeletonLoader type="game-card" />
            <SkeletonLoader type="game-card" />
            <SkeletonLoader type="game-card" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        url={`/kategori/${categoryName}`}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />
      
      {/* Header Section - GameDetail Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbs} className="mb-6" />

          <div className="grid md:grid-cols-3 gap-6">
            {/* Category Icon/Image */}
            <div className="md:col-span-1">
              <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden relative">
                <img 
                  src={config.image} 
                  alt={`${decodedCategoryName} Oyunları`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className={`p-3 ${config.bgColor} rounded-lg backdrop-blur-sm border border-white/20`}>
                    <IconComponent className={colorClass.icon} size={32} aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-3 py-1 ${colorClass.bg} ${colorClass.text} text-xs font-medium rounded-lg`}>
                  {decodedCategoryName}
                </span>
                <span className="flex items-center text-gray-500 text-xs">
                  <Eye size={14} className="mr-1" aria-hidden="true" />
                  {games.length} oyun
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{decodedCategoryName} Oyunları</h1>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid - HomePage Style */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="text-orange-600" aria-hidden="true" />
            {games.length} Oyun Listeleniyor
          </h2>
        </div>

        {games.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl mb-6" role="img" aria-label="Arama">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oyun bulunamadı</h3>
            <p className="text-gray-500">Bu kategoride henüz oyun eklenmemiş.</p>
            <button
              onClick={() => navigate('/oyunlar')}
              className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Tüm Oyunları Gör
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
