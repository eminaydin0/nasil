import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, Trophy, Shield, Star, Flame, Clock, Award } from 'lucide-react';
import GameCard from '../../components/home/GameCard';
import CategoryCard from '../../components/home/CategoryCard';
import HeroCarousel from '../../components/home/HeroCarousel';
import GameOfTheDay from '../../components/home/GameOfTheDay';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { trackPageView } from '../../utils/analytics';
import { supabase } from '../../lib/supabase';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('kategori') || 'Tümü');
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState(['Tümü']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const category = searchParams.get('kategori');
    if (category) {
      setSelectedCategory(category);
      // Scroll to games section if a category is selected via URL
      setTimeout(() => {
        const gamesSection = document.getElementById('oyunlar');
        if (gamesSection) {
          gamesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setSelectedCategory('Tümü');
    }
  }, [searchParams]);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      const formattedGames = data.map(game => ({
        id: game.id,
        slug: game.slug,
        name: game.name,
        category: game.category,
        players: game.players,
        difficulty: game.difficulty,
        image: game.image,
        shortDescription: game.short_description,
        description: game.description,
        rules: game.rules,
        tips: game.tips
      }));
      
      setGames(formattedGames);
      
      const uniqueCategories = ['Tümü', ...new Set(formattedGames.map(g => g.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading games from Supabase:', error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'Tümü' || game.category === selectedCategory;
    return matchesCategory;
  });

  const categoryConfig = {
    'Dış Mekan': { 
      icon: '🌳', 
      color: 'green', 
      bgColor: 'bg-green-50',
      image: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?q=80&w=2070&auto=format&fit=crop'
    },
    'İç Mekan': { 
      icon: '🏠', 
      color: 'blue', 
      bgColor: 'bg-blue-50',
      image: 'https://images.unsplash.com/photo-1560420025-9a327c4418d4?q=80&w=1974&auto=format&fit=crop'
    },
    'Masa Oyunları': { 
      icon: '🎲', 
      color: 'purple', 
      bgColor: 'bg-purple-50',
      image: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?q=80&w=2000&auto=format&fit=crop'
    },
    'Kağıt Oyunları': { 
      icon: '🃏', 
      color: 'red', 
      bgColor: 'bg-red-50',
      image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop'
    },
    'Kutu Oyunları': { 
      icon: '📦', 
      color: 'orange', 
      bgColor: 'bg-orange-50',
      image: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=2070&auto=format&fit=crop'
    },
    'Zeka Oyunları': { 
      icon: '🧠', 
      color: 'indigo', 
      bgColor: 'bg-indigo-50',
      image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2070&auto=format&fit=crop'
    },
    'default': { 
      icon: '🎮', 
      color: 'gray', 
      bgColor: 'bg-gray-50',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop'
    }
  };

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

  // Popular Games (Simulated by taking slice)
  const popularGames = games.slice(1, 5);
  
  // New Arrivals (Simulated by taking another slice)
  const newGames = games.slice(5, 9);

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      
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

        {/* All Games / Search Results */}
        <section id="oyunlar">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Tüm Oyunlar
            </h2>
            
            {/* Category Filter Tabs */}
            <div className="hidden md:flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    if (category === 'Tümü') {
                      setSearchParams({});
                    } else {
                      setSearchParams({ kategori: category });
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Oyun bulunamadı</h3>
              <p className="text-gray-500">Aramanızla eşleşen oyun bulunamadı. Farklı bir arama yapın.</p>
            </div>
          )}
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* About Section */}
        <section id="hakkinda" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-6">
                <Award size={18} />
                Kültürel Mirasımız
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Geleneksel Oyunlarımızı Yaşatıyoruz
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Geleneksel Türk oyunları, yüzyıllardır nesilden nesile aktarılan kültürel mirasımızın önemli bir parçasıdır.
                </p>
                <p>
                  Teknolojinin hızla geliştiği günümüzde, bu geleneksel oyunları dijital ortamda belgeleyerek gelecek
                  nesillere aktarmak ve yaşatmak istiyoruz.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                      User
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900">500+ Oyuncu</p>
                  <p className="text-gray-500">Topluluğumuza katılın</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop" 
                  alt="Traditional Games" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// Testimonials Section Component
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('id, name');
      
      if (gamesError) throw gamesError;
      
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('is_testimonial', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (commentsError) throw commentsError;
      
      const formattedTestimonials = (commentsData || []).map(comment => {
        const game = gamesData.find(g => g.id === comment.game_id);
        return {
          name: comment.author_name,
          comment: comment.content,
          rating: comment.rating,
          gameName: game?.name || 'Bilinmeyen Oyun'
        };
      });
      
      setTestimonials(formattedTestimonials);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setTestimonials([]);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (testimonials.length === 0) return null;

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Oyuncu Yorumları</h2>
        <p className="text-gray-600">
          Platformumuzu kullanan oyun severlerin deneyimleri
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1 text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < testimonial.rating ? 'fill-yellow-400' : 'fill-gray-200 text-gray-200'}
                />
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed mb-6 min-h-[80px]">"{testimonial.comment}"</p>
            <div className="flex items-center space-x-3 pt-6 border-t border-gray-50">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {getInitials(testimonial.name)}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.gameName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomePage;

