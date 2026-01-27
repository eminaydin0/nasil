import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react'; // Kaydet ikonu için
import { supabase } from '../../lib/supabase';

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length === 0 || isRolling) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Manuel geçişte kısa süreli duraksama veya stabilite için
  const [isRolling, setIsRolling] = useState(false);

  if (loading) {
    return (
      <div className="h-[550px] w-full bg-[#121212] rounded-3xl animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1400px] mx-auto p-4 select-none">
      
      {/* SOL TARAF: ANA SLIDER AREA */}
      <div className="relative flex-1 h-[400px] md:h-[550px] overflow-hidden rounded-3xl group shadow-2xl bg-black">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10 visible' : 'opacity-0 z-0 invisible'
            }`}
          >
            {/* Arka Plan Görseli - Görseldeki gibi tam görünür */}
            <div className="absolute inset-0">
              <img
                src={slide.image_url}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Hafif Karartma Gradiyentleri */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* İçerik Katmanı */}
            <div className="absolute bottom-12 left-8 md:left-12 z-20 max-w-xl">
              <div className={`transition-all duration-700 delay-300 ${
                index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                {/* Badge/Üst Başlık */}
                <p className="text-white font-bold text-xs uppercase tracking-widest mb-3 opacity-90 shadow-sm">
                  {slide.badge || 'BÜYÜK GÜNCELLEME'}
                </p>
                
                {/* Açıklama */}
                <p className="text-gray-100 text-base md:text-lg mb-8 leading-relaxed line-clamp-3 drop-shadow-lg font-medium">
                  {slide.description}
                </p>
                
                {/* Alt Fiyat/Durum Bilgisi */}
                <p className="text-white text-sm mb-4 font-semibold uppercase tracking-wider">
                   Ücretsiz
                </p>

                {/* Butonlar */}
                <div className="flex items-center gap-3">
                  <a
                    href={slide.button_link}
                    className="px-8 py-3.5 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center text-sm uppercase tracking-tight"
                  >
                    {slide.button_text || 'Hemen Oyna'}
                  </a>
                  
                  <button className="p-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/10 group/btn">
                    <Bookmark size={22} className="group-active/btn:scale-90 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SAĞ TARAF: THUMBNAIL NAVİGASYON - Modern & Şık Tasarım */}
      <div className="hidden lg:flex flex-col gap-2.5 w-[300px]">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => {
                setCurrentIndex(index);
                setIsRolling(true);
                setTimeout(() => setIsRolling(false), 2000);
              }}
              className={`relative flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-500 text-left group overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-br from-white to-gray-50 shadow-xl shadow-gray-200/50 scale-[1.02] border-2 border-orange-500/30' 
                  : 'bg-white/90 hover:bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Aktif Kart İçin Sol Kenar İndikatörü */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-l-2xl"></div>
              )}

              {/* Resim Container - Daha Şık */}
              <div className={`relative w-14 h-16 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-500 ${
                isActive 
                  ? 'ring-2 ring-orange-500/30 shadow-lg' 
                  : 'ring-1 ring-gray-200/50 group-hover:ring-gray-300/70'
              }`}>
                <img 
                  src={slide.image_url} 
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isActive 
                      ? 'scale-100' 
                      : 'group-hover:scale-110'
                  }`} 
                  alt={slide.title}
                />
                {/* Gradient Overlay - Daha Profesyonel */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-500 ${
                  isActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                }`}></div>
              </div>

              {/* İçerik Alanı */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                {/* Başlık */}
                <span className={`font-bold leading-tight transition-all duration-300 truncate ${
                  isActive 
                    ? 'text-gray-900 text-[15px]' 
                    : 'text-gray-700 text-sm group-hover:text-gray-900'
                }`}>
                  {slide.title}
                </span>
                
                {/* Badge/Etiket - Sadece Aktif Kartta */}
                {isActive && slide.badge && (
                  <span className="text-xs text-orange-600 font-semibold uppercase tracking-wider mt-0.5">
                    {slide.badge}
                  </span>
                )}
              </div>

              {/* Aktif Kart İçin Ok İşareti */}
              {isActive && (
                <div className="flex-shrink-0 opacity-60">
                  <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}

              {/* Hover Efekti - Subtle Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 transition-all duration-500 pointer-events-none ${
                isActive ? '' : 'group-hover:from-orange-500/5 group-hover:via-orange-500/0 group-hover:to-orange-500/0'
              }`}></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default HeroCarousel;