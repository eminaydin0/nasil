import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import SEO from '../../components/common/SEO';
import Breadcrumb, { BREADCRUMB_TEMPLATES } from '../../components/common/Breadcrumb';
import CommentSection from '../../components/game/CommentSection';
import GameHeader from '../../components/game/GameHeader';
import GameInfo from '../../components/game/GameInfo';
import GameContent from '../../components/game/GameContent';
import GameSidebar from '../../components/game/GameSidebar';
import VideoSection from '../../components/game/VideoSection';
import FAQAccordion from '../../components/game/FAQAccordion';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { trackPageView, trackGameView } from '../../utils/analytics';
import { useGame } from '../../hooks/useGame';
import { supabase } from '../../lib/supabase';
import {
  generateGameSchema,
  generateArticleSchema,
  generateVideoSchema,
  generateFAQSchema,
  SITE_CONFIG,
} from '../../constants/seo';

function GameDetail() {
  const { slug } = useParams();
  const { game, loading, viewCount } = useGame(slug);
  const [games, setGames] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentRatingStats, setCommentRatingStats] = useState({ count: 0, average: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllGames();
  }, []);

  useEffect(() => {
    if (!game?.id) return;

    const loadCommentRatings = async () => {
      const { data } = await supabase
        .from('comments')
        .select('rating')
        .eq('game_id', game.id);

      const ratings = (data || []).filter((c) => c.rating > 0);
      setCommentRatingStats({
        count: ratings.length,
        average: ratings.length
          ? ratings.reduce((sum, c) => sum + c.rating, 0) / ratings.length
          : 0,
      });
    };

    loadCommentRatings();
  }, [game?.id]);

  const loadAllGames = async () => {
    try {
      // Optimize: sadece sidebar/oneri icin gereken alanlar
      const { data: allGames } = await supabase
        .from('games')
        .select('id, slug, name, category, players, difficulty, image, short_description')
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

    const aggregateRating = commentRatingStats.count > 0
      ? { count: commentRatingStats.count, average: commentRatingStats.average }
      : null;

    const schemas = [
      // HowTo Schema - Oyun kuralları için (AggregateRating ile zenginlestirilmis)
      generateGameSchema(game, { aggregateRating }),
      // Article Schema - İçerik için
      generateArticleSchema(game),
      // VideoObject - varsa
      generateVideoSchema(game),
      // FAQPage - varsa
      Array.isArray(game.faq) && game.faq.length > 0 ? generateFAQSchema(game.faq) : null,
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
        ...(aggregateRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: aggregateRating.average.toFixed(2),
            ratingCount: aggregateRating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      },
    ].filter(Boolean);

    return schemas;
  }, [game, commentRatingStats]);

  // Breadcrumb items
  const breadcrumbs = useMemo(() => {
    if (!game) return [];
    return BREADCRUMB_TEMPLATES.gameDetail(game.name, game.category);
  }, [game]);

  // SEO meta bilgileri
  const seoMeta = useMemo(() => {
    if (!game) return {};

    const title = `${game.name} Kuralı Ne?`;
    const description = `${game.name} kuralı ne? ${game.shortDescription || game.description?.substring(0, 120)}. Detaylı oyun kuralları, stratejiler ve püf noktaları.`;
    const keywords = [
      `${game.name} kuralı ne`,
      `${game.name} nasıl oynanır`,
      `${game.name} kuralları`,
      `${game.name} stratejileri`,
      `${game.name} ipuçları`,
      game.category,
      game.difficulty ? `${game.difficulty} oyun` : null,
      game.players,
      'kuralı ne',
      'nasıl oynanır',
      'oyun kuralları',
    ].filter(Boolean).join(', ');

    return { title, description, keywords };
  }, [game]);

  if (!game || loading) {
    return <SkeletonLoader type="game-detail" />;
  }

  return (
    <div className="min-h-screen bg-cream-50">
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

        <VideoSection game={game} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GameContent game={game} />
          <GameSidebar game={game} games={games} />
        </div>

        <div className="mt-6">
          <FAQAccordion game={game} />
        </div>

        {/* Comments Section */}
        <div className="mt-6 w-full overflow-hidden">
          <CommentSection gameId={game.id} gameName={game.name} gameSlug={game.slug} />
        </div>
      </div>
    </div>
  );
}

export default GameDetail;
