import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, ArrowLeft, Eye } from 'lucide-react';
import GameCard from '../../components/home/GameCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import SEO from '../../components/common/SEO';
import { supabase } from '../../lib/supabase';
import { categoryConfig } from '../../constants';

function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
    window.scrollTo(0, 0);
  }, [categoryName]);

  const loadGames = async () => {
    setLoading(true);
    try {
      // URL'den gelen kategori ismini decode et
      const decodedCategoryName = decodeURIComponent(categoryName);
      
      // Standart kategoriler listesi - gereksiz kombinasyonları filtrele
      const standardCategories = [
        'Dış Mekan',
        'İç Mekan',
        'Masa Oyunları',
        'Kağıt Oyunları',
        'Kutu Oyunları',
        'Zeka Oyunları'
      ];

      // Eğer kategori standart kategorilerden biri değilse, boş sonuç döndür
      if (!standardCategories.includes(decodedCategoryName)) {
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
  };

  // URL'den gelen kategori ismini decode et
  const decodedCategoryName = decodeURIComponent(categoryName || '');
  const config = categoryConfig[decodedCategoryName] || categoryConfig['default'];
  
  const categoryDescriptions = {
    'Dış Mekan': 'Açık havada, parkta veya bahçede oynayabileceğiniz en eğlenceli oyunlar.',
    'İç Mekan': 'Evde, sınıfta veya kapalı alanlarda oynanabilecek keyifli oyunlar.',
    'Masa Oyunları': 'Masa başında arkadaşlarınızla veya ailenizle oynayabileceğiniz strateji ve şans oyunları.',
    'Kağıt Oyunları': 'İskambil kağıtlarıyla oynanan klasik ve modern kart oyunları.',
    'Kutu Oyunları': 'Zar, piyon ve kartlarla oynanan eğlenceli kutu oyunları.',
    'Zeka Oyunları': 'Zihninizi zorlayacak, düşünme becerilerinizi geliştirecek oyunlar.'
  };
  
  const description = categoryDescriptions[decodedCategoryName] || 'Keyifli vakit geçirebileceğiniz oyunlar.';
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
        title={`${decodedCategoryName} Oyunları - Nasıl Oynanır?`}
        description={description}
        url={`/kategori/${categoryName}`}
      />
      
      {/* Header Section - GameDetail Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group text-sm"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Geri Dön</span>
          </button>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Category Icon/Image */}
            <div className="md:col-span-1">
              <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden relative">
                <img 
                  src={config.image} 
                  alt={decodedCategoryName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className={`p-3 ${config.bgColor} rounded-lg backdrop-blur-sm border border-white/20`}>
                    <IconComponent className={colorClass.icon} size={32} />
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
                  <Eye size={14} className="mr-1" />
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
            <Filter className="text-orange-600" />
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
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oyun bulunamadı</h3>
            <p className="text-gray-500">Bu kategoride henüz oyun eklenmemiş.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
