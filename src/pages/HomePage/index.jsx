import { useEffect, useMemo } from 'react';
import { Flame, Grid2X2, Sparkles } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { SectionHeader } from '../../components/ui';
import GameCard from '../../components/home/GameCard';
import CategoryCard from '../../components/home/CategoryCard';
import HeroCarousel from '../../components/home/HeroCarousel';
import GameOfTheDay from '../../components/home/GameOfTheDay';
import StatsSection from '../../components/home/StatsSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import ToolsSection from '../../components/home/ToolsSection';
import NewsletterSection from '../../components/home/NewsletterSection';
import AboutSection from '../../components/home/AboutSection';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { trackPageView } from '../../utils/analytics';
import { useGames } from '../../hooks/useGames';
import { useGameStats } from '../../hooks/useGameStats';
import { getCategoriesWithCounts } from '../../constants/categories';
import { useCategories } from '../../hooks/useCategories';
import {
  PAGE_SEO,
  SCHEMA_TEMPLATES,
  generateItemListSchema,
  generateFAQSchema,
} from '../../constants/seo';
import { buildHomeSeoMeta, buildHomeFaqs } from '../../lib/seoEngine';

function HomePage() {
  const { games, loading } = useGames();
  const { categories: dbCategories } = useCategories();

  const categoriesWithCounts = getCategoriesWithCounts(games, dbCategories);

  // Popüler & Yeni
  const popularGames = useMemo(
    () =>
      [...games]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 4),
    [games]
  );

  const newGames = useMemo(
    () =>
      [...games]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4),
    [games]
  );

  // İki ızgaranın oyun id'lerini batch'le çek (N+1 fix)
  const featuredIds = useMemo(() => {
    const ids = new Set();
    popularGames.forEach((g) => ids.add(g.id));
    newGames.forEach((g) => ids.add(g.id));
    return Array.from(ids);
  }, [popularGames, newGames]);

  const { statsMap } = useGameStats(featuredIds);

  useEffect(() => {
    trackPageView('/');
  }, []);

  const homeSeo = useMemo(() => buildHomeSeoMeta(games), [games]);

  const structuredData = useMemo(() => {
    const schemas = [SCHEMA_TEMPLATES.website, SCHEMA_TEMPLATES.organization];

    if (games.length > 0) {
      const byViews = [...games].sort((a, b) => (b.views || 0) - (a.views || 0));
      schemas.push(generateItemListSchema(byViews.slice(0, 10), 'Popüler Oyunlar'));
    }

    schemas.push(generateFAQSchema(buildHomeFaqs(games)));

    return schemas;
  }, [games]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-96 bg-cream-100 rounded-3xl animate-pulse" />
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonLoader key={i} type="game-card" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const renderGameGrid = (list) => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
      {list.map((game) => {
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
  );

  return (
    <div className="min-h-screen bg-cream-50 page-transition">
      <SEO
        title={PAGE_SEO.home.title}
        description={homeSeo.description}
        keywords={homeSeo.keywords || PAGE_SEO.home.keywords}
        url="/"
        structuredData={structuredData}
      />

      {/* Hero */}
      <section className="bg-cream-50 pt-4 pb-8 sm:pt-6 sm:pb-10 md:pb-14">
        <HeroCarousel />
      </section>

      {/* Stats */}
      <StatsSection />

      <div className="container mx-auto px-4">
        {/* Categories */}
        <section className="py-10 md:py-16" aria-labelledby="categories-title">
          <SectionHeader
            title="Kategoriler"
            subtitle="Keşfet"
            icon={Grid2X2}
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
            link="/oyunlar"
            linkText="Tüm Oyunlar"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {categoriesWithCounts.map(({ name, count, icon, color }) => (
              <CategoryCard key={name} category={name} count={count} icon={icon} color={color} />
            ))}
          </div>
        </section>

        {/* Game of the Day */}
        <section className="pb-12 md:pb-16" aria-labelledby="gotd-title">
          <GameOfTheDay games={games} />
        </section>

        {/* Popular */}
        <section className="py-12 md:py-16 border-t border-warm-200/60" aria-labelledby="popular-title">
          <SectionHeader
            title="Popüler Oyunlar"
            subtitle="En çok okunanlar"
            icon={Flame}
            iconColor="text-red-500"
            iconBg="bg-red-50"
            link="/oyunlar"
            linkText="Tüm Oyunlar"
          />
          {renderGameGrid(popularGames)}
        </section>

        {/* New */}
        <section className="py-12 md:py-16 border-t border-warm-200/60" aria-labelledby="new-title">
          <SectionHeader
            title="Yeni Eklenenler"
            subtitle="Son güncelleme"
            icon={Sparkles}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
            link="/oyunlar"
            linkText="Tüm Oyunlar"
          />
          {renderGameGrid(newGames)}
        </section>

        {/* Tools */}
        <section className="py-12 md:py-16 border-t border-warm-200/60">
          <ToolsSection />
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-16 border-t border-warm-200/60">
          <TestimonialsSection />
        </section>

        {/* About */}
        <section className="py-12 md:py-16 border-t border-warm-200/60">
          <AboutSection />
        </section>
      </div>

      {/* Newsletter - full width */}
      <section className="mt-8">
        <NewsletterSection />
      </section>
    </div>
  );
}

export default HomePage;
