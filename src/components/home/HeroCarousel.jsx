import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, ChevronRight, Compass, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AUTO_MS = 6500;

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

function padIndex(n) {
  return String(n).padStart(2, '0');
}

/**
 * HeroCarousel — editorial film-strip hero.
 * Slide yoksa marka odaklı fallback gösterir.
 */
function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

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

  const goTo = useCallback((index) => {
    setCurrentIndex(index);
    setPaused(true);
    window.setTimeout(() => setPaused(false), 2800);
  }, []);

  const goPrev = useCallback(() => {
    if (slides.length === 0) return;
    goTo((currentIndex - 1 + slides.length) % slides.length);
  }, [currentIndex, goTo, slides.length]);

  const goNext = useCallback(() => {
    if (slides.length === 0) return;
    goTo((currentIndex + 1) % slides.length);
  }, [currentIndex, goTo, slides.length]);

  useEffect(() => {
    if (slides.length === 0 || paused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_MS);
    return () => clearInterval(timer);
  }, [slides.length, paused]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4">
        <div className="hero-carousel flex h-[min(72vh,440px)] animate-pulse items-center justify-center overflow-hidden rounded-2xl bg-charcoal-900 sm:h-[480px] sm:rounded-3xl md:h-[560px]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-orange-400" />
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4">
        <div className="hero-carousel relative overflow-hidden rounded-2xl bg-charcoal-900 sm:rounded-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(249,115,22,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(13,12,10,0.55)_100%)]" />

          <div className="relative mx-auto flex max-w-3xl flex-col items-start px-5 py-14 sm:px-10 sm:py-20 md:px-16 md:py-28 lg:py-32">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300/90 sm:mb-6 sm:text-xs">
              Kuralı Ne?
            </p>
            <h1 className="mb-4 max-w-2xl text-[1.75rem] font-extrabold leading-[1.05] tracking-tight text-white sm:mb-5 sm:text-4xl md:text-5xl lg:text-6xl">
              Her oyunun{' '}
              <span className="text-orange-300">kuralı burada</span>
            </h1>
            <p className="mb-8 max-w-lg text-sm leading-relaxed text-white/70 sm:mb-10 sm:text-base md:text-lg">
              Okey, batak, pişti, mangala ve fazlası — kurallar, ipuçları ve araçlar tek çatı altında.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/oyunlar"
                className="hero-carousel-cta inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-charcoal-950 transition hover:bg-cream-100 sm:px-6 sm:py-3.5 sm:text-base"
              >
                <Compass size={18} />
                Oyunları Keşfet
              </Link>
              <Link
                to="/araclar"
                className="inline-flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-white/80 transition hover:text-white sm:text-base"
              >
                Araçlar
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const active = slides[currentIndex];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4">
      <div
        className="hero-carousel group/hero relative h-[min(72vh,440px)] overflow-hidden rounded-2xl bg-charcoal-950 shadow-soft-xl sm:h-[480px] sm:rounded-3xl md:h-[560px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              <div className={`absolute inset-0 hero-carousel-ken ${isActive ? 'is-active' : ''}`}>
                <img
                  src={slide.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  width="1400"
                  height="560"
                  fetchpriority={index === 0 ? 'high' : 'auto'}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/88 via-charcoal-950/45 to-charcoal-950/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-transparent to-charcoal-950/25" />
            </div>
          );
        })}

        <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-3 sm:left-7 sm:top-6 md:left-10 md:top-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/90 sm:text-[11px]">
            Kuralı Ne?
          </span>
          <span className="hidden h-3 w-px bg-white/25 sm:block" aria-hidden />
          <span className="hidden font-mono text-[11px] tabular-nums tracking-wider text-white/55 sm:inline">
            {padIndex(currentIndex + 1)}
            <span className="text-white/30"> / </span>
            {padIndex(slides.length)}
          </span>
        </div>

        <div className="absolute right-3 top-3 z-20 flex gap-1.5 sm:right-6 sm:top-5 md:right-8 md:top-7">
          <button
            type="button"
            onClick={goPrev}
            className="hero-carousel-nav flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white backdrop-blur-md transition hover:border-white/35 hover:bg-black/40 sm:h-11 sm:w-11"
            aria-label="Önceki slayt"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="hero-carousel-nav flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white backdrop-blur-md transition hover:border-white/35 hover:bg-black/40 sm:h-11 sm:w-11"
            aria-label="Sonraki slayt"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="absolute inset-0 z-20 flex items-end p-4 pb-[4.75rem] sm:items-center sm:p-7 sm:pb-7 md:p-10 lg:p-14">
          <div key={active.id} className="hero-carousel-copy max-w-xl md:max-w-2xl">
            <div className="mb-3 flex items-center gap-3 sm:mb-4">
              <span className="h-px w-8 bg-orange-400/80 sm:w-10" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300/95 sm:text-[11px]">
                {active.badge || 'Öne çıkan'}
              </span>
            </div>

            <h2 className="mb-3 text-[1.45rem] font-extrabold leading-[1.08] tracking-tight text-white sm:mb-4 sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
              {active.title}
            </h2>

            {active.description && (
              <p className="mb-6 line-clamp-2 max-w-md text-sm leading-relaxed text-white/72 sm:mb-8 sm:line-clamp-3 sm:text-base md:text-lg">
                {active.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <SlideCtaButton
                href={active.button_link}
                className="hero-carousel-cta inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-charcoal-950 transition hover:bg-cream-100 sm:px-6 sm:py-3.5 sm:text-base"
              >
                <span>{active.button_text || 'Keşfet'}</span>
                <ArrowRight size={16} className="opacity-70" />
              </SlideCtaButton>

              <Link
                to="/oyunlar"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 transition hover:text-white sm:text-base"
              >
                <TrendingUp size={15} className="opacity-70" />
                Tüm oyunlar
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="flex items-end justify-between gap-3 bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/55 to-transparent px-3 pb-3 pt-10 sm:px-6 sm:pb-4 md:px-8">
            <span className="font-mono text-[11px] tabular-nums text-white/50 sm:hidden">
              {padIndex(currentIndex + 1)}/{padIndex(slides.length)}
            </span>

            <div className="ml-auto flex max-w-full gap-2 overflow-x-auto pb-0.5 sm:gap-2.5">
              {slides.map((slide, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`hero-carousel-thumb relative h-11 w-[3.25rem] shrink-0 overflow-hidden rounded-md transition-all duration-300 sm:h-14 sm:w-[4.5rem] md:h-16 md:w-24 ${
                      isActive
                        ? 'opacity-100 ring-1 ring-white/70'
                        : 'opacity-45 ring-1 ring-white/10 hover:opacity-80'
                    }`}
                    aria-label={`Slayt ${index + 1}: ${slide.title}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <img
                      src={slide.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-orange-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroCarousel;
