import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';

/** Label zaten "Günün oyunu" — başlıktan tekrarlayan öneki düşür */
function resolveDailyTitle(customTitle, gameName) {
  const fallback = String(gameName || '').trim();
  const raw = String(customTitle || '').trim();
  if (!raw) return fallback;

  const stripped = raw.replace(/^günün\s*oyunu\s*[:\-–—|.]?\s*/i, '').trim();
  return stripped || fallback;
}

/**
 * GameOfTheDay — carousel editorial dili, sade iç hiyerarşi.
 */
function GameOfTheDay({ games }) {
  const [gameOfTheDay, setGameOfTheDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameOfTheDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games]);

  const fetchGameOfTheDay = async () => {
    try {
      const { data } = await supabase
        .from('daily_game_selection')
        .select(`
          custom_title,
          custom_description,
          game:games (
            *
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && data.game) {
        setGameOfTheDay({
          id: data.game.id,
          slug: data.game.slug,
          name: resolveDailyTitle(data.custom_title, data.game.name),
          category: data.game.category,
          players: data.game.players,
          difficulty: data.game.difficulty,
          image: data.game.image,
          shortDescription: data.custom_description || data.game.short_description,
          description: data.game.description,
        });
      } else {
        fallbackToDeterministic();
      }
    } catch {
      fallbackToDeterministic();
    } finally {
      setLoading(false);
    }
  };

  const fallbackToDeterministic = () => {
    if (!games || games.length === 0) {
      setGameOfTheDay(null);
      return;
    }

    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const seed = dayOfYear + today.getFullYear() * 365;
    const index = seed % games.length;
    setGameOfTheDay(games[index]);
  };

  if (loading) return null;
  if (!gameOfTheDay) return null;

  const dateLabel = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const metaBits = [gameOfTheDay.category, gameOfTheDay.players, gameOfTheDay.difficulty]
    .filter(Boolean)
    .join(' · ');

  return (
    <section className="relative">
      <div className="group relative min-h-[340px] overflow-hidden rounded-2xl bg-charcoal-950 shadow-soft-xl sm:min-h-[420px] sm:rounded-3xl md:min-h-[480px]">
        <div className="absolute inset-0">
          <img
            src={gameOfTheDay.image || CARD_FALLBACK_IMAGE}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            width="1200"
            height="480"
            onError={handleImageFallback}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-950/50 to-charcoal-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-transparent to-charcoal-950/30" />

        {/* Tarih — sağ üst, sakin */}
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2 text-white/55 sm:right-7 sm:top-6 md:right-10 md:top-8">
          <Calendar size={13} className="shrink-0 opacity-80" />
          <span className="text-[11px] font-medium capitalize tracking-wide sm:text-xs">
            {dateLabel}
          </span>
        </div>

        {/* İçerik — carousel ile aynı stack */}
        <div className="relative z-10 flex min-h-[340px] items-end p-5 sm:min-h-[420px] sm:items-center sm:p-8 md:min-h-[480px] md:p-12 lg:p-14">
          <div className="max-w-xl md:max-w-2xl">
            <div className="mb-4 flex items-center gap-3 sm:mb-5">
              <span className="h-px w-8 bg-orange-400/80 sm:w-10" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300/95 sm:text-[11px]">
                Günün oyunu
              </span>
            </div>

            <h2 className="mb-3 text-[1.65rem] font-extrabold leading-[1.08] tracking-tight text-white sm:mb-4 sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
              {gameOfTheDay.name}
            </h2>

            {(gameOfTheDay.shortDescription || gameOfTheDay.description) && (
              <p className="mb-4 max-w-md text-sm leading-relaxed text-white/70 sm:mb-5 sm:text-base md:text-lg">
                <span className="line-clamp-2 sm:line-clamp-3">
                  {gameOfTheDay.shortDescription || gameOfTheDay.description}
                </span>
              </p>
            )}

            {metaBits && (
              <p className="mb-6 text-xs font-medium tracking-wide text-white/45 sm:mb-8 sm:text-sm">
                {metaBits}
              </p>
            )}

            <Link
              to={`/oyun/${gameOfTheDay.slug}`}
              className="hero-carousel-cta inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-charcoal-950 transition hover:bg-cream-100 sm:px-6 sm:py-3.5 sm:text-base"
            >
              <span>Kuralı Ne?</span>
              <ArrowRight size={16} className="opacity-70" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GameOfTheDay;
