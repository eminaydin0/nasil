import { useState, useEffect } from 'react';
import { Play, Sparkles, TrendingUp, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/**
 * HeroCarousel - hero alanı.
 * Slide yoksa düşmez: marka odaklı statik fallback hero gösterir.
 */
function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);

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
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isRolling]);

  if (loading) {
    return (
      <div className="h-[440px] md:h-[560px] w-full max-w-[1400px] mx-auto bg-gradient-to-br from-cream-100 to-cream-200 rounded-3xl animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Statik fallback hero (slide yoksa)
  if (slides.length === 0) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-warm-900 shadow-soft-xl">
          {/* Aura */}
          <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-orange-500/25 rounded-full blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 w-[24rem] h-[24rem] bg-red-500/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[44rem] bg-amber-500/5 rounded-full blur-[140px]" />

          <div className="relative px-8 py-20 md:px-16 md:py-28 lg:py-32 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/15">
              <Sparkles size={14} className="text-orange-300" />
              <span className="text-cream-100 text-xs font-bold uppercase tracking-[0.2em]">Geleneksel oyunlar arşivi</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
              Her oyunun{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                kuralı burada
              </span>
            </h1>

            <p className="text-cream-100/80 text-lg md:text-xl mb-10 leading-relaxed max-w-xl mx-auto">
              Okey, batak, pişti, mangala ve fazlası — kuralları, ipuçları ve püf noktalarıyla tek çatı altında.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/oyunlar"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-base hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-warm-glow hover:shadow-warm-glow-lg hover:-translate-y-0.5"
              >
                <Compass size={20} />
                <span>Oyunları Keşfet</span>
              </Link>
              <Link
                to="/araclar"
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white rounded-2xl font-semibold transition-all"
              >
                <TrendingUp size={18} />
                <span>Araçlar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      <div className="relative h-[440px] md:h-[560px] overflow-hidden rounded-3xl group bg-gradient-to-br from-charcoal-900 via-warm-900 to-charcoal-950 shadow-soft-xl">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-spring ${
              index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-[1.04]'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image_url}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                width="1400"
                height="560"
                fetchpriority={index === 0 ? 'high' : 'auto'}
              />
              {/* Çoklu gradient overlay (text contrast) */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-900/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/80 via-charcoal-900/30 to-transparent" />
              {/* Radial accent */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(249,115,22,0.18),transparent_55%)]" />
            </div>

            {/* Sıcak parıltılar */}
            <div className="absolute -top-16 -right-16 w-[28rem] h-[28rem] bg-orange-500/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px]" />

            {/* Content */}
            <div className="absolute inset-0 flex items-end p-7 md:p-12 lg:p-16">
              <div
                className={`max-w-2xl transition-all duration-700 delay-200 ease-spring ${
                  index === currentIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {slide.badge && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-5 shadow-warm-glow">
                    <Sparkles size={14} className="text-white" />
                    <span className="text-white font-bold text-[11px] uppercase tracking-[0.2em]">
                      {slide.badge}
                    </span>
                  </div>
                )}

                <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-5 leading-[1.05] tracking-tight">
                  {slide.title}
                </h2>

                <p className="text-cream-100/85 text-base md:text-lg lg:text-xl mb-7 md:mb-8 leading-relaxed max-w-xl">
                  {slide.description}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={slide.button_link}
                    className="inline-flex items-center gap-3 px-7 py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-base hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-warm-glow hover:shadow-warm-glow-lg hover:-translate-y-0.5"
                  >
                    <Play size={18} fill="currentColor" />
                    <span>{slide.button_text || 'Keşfet'}</span>
                  </a>

                  <Link
                    to="/oyunlar"
                    className="inline-flex items-center gap-2 px-6 py-3.5 md:py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white rounded-2xl font-semibold transition-all duration-300"
                  >
                    <TrendingUp size={18} />
                    <span>Tüm Popülerler</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-7 right-7 md:right-12 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsRolling(true);
                setTimeout(() => setIsRolling(false), 2000);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-12 h-2.5 bg-gradient-to-r from-orange-500 to-red-500 shadow-warm-glow'
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Side thumbnails - Desktop only */}
        <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-3">
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
                className={`group relative w-20 h-24 rounded-xl overflow-hidden transition-all duration-300 ${
                  isActive
                    ? 'ring-4 ring-orange-500 scale-110 shadow-warm-glow'
                    : 'ring-2 ring-white/20 hover:ring-white/40 hover:scale-105'
                }`}
                aria-label={`Slide ${index + 1}'e git`}
              >
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {!isActive && <div className="absolute inset-0 bg-charcoal-950/60 group-hover:bg-charcoal-900/40 transition-colors" />}
                {isActive && <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeroCarousel;
