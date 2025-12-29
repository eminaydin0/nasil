import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Users, MapPin, Target, Lightbulb, ChevronRight, Eye } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import SocialShare from '../components/SocialShare';
import GameRecommendations from '../components/GameRecommendations';
import SkeletonLoader from '../components/SkeletonLoader';
import { trackPageView, trackGameView } from '../utils/analytics';
import { supabase } from '../lib/supabase';

function GameDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameAndViews();
  }, [slug]);

  const loadGameAndViews = async () => {
    setLoading(true);
    
    try {
      // Oyunu Supabase'den çek
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (gameError) throw gameError;
      
      // Format game data
      const foundGame = {
        id: gameData.id,
        slug: gameData.slug,
        name: gameData.name,
        category: gameData.category,
        players: gameData.players,
        difficulty: gameData.difficulty,
        image: gameData.image,
        shortDescription: gameData.short_description,
        description: gameData.description,
        rules: gameData.rules,
        tips: gameData.tips
      };
      
      setGame(foundGame);
      
      // Tüm oyunları da yükle (recommendations için)
      const { data: allGames } = await supabase
        .from('games')
        .select('*')
        .order('id', { ascending: true });
      
      if (allGames) {
        const formattedGames = allGames.map(g => ({
          id: g.id,
          slug: g.slug,
          name: g.name,
          category: g.category,
          players: g.players,
          difficulty: g.difficulty,
          image: g.image,
          shortDescription: g.short_description,
          description: g.description,
          rules: g.rules,
          tips: g.tips
        }));
        setGames(formattedGames);
      }
      
      // View count'u güncelle
      await updateViewCount(gameData.id);
      
    } catch (error) {
      console.error('Error loading game from Supabase:', error);
      setGame(null);
      setGames([]);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const updateViewCount = async (gameId) => {
    try {
      // Mevcut view count'u al
      const { data: existingView } = await supabase
        .from('game_views')
        .select('view_count')
        .eq('game_id', gameId)
        .single();
      
      if (existingView) {
        // Güncelle
        const { data, error } = await supabase
          .from('game_views')
          .update({ view_count: existingView.view_count + 1 })
          .eq('game_id', gameId)
          .select()
          .single();
        
        if (!error && data) {
          setViewCount(data.view_count);
        }
      } else {
        // Yeni kayıt oluştur
        const { data, error } = await supabase
          .from('game_views')
          .insert([{ game_id: gameId, view_count: 1 }])
          .select()
          .single();
        
        if (!error && data) {
          setViewCount(data.view_count);
        }
      }
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  useEffect(() => {
    if (!game) return;
    
    // Update SEO meta tags dynamically
    // Track game view
    trackPageView(`/oyun/${game.slug}`);
    trackGameView(game.name, game.id);
    
    // Update page title
    document.title = `${game.name} Nasıl Oynanır? Kuralları ve İpuçları | Nasıl Oynanır`;
      
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `${game.name} nasıl oynanır? ${game.shortDescription}. Detaylı oyun kuralları, stratejiler ve püf noktaları. ${game.players}, ${game.difficulty} seviye. ${game.category} oyunu.`
      );
    }
    
    // Update meta keywords for better SEO
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 
        `${game.name} nasıl oynanır, ${game.name} kuralları, ${game.name} stratejileri, ${game.category}, ${game.difficulty} oyun, ${game.players}`
      );
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${game.name} Nasıl Oynanır? - Detaylı Rehber`);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 
        `${game.name} oyununun kurallarını, stratejilerini ve ipuçlarını öğrenin. ${game.shortDescription}`
      );
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', game.image);
    }
    
    // Update canonical URL with slug
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://nasiloynanir.com/oyun/${game.slug}`);
    } else {
      const newCanonical = document.createElement('link');
      newCanonical.rel = 'canonical';
      newCanonical.href = `https://nasiloynanir.com/oyun/${game.slug}`;
      document.head.appendChild(newCanonical);
    }
    
    // Add JSON-LD structured data for better SEO (HowTo schema)
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `${game.name} Nasıl Oynanır`,
      "description": game.description,
      "image": game.image,
      "step": game.rules.map((rule, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "text": rule
      })),
      "totalTime": "PT30M",
      "tool": [{
        "@type": "HowToTool",
        "name": game.category
      }],
      "supply": [{
        "@type": "HowToSupply",
        "name": game.players
      }],
      "about": {
        "@type": "Thing",
        "name": game.category
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [game]);  if (!game || loading) {
    return <SkeletonLoader type="game-detail" />;
  }

  const currentIndex = games.findIndex(g => g.id === game.id);
  const nextGame = games[(currentIndex + 1) % games.length];
  const prevGame = games[(currentIndex - 1 + games.length) % games.length];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header with Image */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group text-sm"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Geri Dön</span>
          </button>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Image */}
            <div className="md:col-span-1">
              <img 
                src={game.image} 
                alt={game.name}
                className="w-full h-64 md:h-full object-cover rounded-xl"
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                    {game.category}
                  </span>
                  <span className="flex items-center text-gray-500 text-xs">
                    <Eye size={14} className="mr-1" />
                    {viewCount.toLocaleString('tr-TR')} görüntülenme
                  </span>
                </div>
                <SocialShare game={game} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.name}</h1>
              <p className="text-gray-600 text-sm">{game.shortDescription}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="text-gray-700" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Oyuncu Sayısı</p>
                <p className="font-semibold text-gray-900 text-sm">{game.players}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <MapPin className="text-gray-700" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Kategori</p>
                <p className="font-semibold text-gray-900 text-sm">{game.category}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Oyun Hakkında</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{game.description}</p>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Oyun Kuralları</h2>
              <div className="space-y-3">
                {game.rules.map((rule, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-lg flex items-center justify-center font-semibold text-xs">
                      {index + 1}
                    </span>
                    <p className="text-gray-600 text-sm pt-0.5">{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">İpuçları</h2>
              <div className="space-y-2">
                {game.tips.map((tip, index) => (
                  <div key={index} className="flex gap-2 p-3 bg-gray-50 rounded-lg">
                    <Lightbulb className="flex-shrink-0 text-gray-700" size={18} />
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Recommendations */}
            <GameRecommendations currentGame={game} allGames={games} />
            
            {/* Next/Previous Games */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Diğer Oyunlar</h3>
              <div className="space-y-2">
                <Link
                  to={`/oyun/${prevGame.slug}`}
                  className="block group"
                >
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <img 
                      src={prevGame.image} 
                      alt={prevGame.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">Önceki</p>
                      <p className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors truncate text-sm">
                        {prevGame.name}
                      </p>
                    </div>
                    <ChevronRight className="text-gray-400 transform rotate-180 flex-shrink-0" size={18} />
                  </div>
                </Link>

                <Link
                  to={`/oyun/${nextGame.slug}`}
                  className="block group"
                >
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <img 
                      src={nextGame.image} 
                      alt={nextGame.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">Sonraki</p>
                      <p className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors truncate text-sm">
                        {nextGame.name}
                      </p>
                    </div>
                    <ChevronRight className="text-gray-400 flex-shrink-0" size={18} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <CommentSection gameId={game.id} />
        </div>
      </div>
    </div>
  );
}

export default GameDetail;
