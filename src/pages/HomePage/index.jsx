import { useState, useEffect, useMemo } from 'react';
import { Filter, Flame, Clock } from 'lucide-react';
import SEO from '../../components/common/SEO';
import GameCard from '../../components/home/GameCard';
import CategoryCard from '../../components/home/CategoryCard';
import HeroCarousel from '../../components/home/HeroCarousel';
import GameOfTheDay from '../../components/home/GameOfTheDay';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import ToolsSection from '../../components/home/ToolsSection';
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

  // DB veya constants'tan, mantıksal sırayla, sadece oyunu olan kategoriler
  const categoriesWithCounts = getCategoriesWithCounts(games, dbCategories);

  useEffect(() => {
    trackPageView('/');
  }, []);

  // Structured Data
  const structuredData = useMemo(() => {
    const schemas = [
      // Website Schema
      SCHEMA_TEMPLATES.website,
      // Organization Schema
      SCHEMA_TEMPLATES.organization,
    ];

    // Oyun listesi schema (eğer oyunlar yüklendiyse)
    if (games.length > 0) {
      schemas.push(generateItemListSchema(games, 'Popüler Oyunlar'));
    }

    // FAQ Schema - Sık sorulan sorular
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
      <div className="min-h-screen bg-gray-50">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-96 bg-gray-200 rounded-2xl animate-shimmer"></div>
            <div className="grid md:grid-cols-3 gap-6">
              <SkeletonLoader type="game-card" />
              <SkeletonLoader type="game-card" />
              <SkeletonLoader type="game-card" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Popular Games: Sort by views (descending)
  const popularGames = [...games]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);
  
  // New Arrivals: Sort by created date (descending)
  const newGames = [...games]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <SEO 
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        keywords={PAGE_SEO.home.keywords}
        url="/"
        structuredData={structuredData}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-16">
        
        {/* Hero Carousel */}
        <HeroCarousel />
        
        {/* Categories Section - Mantıksal sıra: Kağıt, Masa, Kutu, Zeka, Dış Mekan, İç Mekan */}
        <section aria-labelledby="categories-title">
          <div className="flex items-center justify-between mb-8">
            <h2 id="categories-title" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Filter className="text-orange-600" />
              Kategorilere Göz At
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
        <section aria-labelledby="gotd-title">
          <GameOfTheDay games={games} />
        </section>

        {/* Popular Games */}
        <section aria-labelledby="popular-title">
          <div className="flex items-center justify-between mb-8">
            <h2 id="popular-title" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Flame className="text-red-500" />
              Popüler Oyunlar
            </h2>
            <a 
              href="/oyunlar" 
              className="text-sm font-semibold text-orange-600 hover:text-orange-700"
              aria-label="Tüm oyunları görüntüle"
            >
              Tümünü Gör →
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section aria-labelledby="new-title">
          <div className="flex items-center justify-between mb-8">
            <h2 id="new-title" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="text-blue-500" />
              Yeni Eklenenler
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <ToolsSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* About Section */}
        <AboutSection />

      </div>
    </div>
  );
}

export default HomePage;
