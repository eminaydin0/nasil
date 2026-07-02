import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Grid2X2, Sparkles, Compass, Wrench, Gamepad2, Gift } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { SectionHeader } from '../../components/ui';
import GameCard from '../../components/home/GameCard';
import CategoryCard from '../../components/home/CategoryCard';
import HeroCarousel from '../../components/home/HeroCarousel';
import GameOfTheDay from '../../components/home/GameOfTheDay';
import StatsSection from '../../components/home/StatsSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import ToolsSection from '../../components/home/ToolsSection';
import NewsSection from '../../components/home/NewsSection';
import FreeGamesSection from '../../components/home/FreeGamesSection';
import NewsletterSection from '../../components/home/NewsletterSection';
import AboutSection from '../../components/home/AboutSection';
import SkeletonLoader from '../../components/common/SkeletonLoader';
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

const MOBILE_QUICK_LINKS = [
  { to: '/oyunlar', label: 'Oyunlar', icon: Gamepad2 },
  { to: '/ucretsiz-oyunlar', label: 'Bedava', icon: Gift },
  { to: '/araclar', label: 'Araçlar', icon: Wrench },
  { to: '/araclar/halisaha-takim-olusturucu', label: 'Halı Saha', icon: Compass },
];

function HomePage() {
  const { games, loading } = useGames();
  const { categories: dbCategories } = useCategories();

  const categoriesWithCounts = getCategoriesWithCounts(games, dbCategories);

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

  const featuredIds = useMemo(() => {
    const ids = new Set();
    popularGames.forEach((g) => ids.add(g.id));
    newGames.forEach((g) => ids.add(g.id));
    return Array.from(ids);
  }, [popularGames, newGames]);

  const { statsMap } = useGameStats(featuredIds);

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
        <section className="container mx-auto px-3 py-10 sm:px-4 sm:py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="h-72 animate-pulse rounded-2xl bg-cream-100 sm:h-96 sm:rounded-3xl" />
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
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
    <div className="home-scroll-row flex gap-3.5 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-4 md:gap-6">
      {list.map((game) => {
        const stats = statsMap[game.id];
        return (
          <div
            key={game.id}
            className="home-scroll-item w-[min(82vw,300px)] shrink-0 sm:w-auto sm:shrink"
          >
            <GameCard
              game={game}
              rating={stats?.average || 0}
              commentCount={stats?.count || 0}
            />
          </div>
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

      {/* Hero — mobilde kenardan kenara */}
      <section className="bg-cream-50 pb-4 pt-2 sm:pb-8 sm:pt-4 md:pb-10">
        <HeroCarousel />

        {/* Mobil hızlı erişim */}
        <div className="container mx-auto mt-3 px-3 sm:hidden">
          <div className="home-scroll-row flex gap-2 overflow-x-auto pb-0.5">
            {MOBILE_QUICK_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="home-quick-pill home-scroll-item inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold text-warm-800 active:scale-[0.98]"
              >
                <Icon size={15} className="text-orange-600" aria-hidden />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />

      <div className="container mx-auto px-3 sm:px-4">
        {/* Kategoriler — mobilde yatay kaydırma */}
        <section className="py-8 md:py-16" aria-labelledby="categories-title">
          <SectionHeader
            title="Kategoriler"
            subtitle="Keşfet"
            icon={Grid2X2}
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
            link="/oyunlar"
            linkText="Tüm Oyunlar"
          />
          <div className="home-scroll-row flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-6 md:gap-5">
            {categoriesWithCounts.map(({ name, count, icon, color }) => (
              <div
                key={name}
                className="home-scroll-item w-[min(44vw,168px)] shrink-0 sm:w-auto sm:shrink"
              >
                <CategoryCard category={name} count={count} icon={icon} color={color} compact />
              </div>
            ))}
          </div>
        </section>

        <section className="pb-8 md:pb-16" aria-labelledby="gotd-title">
          <GameOfTheDay games={games} />
        </section>

        <FreeGamesSection limit={8} />

        <section
          className="border-t border-warm-200/60 py-8 md:py-16"
          aria-labelledby="popular-title"
        >
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

        <section
          className="border-t border-warm-200/60 py-8 md:py-16"
          aria-labelledby="new-title"
        >
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

        <NewsSection />

        <section className="border-t border-warm-200/60 py-8 md:py-16">
          <ToolsSection />
        </section>

        <section className="border-t border-warm-200/60 py-8 md:py-16">
          <TestimonialsSection />
        </section>

        <section className="border-t border-warm-200/60 py-8 md:py-16">
          <AboutSection />
        </section>
      </div>

      <section className="mt-4 sm:mt-8">
        <NewsletterSection />
      </section>
    </div>
  );
}

export default HomePage;
