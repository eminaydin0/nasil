import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ArrowLeft } from 'lucide-react';
import GameCard from '../../components/home/GameCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { supabase } from '../../lib/supabase';

function CategoryPage() {
  const { categoryName } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
    window.scrollTo(0, 0);
  }, [categoryName]);

  const loadGames = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('category', categoryName)
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

  const categoryConfig = {
    'Dış Mekan': { 
      icon: '🌳', 
      color: 'green', 
      bgColor: 'bg-green-50',
      description: 'Açık havada, parkta veya bahçede oynayabileceğiniz en eğlenceli oyunlar.'
    },
    'İç Mekan': { 
      icon: '🏠', 
      color: 'blue', 
      bgColor: 'bg-blue-50',
      description: 'Evde, sınıfta veya kapalı alanlarda oynanabilecek keyifli oyunlar.'
    },
    'Masa Oyunları': { 
      icon: '🎲', 
      color: 'purple', 
      bgColor: 'bg-purple-50',
      description: 'Masa başında arkadaşlarınızla veya ailenizle oynayabileceğiniz strateji ve şans oyunları.'
    },
    'Kağıt Oyunları': { 
      icon: '🃏', 
      color: 'red', 
      bgColor: 'bg-red-50',
      description: 'İskambil kağıtlarıyla oynanan klasik ve modern kart oyunları.'
    },
    'Kutu Oyunları': { 
      icon: '📦', 
      color: 'orange', 
      bgColor: 'bg-orange-50',
      description: 'Zar, piyon ve kartlarla oynanan eğlenceli kutu oyunları.'
    },
    'Zeka Oyunları': { 
      icon: '🧠', 
      color: 'indigo', 
      bgColor: 'bg-indigo-50',
      description: 'Zihninizi zorlayacak, düşünme becerilerinizi geliştirecek oyunlar.'
    },
    'default': { 
      icon: '🎮', 
      color: 'gray', 
      bgColor: 'bg-gray-50',
      description: 'Keyifli vakit geçirebileceğiniz oyunlar.'
    }
  };

  const config = categoryConfig[categoryName] || categoryConfig['default'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="h-48 bg-gray-200 rounded-2xl animate-shimmer mb-8"></div>
          <div className="grid md:grid-cols-3 gap-6">
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
      {/* Header Section */}
      <div className={`${config.bgColor} border-b border-${config.color}-100`}>
        <div className="container mx-auto px-4 py-12">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Ana Sayfaya Dön
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{config.icon}</span>
            <h1 className={`text-4xl font-black text-${config.color}-900`}>
              {categoryName}
            </h1>
          </div>
          <p className={`text-lg text-${config.color}-800 max-w-2xl`}>
            {config.description}
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className={`text-${config.color}-600`} />
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
