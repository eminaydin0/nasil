import { useState, useEffect } from 'react';
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
import { categoryConfig } from '../../constants';

function HomePage() {
  const { games, loading } = useGames();
  const [categories, setCategories] = useState(['Tümü']);

  useEffect(() => {
    if (games.length > 0) {
      // Standart kategoriler - gereksiz kombinasyonları filtrele
      const standardCategories = [
        'Dış Mekan',
        'İç Mekan',
        'Masa Oyunları',
        'Kağıt Oyunları',
        'Kutu Oyunları',
        'Zeka Oyunları'
      ];
      
      // Sadece standart kategorileri göster
      const uniqueCategories = ['Tümü', ...new Set(
        games
          .map(g => g.category)
          .filter(cat => standardCategories.includes(cat))
      )];
      
      setCategories(uniqueCategories);
    }
  }, [games]);

  useEffect(() => {
    document.title = 'Geleneksel Türk Oyunları - Nasıl Oynanır? Kuralları ve İpuçları';
    
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Nasıl Oynanır",
      "url": "https://nasiloynanir.com",
      "description": "Geleneksel Türk oyunlarının nasıl oynanacağını öğrenin. Okey, Batak, Pişti ve daha fazlası!",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://nasiloynanir.com/?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    trackPageView('/');
  }, []);


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
      <SEO />
      
      <div className="container mx-auto px-4 py-8 space-y-16">
        
        {/* Hero Carousel */}
        <HeroCarousel />
        
        {/* Categories Section */}
        <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Filter className="text-orange-600" />
                Kategorilere Göz At
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.filter(c => c !== 'Tümü').map(category => {
                const config = categoryConfig[category] || categoryConfig['default'];
                const count = games.filter(g => g.category === category).length;
                return (
                  <CategoryCard 
                    key={category}
                    category={category}
                    count={count}
                    icon={config.icon}
                    color={config.color}
                    bgColor={config.bgColor}
                    image={config.image}
                  />
                );
              })}
            </div>
          </section>

        {/* Game of the Day */}
        <section>
             <GameOfTheDay games={games} />
        </section>

        {/* Popular Games */}
        <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Flame className="text-red-500" />
                Popüler Oyunlar
              </h2>
              <a href="#" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
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
        <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
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

