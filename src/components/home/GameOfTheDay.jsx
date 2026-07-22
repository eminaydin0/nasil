import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Users, ArrowRight, Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';

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
          name: data.custom_title || data.game.name,
          category: data.game.category,
          players: data.game.players,
          difficulty: data.game.difficulty,
          image: data.game.image,
          shortDescription: data.custom_description || data.game.short_description,
          description: data.game.description,
          rules: data.game.rules,
          tips: data.game.tips,
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

  return (
    <section className="relative">
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal-900 via-warm-900 to-charcoal-950 shadow-soft-xl sm:rounded-3xl">
        {/* Sıcak parıltılar */}
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-orange-500/15 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
        </div>
        {/* İnce noise / radial vinyetleme */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(249,115,22,0.08),transparent_55%)]" />

        <div className="relative z-10 p-4 sm:p-6 md:p-10 lg:p-14">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:mb-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3.5 py-1.5 shadow-warm-glow sm:px-4 sm:py-2">
              <Sparkles size={15} className="text-white" />
              <span className="text-xs font-bold tracking-wide text-white sm:text-sm">Günün Oyunu</span>
            </div>
            <div className="flex items-center gap-2 text-cream-100/60">
              <Calendar size={14} className="shrink-0" />
              <span className="text-[11px] font-medium capitalize sm:text-sm">
                {new Date().toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>
          </div>

          <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-14">
            {/* Görsel */}
            <div className="relative">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-soft-xl ring-1 ring-white/5">
                <img
                  src={gameOfTheDay.image || CARD_FALLBACK_IMAGE}
                  alt={gameOfTheDay.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="500"
                  onError={handleImageFallback}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-3 right-3 rounded-xl border border-warm-100 bg-white px-3 py-2 shadow-soft-lg sm:-bottom-4 sm:right-4 sm:rounded-2xl sm:px-4 sm:py-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                  <span className="text-xs font-extrabold tracking-tight text-warm-900 sm:text-sm">Öne Çıkan</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <span className="inline-flex rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream-100/80 backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs">
                {gameOfTheDay.category}
              </span>

              <h2 className="text-2xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                {gameOfTheDay.name}
              </h2>

              <p className="line-clamp-3 text-sm leading-relaxed text-cream-100/75 sm:text-base md:text-lg">
                {gameOfTheDay.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-2.5">
                  <Users size={16} className="text-orange-300 sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs font-medium text-white sm:text-sm">{gameOfTheDay.players}</span>
                </div>
                {gameOfTheDay.difficulty && (
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-2.5">
                    <Sparkles size={14} className="text-amber-300 sm:w-4 sm:h-4" />
                    <span className="text-xs font-medium capitalize text-white sm:text-sm">
                      {gameOfTheDay.difficulty}
                    </span>
                  </div>
                )}
              </div>

              <Link
                to={`/oyun/${gameOfTheDay.slug}`}
                className="group/btn inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3.5 text-sm font-bold text-white shadow-warm-glow transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:from-orange-600 hover:to-red-600 hover:shadow-warm-glow-lg sm:w-auto sm:px-7 sm:text-base md:px-8 md:py-4"
              >
                <span>Kuralı Ne?</span>
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GameOfTheDay;
