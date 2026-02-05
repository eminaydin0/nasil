import { useState, useEffect, useMemo } from 'react';
import { Flame, Clock, Grid2X2, Sparkles } from 'lucide-react';
import SEO from '../../components/common/SEO';
import SectionHeader from '../../components/common/SectionHeader';
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
import { getCategoriesWithCounts } from '../../constants/categories';
import { useCategories } from '../../hooks/useCategories';
import { 
  PAGE_SEO, 
  SCHEMA_TEMPLATES, 
  generateItemListSchema,
  generateFAQSchema 
} from '../../constants/seo';

function HomePage() {
  const { games, loading } = useGames();
  const { categories: dbCategories } = useCategories();

  const categoriesWithCounts = getCategoriesWithCounts(games, dbCategories);

  useEffect(() => {
    trackPageView('/');
  }, []);

  // Structured Data
  const structuredData = useMemo(() => {
    const schemas = [
      SCHEMA_TEMPLATES.website,
      SCHEMA_TEMPLATES.organization,
    ];

    if (games.length > 0) {
      schemas.push(generateItemListSchema(games, 'Popüler Oyunlar'));
    }

    const faqs = [
      {
        question: 'Okey nasıl oynanır?',
        answer: 'Okey, 4 kişiyle oynanan geleneksel bir Türk masa oyunudur. 106 taş ve 2 sahte okey ile oynanır. Amaç, taşları gruplar veya seriler halinde düzenleyerek eli kapatmaktır.',
      },
      {
        question: 'Batak nasıl oynanır?',
        answer: 'Batak, 4 kişiyle 52 kartlık deste ile oynanan bir kart oyunudur. Oyuncular sırayla koz belirler ve el almaya çalışırlar. En yüksek kartı oynayan el alır.',
      },
      {
        question: 'Pişti nasıl oynanır?',
        answer: 'Pişti, 2-4 kişiyle oynanan hızlı tempolu bir kart oyunudur. Amaç, masadaki kartları toplayarak puan kazanmaktır. Vale ve Pistikarları özel puan getirir.',
      },
    ];
    schemas.push(generateFAQSchema(faqs));

    return schemas;
  }, [games]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-96 bg-gray-100 rounded-3xl animate-pulse"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <SkeletonLoader key={i} type="game-card" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Popular & New Games
  const popularGames = [...games]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);
  
  const newGames = [...games]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white page-transition">
      <SEO 
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        keywords={PAGE_SEO.home.keywords}
        url="/"
        structuredData={structuredData}
      />
      
      {/* Hero Carousel - Full width */}
      <section className="bg-gray-50 pt-6 pb-12">
        <HeroCarousel />
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Main Content */}
      <div className="container mx-auto px-4">
        
        {/* Categories */}
        <section className="py-16" aria-labelledby="categories-title">
          <SectionHeader
            title="Kategoriler"
            subtitle="Keşfet"
            icon={Grid2X2}
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {categoriesWithCounts.map(({ name, count, icon, image }) => (
              <CategoryCard
                key={name}
                category={name}
                count={count}
                icon={icon}
                image={image}
              />
            ))}
          </div>
        </section>

        {/* Game of the Day */}
        <section className="pb-16" aria-labelledby="gotd-title">
          <GameOfTheDay games={games} />
        </section>

        {/* Popular Games */}
        <section className="py-16 border-t border-gray-100" aria-labelledby="popular-title">
          <SectionHeader
            title="Popüler Oyunlar"
            subtitle="En çok okunanlar"
            icon={Flame}
            iconColor="text-red-500"
            iconBg="bg-red-50"
            link="/oyunlar"
            linkText="Tüm Oyunlar"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16 border-t border-gray-100" aria-labelledby="new-title">
          <SectionHeader
            title="Yeni Eklenenler"
            subtitle="Son güncelleme"
            icon={Sparkles}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-16 border-t border-gray-100">
          <ToolsSection />
        </section>

        {/* Testimonials Section */}
        <section className="py-16 border-t border-gray-100">
          <TestimonialsSection />
        </section>

        {/* About Section */}
        <section className="py-16 border-t border-gray-100">
          <AboutSection />
        </section>
      </div>

      {/* Newsletter - Full width */}
      <section className="mt-8">
        <NewsletterSection />
      </section>
    </div>
  );
}

export default HomePage;
