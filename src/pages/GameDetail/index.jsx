import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import SEO from '../../components/common/SEO';
import Breadcrumb, { BREADCRUMB_TEMPLATES } from '../../components/common/Breadcrumb';
import CommentSection from '../../components/game/CommentSection';
import GameHeader from '../../components/game/GameHeader';
import GameInfo from '../../components/game/GameInfo';
import GameContent from '../../components/game/GameContent';
import GameSidebar from '../../components/game/GameSidebar';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { trackPageView, trackGameView } from '../../utils/analytics';
import { useGame } from '../../hooks/useGame';
import { supabase } from '../../lib/supabase';
import { 
  generateGameSchema, 
  generateArticleSchema, 
  SITE_CONFIG 
} from '../../constants/seo';

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
          tips: g.tips,
          createdAt: g.created_at,
          updatedAt: g.updated_at,
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

  // Gelişmiş Structured Data
  const structuredData = useMemo(() => {
    if (!game) return null;

    return [
      // HowTo Schema - Oyun kuralları için
      generateGameSchema(game),
      // Article Schema - İçerik için
      generateArticleSchema(game),
      // Game Schema
      {
        '@context': 'https://schema.org',
        '@type': 'Game',
        name: game.name,
        description: game.shortDescription || game.description,
        image: game.image,
        url: `${SITE_CONFIG.url}/oyun/${game.slug}`,
        genre: game.category,
        numberOfPlayers: {
          '@type': 'QuantitativeValue',
          value: game.players,
        },
        gamePlatform: 'Tabletop',
        applicationCategory: 'Game',
        inLanguage: 'tr',
        author: {
          '@type': 'Organization',
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
        },
      },
    ].filter(Boolean);
  }, [game]);

  // Breadcrumb items
  const breadcrumbs = useMemo(() => {
    if (!game) return [];
    return BREADCRUMB_TEMPLATES.gameDetail(game.name, game.category);
  }, [game]);

  // SEO meta bilgileri
  const seoMeta = useMemo(() => {
    if (!game) return {};
    
    const title = `${game.name} Nasıl Oynanır?`;
    const description = `${game.name} nasıl oynanır? ${game.shortDescription || game.description?.substring(0, 120)}. Detaylı oyun kuralları, stratejiler ve püf noktaları.`;
    const keywords = [
      `${game.name} nasıl oynanır`,
      `${game.name} kuralları`,
      `${game.name} stratejileri`,
      `${game.name} ipuçları`,
      game.category,
      game.difficulty ? `${game.difficulty} oyun` : null,
      game.players,
      'nasıl oynanır',
      'oyun kuralları',
    ].filter(Boolean).join(', ');

    return { title, description, keywords };
  }, [game]);

  if (!game || loading) {
    return <SkeletonLoader type="game-detail" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        image={game.image}
        url={`/oyun/${game.slug}`}
        type="article"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        publishedTime={game.createdAt}
        modifiedTime={game.updatedAt}
        section={game.category}
        tags={[game.name, game.category, 'oyun kuralları', 'nasıl oynanır']}
      />
      
      <GameHeader 
        game={game} 
        viewCount={viewCount} 
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

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
