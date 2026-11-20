import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Gamepad2, Layers, Wrench } from 'lucide-react';
import { LCP_HERO_IMAGE, heroImageSrc } from '../../constants/lcpHero';
import { SITE_TOOLS } from '../../constants/tools';
import { getSlides, normalizeSlideHref } from './HeroCarousel';

const SLIDE_MS = 6500;

const FALLBACK_SLIDE = {
  id: 'fallback',
  badge: 'Tüm oyunlar, tek platform',
  title: 'Oyunların kuralı burada!',
  description: 'Kurallar, yazboz, haberler ve masa başı araçlar. Oynamadan önce kuralı burada öğren.',
  button_text: 'Hemen başla',
  button_link: '/oyunlar',
};

function titleParts(title) {
  const words = String(title || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { line: FALLBACK_SLIDE.title, accent: '' };
  if (words.length === 1) return { line: '', accent: words[0] };
  return { line: words.slice(0, -1).join(' '), accent: words[words.length - 1] };
}

function SlideLink({ href, className, children }) {
  const target = normalizeSlideHref(href);
  if (target.startsWith('http://') || target.startsWith('https://')) {
    return (
      <a className={className} href={target} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={target}>
      {children}
    </Link>
  );
}

function HeroStage({ slides, index, paused, setPaused, go }) {

  return (
    <div
      className={`home-hero-visual${paused ? ' is-paused' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="home-hero-glow" aria-hidden />
      {slides.length === 0 ? (
        <img
          className="home-hero-fallback"
          src={LCP_HERO_IMAGE}
          alt="Okey, tavla, satranç, kart ve zar"
          width="1280"
          height="720"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      ) : (
        slides.map((slide, slideIndex) => {
          const on = slideIndex === index;
          return (
            <div
              key={slide.id}
              className={`home-hero-slide${on ? ' is-on' : ''}`}
              aria-hidden={!on}
            >
              <img
                src={heroImageSrc(slide.image_url)}
                alt={on ? slide.title || '' : ''}
                width="1280"
                height="720"
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
                fetchPriority={slideIndex === 0 ? 'high' : 'low'}
                decoding="async"
              />
            </div>
          );
        })
      )}

      {slides.length > 1 && (
        <div className="home-hero-pager">
          <button type="button" aria-label="Önceki slayt" onClick={() => go(-1)}>
            <ChevronLeft size={16} />
          </button>
          <span className="home-hero-count">
            {String(index + 1).padStart(2, '0')}
            <em>/</em>
            {String(slides.length).padStart(2, '0')}
          </span>
          <button type="button" aria-label="Sonraki slayt" onClick={() => go(1)}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function HomeHero({ games = [] }) {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const categoryCount = useMemo(
    () => new Set(games.map((game) => game.category).filter(Boolean)).size,
    [games]
  );
  const active = slides[index] || FALLBACK_SLIDE;
  const heading = titleParts(active.title);
  const kicker = (active.badge || '').trim() || FALLBACK_SLIDE.badge;
  const lead = (active.description || '').trim();
  const buttonText = (active.button_text || '').trim() || FALLBACK_SLIDE.button_text;

  useEffect(() => {
    let cancelled = false;
    getSlides()
      .then((rows) => {
        if (!cancelled) setSlides(rows || []);
      })
      .catch(() => {
        if (!cancelled) setSlides([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const go = (step) => {
    if (slides.length < 2) return;
    setIndex((current) => (current + step + slides.length) % slides.length);
  };

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="home-hero-stage">
          <span className="home-hero-slash" aria-hidden />
          <span className="home-hero-slash-light" aria-hidden />
          <div className="home-hero-copy">
            <div className="home-hero-copy-text" key={active.id}>
              <p className="home-kicker">{kicker}</p>
              <h1 id="home-hero-title" className="home-hero-title">
                {heading.line ? <span className="home-hero-line">{heading.line}</span> : null}
                {heading.accent ? <span>{heading.accent}</span> : null}
              </h1>
              {lead ? <p className="home-hero-lead">{lead}</p> : null}
              <div className="home-hero-actions">
                <SlideLink className="home-hero-go" href={active.button_link}>
                  {buttonText}
                  <ArrowRight size={18} aria-hidden />
                </SlideLink>
              </div>
            </div>

            {games.length > 0 && (
              <dl className="home-hero-meter">
                <div>
                  <Gamepad2 size={18} aria-hidden />
                  <div>
                    <dd>{games.length}</dd>
                    <dt>oyun rehberi</dt>
                  </div>
                </div>
                <div>
                  <Layers size={18} aria-hidden />
                  <div>
                    <dd>{categoryCount}</dd>
                    <dt>kategori</dt>
                  </div>
                </div>
                <div>
                  <Wrench size={18} aria-hidden />
                  <div>
                    <dd>{SITE_TOOLS.length}</dd>
                    <dt>masa aracı</dt>
                  </div>
                </div>
              </dl>
            )}
          </div>

          <HeroStage
            slides={slides}
            index={index}
            paused={paused}
            setPaused={setPaused}
            go={go}
          />
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
