import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronRight, ChevronUp, Play, Search } from 'lucide-react';
import { LCP_HERO_IMAGE, heroImageSrc } from '../../constants/lcpHero';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';
import { SITE_TOOLS } from '../../constants/tools';
import { coverSrc } from '../../lib/coverImage';
import { getSlides, normalizeSlideHref } from './HeroCarousel';

const CHIPS = [
  { label: 'Okey', to: '/oyunlar?search=Okey' },
  { label: '101 Okey', to: '/oyunlar?search=101%20Okey' },
  { label: 'Batak', to: '/oyunlar?search=Batak' },
  { label: 'Pişti', to: '/oyunlar?search=Pişti' },
  { label: 'Satranç', to: '/oyunlar?search=Satranç' },
  { label: 'Halı saha', to: '/araclar/halisaha-takim-olusturucu' },
];

const SLIDE_MS = 6500;

function slideHref(link) {
  const target = normalizeSlideHref(link);
  const external = target.startsWith('http://') || target.startsWith('https://');
  return { target, external };
}

function HeroStage() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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

  const active = slides[index];
  const href = active ? slideHref(active.button_link) : null;
  const ctaLabel = active?.button_text || 'Keşfet';
  const ctaHint = (active?.description || '').trim();

  const go = (step) => {
    if (slides.length < 2) return;
    setIndex((current) => (current + step + slides.length) % slides.length);
  };

  const cta = active && href && (
    href.external ? (
      <a className="home-hero-cta" href={href.target} target="_blank" rel="noopener noreferrer">
        <span className="home-hero-cta-play" aria-hidden><Play size={14} fill="currentColor" /></span>
        <span className="home-hero-cta-copy">
          <strong>{ctaLabel}</strong>
          {ctaHint ? <small>{ctaHint}</small> : null}
        </span>
        <ChevronRight size={16} aria-hidden />
      </a>
    ) : (
      <Link className="home-hero-cta" to={href.target}>
        <span className="home-hero-cta-play" aria-hidden><Play size={14} fill="currentColor" /></span>
        <span className="home-hero-cta-copy">
          <strong>{ctaLabel}</strong>
          {ctaHint ? <small>{ctaHint}</small> : null}
        </span>
        <ChevronRight size={16} aria-hidden />
      </Link>
    )
  );

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
        <div className="home-hero-rail">
          <button type="button" aria-label="Önceki slayt" onClick={() => go(-1)}>
            <ChevronUp size={18} />
          </button>
          <span className="home-hero-count">
            {String(index + 1).padStart(2, '0')}
            <em>/</em>
            {String(slides.length).padStart(2, '0')}
          </span>
          <button type="button" aria-label="Sonraki slayt" onClick={() => go(1)}>
            <ChevronDown size={18} />
          </button>
        </div>
      )}
      {cta}
      {slides.length > 1 && (
        <span
          key={index}
          className="home-hero-progress"
          style={{ animationDuration: `${SLIDE_MS}ms` }}
          aria-hidden
        />
      )}
    </div>
  );
}

function HomeHero({ games = [] }) {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = term.trim().toLocaleLowerCase('tr-TR');
    if (!q) return [];
    return games
      .filter((game) => {
        const name = (game.name || '').toLocaleLowerCase('tr-TR');
        const category = (game.category || '').toLocaleLowerCase('tr-TR');
        const blurb = (game.shortDescription || '').toLocaleLowerCase('tr-TR');
        return name.includes(q) || category.includes(q) || blurb.includes(q);
      })
      .slice(0, 5);
  }, [games, term]);

  useEffect(() => {
    const onDoc = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const query = term.trim();
    if (!query) return;
    setOpen(false);
    navigate(`/oyunlar?search=${encodeURIComponent(query)}`);
  };

  const resultsUrl = term.trim() ? `/oyunlar?search=${encodeURIComponent(term.trim())}` : null;
  const categoryCount = useMemo(
    () => new Set(games.map((game) => game.category).filter(Boolean)).size,
    [games]
  );

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="home-hero-stage">
          <div className="home-hero-copy">
            <p className="home-kicker">Tüm oyunlar, tek platform</p>
            <h1 id="home-hero-title" className="home-hero-title">
              Oyunların kuralı
              <span> burada!</span>
            </h1>
            <p className="home-hero-lead">
              Kurallar, yazboz, haberler ve masa başı araçlar. Oynamadan önce kuralı burada öğren.
            </p>

            <form className="home-search" onSubmit={submit} role="search" ref={wrapRef}>
              <Search size={18} className="shrink-0 text-white/45" aria-hidden />
              <input
                type="search"
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Hangi oyunu arıyorsun?"
                aria-label="Oyun ara"
                autoComplete="off"
              />
              <button type="submit" aria-label="Ara">
                <ArrowRight size={18} aria-hidden />
              </button>
              {open && term.trim() && (
                <div className="home-search-pop">
                  {results.length > 0 ? (
                    results.map((game) => (
                      <Link
                        key={game.id}
                        to={`/oyun/${game.slug}`}
                        className="home-search-hit"
                        onClick={() => setOpen(false)}
                      >
                        <img
                          src={coverSrc(game, 96) || CARD_FALLBACK_IMAGE}
                          alt=""
                          width="40"
                          height="40"
                          loading="lazy"
                          onError={handleImageFallback}
                        />
                        <span>
                          <strong>{game.name}</strong>
                          <em>{game.category}</em>
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="home-search-empty">Eşleşen oyun yok</p>
                  )}
                  {resultsUrl && (
                    <Link to={resultsUrl} className="home-search-all" onClick={() => setOpen(false)}>
                      Tüm sonuçları gör
                    </Link>
                  )}
                </div>
              )}
            </form>

            <div className="home-chips">
              <span>Popüler aramalar</span>
              {CHIPS.map((chip) => (
                <Link key={chip.label} to={chip.to} className="home-chip">
                  {chip.label}
                </Link>
              ))}
            </div>

            {games.length > 0 && (
              <dl className="home-hero-meter">
                <div>
                  <dd>{games.length}</dd>
                  <dt>oyun rehberi</dt>
                </div>
                <div>
                  <dd>{categoryCount}</dd>
                  <dt>kategori</dt>
                </div>
                <div>
                  <dd>{SITE_TOOLS.length}</dd>
                  <dt>masa aracı</dt>
                </div>
              </dl>
            )}
          </div>

          <HeroStage />
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
