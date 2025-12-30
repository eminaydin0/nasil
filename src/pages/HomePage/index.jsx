import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Sparkles, Trophy, Shield, Star } from 'lucide-react';
import GameCard from '../../components/home/GameCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { trackPageView, trackGameSearch } from '../../utils/analytics';
import { supabase } from '../../lib/supabase';

function HomePage({ searchTerm, setSearchTerm }) {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState(['Tümü']);
  const [loading, setLoading] = useState(true);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    loadGames();
  }, []);

  // Track search with debounce
  useEffect(() => {
    if (searchTerm && searchTerm.length > 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(() => {
        trackGameSearch(searchTerm);
      }, 1000); // Track after 1 second of no typing
    }
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const loadGames = async () => {
    try {
      // Supabase'den oyunları çek
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      // Supabase field names'i JavaScript format'a çevir
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
      
      // Kategorileri otomatik olarak oyunlardan çıkar
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
    loadGames();
    
    // Set homepage SEO
    document.title = 'Geleneksel Türk Oyunları - Nasıl Oynanır? Kuralları ve İpuçları';
    
    // Add structured data for the website
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
    
    // Track page view
    trackPageView('/');
  }, []);

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'Tümü' || game.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-96 bg-gray-200 rounded-2xl animate-shimmer"></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <SkeletonLoader type="game-card" />
                  <SkeletonLoader type="game-card" />
                </div>
              </div>
              <div className="space-y-4">
                <SkeletonLoader type="game-card" />
                <SkeletonLoader type="game-card" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      {/* Games Grid - Blog Style Layout */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {filteredGames.length > 0 ? (
            <>
              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Featured & Large Cards */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Featured Hero Post */}
                  {selectedCategory === 'Tümü' && filteredGames[0] && (
                    <a 
                      href={`/oyun/${filteredGames[0].slug}`}
                      className="block group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-96 overflow-hidden">
                        <img 
                          src={filteredGames[0].image} 
                          alt={filteredGames[0].name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-2 bg-white text-gray-900 text-xs font-bold rounded-lg">
                            ÖNE ÇIKAN
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-lg mb-3">
                            {filteredGames[0].category}
                          </span>
                          <h2 className="text-3xl font-bold text-white mb-3">{filteredGames[0].name}</h2>
                          <p className="text-white/90 mb-4 line-clamp-2">{filteredGames[0].shortDescription}</p>
                          <div className="flex items-center text-white/80 text-sm">
                            <span>{filteredGames[0].players}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  )}

                  {/* Large Cards - 2 Column Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredGames.slice(selectedCategory === 'Tümü' ? 1 : 0, selectedCategory === 'Tümü' ? 7 : 6).map(game => (
                      <a
                        key={game.id}
                        href={`/oyun/${game.slug}`}
                        className="block group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={game.image} 
                            alt={game.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-5">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg mb-3">
                            {game.category}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                            {game.name}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{game.shortDescription}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{game.players}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right Sidebar - Small Cards */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Diğer Oyunlar</h3>
                    <div className="space-y-4">
                      {filteredGames.slice(selectedCategory === 'Tümü' ? 7 : 6, selectedCategory === 'Tümü' ? 15 : 14).map(game => (
                        <a
                          key={game.id}
                          href={`/oyun/${game.slug}`}
                          className="flex gap-4 group"
                        >
                          <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                            <img 
                              src={game.image} 
                              alt={game.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded mb-1">
                              {game.category}
                            </span>
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
                              {game.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{game.players}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Grid - Remaining Games */}
              {filteredGames.length > (selectedCategory === 'Tümü' ? 15 : 14) && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Tüm Oyunlar</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {filteredGames.slice(selectedCategory === 'Tümü' ? 15 : 14).map(game => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Oyun bulunamadı</h3>
              <p className="text-gray-500">Aramanızla eşleşen oyun bulunamadı. Farklı bir arama yapın.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* About Section */}
      <section id="hakkinda" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-12 shadow-sm relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-white/10 rounded-xl p-4">
                    <Trophy className="text-white" size={40} />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-white mb-8 text-center">Hakkımızda</h2>
                <div className="space-y-6 text-white/90 leading-relaxed">
                  <p className="text-lg">
                    Geleneksel Türk oyunları, yüzyıllardır nesilden nesile aktarılan <strong className="font-semibold text-white">kültürel mirasımızın</strong> önemli bir parçasıdır.
                    Bu oyunlar, sadece eğlence amaçlı değil, aynı zamanda çocukların fiziksel, zihinsel ve sosyal gelişimlerine
                    katkı sağlayan değerli aktivitelerdir.
                  </p>
                  <p className="text-lg">
                    Teknolojinin hızla geliştiği günümüzde, bu geleneksel oyunları dijital ortamda belgeleyerek gelecek
                    nesillere aktarmak ve yaşatmak istiyoruz. Her oyunun detaylı kuralları, ipuçları ve nasıl oynandığı
                    hakkında bilgiler bu platformda bir araya getirilmiştir.
                  </p>
                  <div className="bg-white/10 rounded-xl p-6 border-l-4 border-white mt-8">
                    <p className="font-semibold text-white text-lg flex items-start">
                      <Shield className="mr-3 shrink-0 mt-1" size={24} />
                      <span>Unutmayalım ki, bu oyunlar sadece çocukluğumuzun anıları değil, kültürümüzün yaşayan parçalarıdır.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hemen Keşfetmeye Başlayın
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              30 farklı geleneksel oyunu inceleyin, kurallarını öğrenin ve deneyimlerinizi paylaşın!
            </p>
            <a 
              href="#oyunlar" 
              className="inline-flex items-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-sm"
            >
              <span>Oyunları Keşfet</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Testimonials Section Component
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      // Önce oyunları çek (gameName için)
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('id, name');
      
      if (gamesError) throw gamesError;
      
      // Testimonial yorumları çek
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('is_testimonial', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (commentsError) {
        console.error('Error fetching testimonials:', commentsError);
        throw commentsError;
      }
      
      console.log('Testimonials from Supabase:', commentsData);
      
      // Yorumları formatla ve oyun isimlerini ekle
      const formattedTestimonials = (commentsData || []).map(comment => {
        const game = gamesData.find(g => g.id === comment.game_id);
        return {
          name: comment.author_name,
          comment: comment.content,
          rating: comment.rating,
          gameName: game?.name || 'Bilinmeyen Oyun'
        };
      });
      
      console.log('Formatted testimonials:', formattedTestimonials);
      setTestimonials(formattedTestimonials);
    } catch (error) {
      console.error('Error loading testimonials from Supabase:', error);
      // Hata durumunda bile boş array set et, default'ları kullanacak
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

  const displayTestimonials = testimonials.length > 0 ? testimonials : [];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kullanıcı Yorumları</h2>
            <p className="text-gray-600">
              Platformumuzu kullanan kullanıcıların deneyimleri
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.length > 0 ? (
              displayTestimonials.slice(0, 3).map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(testimonial.name)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.gameName}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">"{testimonial.comment}"</p>
                  <div className="flex mt-4 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < testimonial.rating ? 'fill-yellow-400' : 'fill-gray-300 text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Henüz testimonial yorum bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
