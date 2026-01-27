import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import SEO from '../../components/common/SEO';
import CommentSection from '../../components/game/CommentSection';
import GameHeader from '../../components/game/GameHeader';
import GameInfo from '../../components/game/GameInfo';
import GameContent from '../../components/game/GameContent';
import GameSidebar from '../../components/game/GameSidebar';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { trackPageView, trackGameView } from '../../utils/analytics';
import { useGame } from '../../hooks/useGame';
import { supabase } from '../../lib/supabase';

function GameDetail() {
  const { slug } = useParams();
  const { game, loading, viewCount } = useGame(slug);
  const [games, setGames] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllGames();
  }, []);

  const loadAllGames = async () => {
    try {
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
    } catch (error) {
      console.error('Error loading games:', error);
    }
  };

  useEffect(() => {
    if (game) {
      trackPageView(`/oyun/${game.slug}`);
      trackGameView(game.name, game.id);
    }
  }, [game]);

  const structuredData = useMemo(() => {
    if (!game) return null;

    return {
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
  }, [game]);

  if (!game || loading) {
    return <SkeletonLoader type="game-detail" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={`${game.name} Nasıl Oynanır?`}
        description={`${game.name} nasıl oynanır? ${game.shortDescription}. Detaylı oyun kuralları, stratejiler ve püf noktaları.`}
        keywords={`${game.name} nasıl oynanır, ${game.name} kuralları, ${game.name} stratejileri, ${game.category}, ${game.difficulty} oyun, ${game.players}`}
        image={game.image}
        url={`/oyun/${game.slug}`}
        type="article"
        structuredData={structuredData}
      />
      
      <GameHeader 
        game={game} 
        viewCount={viewCount} 
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      <div className="container mx-auto px-4 py-12">
        <GameInfo game={game} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GameContent game={game} />
          <GameSidebar game={game} games={games} />
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <CommentSection gameId={game.id} gameName={game.name} />
        </div>
      </div>
    </div>
  );
}

export default GameDetail;
