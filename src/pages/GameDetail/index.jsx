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
import ErrorPage from '../ErrorPage';
import { trackPageView, trackGameView } from '../../utils/analytics';
import { useGame } from '../../hooks/useGame';
import { supabase } from '../../lib/supabase';
import {
  buildGameSeoMeta,
  buildGameStructuredData,
} from '../../lib/seoEngine';

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

  const aggregateRating = useMemo(() => (
    commentRatingStats.count > 0
      ? { count: commentRatingStats.count, average: commentRatingStats.average }
      : null
  ), [commentRatingStats]);

  const structuredData = useMemo(() => {
    if (!game) return null;
    return buildGameStructuredData(game, { aggregateRating });
  }, [game, aggregateRating]);

  const breadcrumbs = useMemo(() => {
    if (!game) return [];
    return BREADCRUMB_TEMPLATES.gameDetail(game.name, game.category);
  }, [game]);

  const seoMeta = useMemo(() => {
    if (!game) return {};
    return buildGameSeoMeta(game, { aggregateRating });
  }, [game, aggregateRating]);

  if (loading) {
    return <SkeletonLoader type="game-detail" />;
  }

  if (!game) {
    return (
      <ErrorPage
        status={404}
        title="Oyun Bulunamadı"
        message="Aradığınız oyun rehberi mevcut değil veya kaldırılmış olabilir."
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <SEO
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        image={seoMeta.image}
        url={seoMeta.url}
        type="article"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        publishedTime={seoMeta.publishedTime}
        modifiedTime={seoMeta.modifiedTime}
        section={seoMeta.section}
        tags={seoMeta.tags}
      />

      <GameHeader
        game={game}
        viewCount={viewCount}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
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
