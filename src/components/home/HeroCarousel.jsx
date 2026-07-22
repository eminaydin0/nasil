import { useState, useEffect } from 'react';
import { Play, Sparkles, TrendingUp, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/** Eski #oyunlar formatını ve göreli yolları SPA rotasına çevirir */
function normalizeSlideHref(link) {
  if (!link || !String(link).trim()) return '/oyunlar';
  const raw = String(link).trim();
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('#')) {
    const path = raw.slice(1);
    return path.startsWith('/') ? path : `/${path}`;
  }
  return raw.startsWith('/') ? raw : `/${raw}`;
}

function SlideCtaButton({ href, className, children }) {
  const target = normalizeSlideHref(href);
  if (target.startsWith('http://') || target.startsWith('https://')) {
    return (
      <a href={target} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={target} className={className}>
      {children}
    </Link>
  );
}

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
      <div className="mx-auto h-[min(68vh,400px)] w-full max-w-[1400px] animate-pulse rounded-2xl bg-gradient-to-br from-cream-100 to-cream-200 px-3 sm:h-[440px] sm:rounded-3xl sm:px-4 md:h-[560px] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  // Statik fallback hero (slide yoksa)
  if (slides.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-warm-900 shadow-soft-xl sm:rounded-3xl">
          {/* Aura */}
          <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-orange-500/25 rounded-full blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 w-[24rem] h-[24rem] bg-red-500/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[44rem] bg-amber-500/5 rounded-full blur-[140px]" />

          <div className="relative mx-auto max-w-3xl px-5 py-12 text-center sm:px-8 sm:py-20 md:px-16 md:py-28 lg:py-32">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-md sm:mb-6 sm:px-4 sm:py-2">
              <Sparkles size={14} className="text-orange-300" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream-100 sm:text-xs sm:tracking-[0.2em]">
                Geleneksel oyunlar arşivi
              </span>
            </div>

            <h1 className="mb-5 text-[1.65rem] font-extrabold leading-[1.08] tracking-tight text-white sm:mb-6 sm:text-4xl md:text-6xl lg:text-7xl">
              Her oyunun{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                kuralı burada
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-cream-100/80 sm:mb-10 md:text-xl">
              Okey, batak, pişti, mangala ve fazlası — kuralları, ipuçları ve püf noktalarıyla tek çatı altında.
            </p>

            <div className="flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                to="/oyunlar"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3.5 text-base font-bold text-white shadow-warm-glow transition-all duration-300 hover:-translate-y-0.5 hover:from-orange-600 hover:to-red-600 hover:shadow-warm-glow-lg sm:px-8 sm:py-4"
              >
                <Compass size={20} />
                <span>Oyunları Keşfet</span>
              </Link>
              <Link
                to="/araclar"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 sm:px-6 sm:py-4"
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
    <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4">
      <div className="group relative h-[min(68vh,420px)] overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal-900 via-warm-900 to-charcoal-950 shadow-soft-xl sm:h-[440px] sm:rounded-3xl md:h-[560px]">
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
            <div className="absolute inset-0 flex items-end p-4 pb-12 sm:p-7 sm:pb-7 md:p-12 lg:p-16">
              <div
                className={`max-w-2xl transition-all duration-700 delay-200 ease-spring ${
                  index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {slide.badge && (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 shadow-warm-glow sm:mb-5 sm:px-4 sm:py-2">
                    <Sparkles size={13} className="text-white sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white sm:text-[11px] sm:tracking-[0.2em]">
                      {slide.badge}
                    </span>
                  </div>
                )}

                <h2 className="mb-2 text-lg font-extrabold leading-[1.1] tracking-tight text-white sm:mb-3.5 sm:text-2xl md:mb-4 md:text-4xl lg:text-5xl">
                  {slide.title}
                </h2>

                <p className="mb-5 line-clamp-2 max-w-xl text-sm leading-relaxed text-cream-100/85 sm:mb-7 sm:line-clamp-none sm:text-base md:mb-8 md:text-lg lg:text-xl">
                  {slide.description}
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  <SlideCtaButton
                    href={slide.button_link}
                    className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-bold text-white shadow-warm-glow transition-all duration-300 hover:-translate-y-0.5 hover:from-orange-600 hover:to-red-600 hover:shadow-warm-glow-lg sm:px-7 sm:py-3.5 sm:text-base md:px-8 md:py-4"
                  >
                    <Play size={16} fill="currentColor" className="sm:w-[18px] sm:h-[18px]" />
                    <span>{slide.button_text || 'Keşfet'}</span>
                  </SlideCtaButton>

                  <Link
                    to="/oyunlar"
                    className="hidden items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15 sm:inline-flex sm:px-6 sm:py-3.5 sm:text-base md:py-4"
                  >
                    <TrendingUp size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span>Tüm Popülerler</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-0.5 sm:bottom-7 sm:left-auto sm:translate-x-0 sm:right-7 sm:gap-2 md:right-12">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setCurrentIndex(index);
                setIsRolling(true);
                setTimeout(() => setIsRolling(false), 2000);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full sm:h-auto sm:w-auto sm:p-0"
              aria-label={`Slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'h-2.5 w-12 bg-gradient-to-r from-orange-500 to-red-500 shadow-warm-glow'
                    : 'h-3 w-3 bg-white/30 sm:h-2.5 sm:w-2.5 hover:bg-white/50'
                }`}
                aria-hidden
              />
            </button>
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
