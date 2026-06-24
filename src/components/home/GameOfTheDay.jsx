import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Users, ArrowRight, Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
      <div className="relative overflow-hidden bg-gradient-to-br from-charcoal-900 via-warm-900 to-charcoal-950 rounded-3xl group shadow-soft-xl">
        {/* Sıcak parıltılar */}
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-orange-500/15 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
        </div>
        {/* İnce noise / radial vinyetleme */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(249,115,22,0.08),transparent_55%)]" />

        <div className="relative z-10 p-6 md:p-10 lg:p-14">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:mb-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-warm-glow">
              <Sparkles size={16} className="text-white" />
              <span className="font-bold text-white text-sm tracking-wide">Günün Oyunu</span>
            </div>
            <div className="flex flex-col gap-2 text-cream-100/60 sm:flex-row sm:items-center sm:gap-2">
              <Calendar size={15} className="shrink-0" />
              <span className="text-xs font-medium capitalize sm:text-sm">
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            {/* Görsel */}
            <div className="relative">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-soft-xl ring-1 ring-white/5">
                <img
                  src={gameOfTheDay.image}
                  alt={gameOfTheDay.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 right-4 bg-white rounded-2xl px-4 py-3 shadow-soft-lg border border-warm-100">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-extrabold text-warm-900 tracking-tight">Öne Çıkan</span>
                </div>
              </div>
            </div>

            {/* İçerik */}
            <div className="space-y-6">
              <span className="inline-flex px-3 py-1.5 bg-white/10 backdrop-blur-sm text-cream-100/80 text-xs font-semibold rounded-lg border border-white/10 uppercase tracking-wider">
                {gameOfTheDay.category}
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.05] tracking-tight">
                {gameOfTheDay.name}
              </h2>

              <p className="text-cream-100/75 text-base md:text-lg leading-relaxed line-clamp-3">
                {gameOfTheDay.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <Users size={18} className="text-orange-300" />
                  <span className="text-sm font-medium text-white">{gameOfTheDay.players}</span>
                </div>
                {gameOfTheDay.difficulty && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                    <Sparkles size={16} className="text-amber-300" />
                    <span className="text-sm font-medium text-white capitalize">{gameOfTheDay.difficulty}</span>
                  </div>
                )}
              </div>

              <Link
                to={`/oyun/${gameOfTheDay.slug}`}
                className="inline-flex items-center gap-3 px-7 py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-base hover:from-orange-600 hover:to-red-600 transition-all duration-300 ease-spring shadow-warm-glow hover:shadow-warm-glow-lg hover:-translate-y-0.5 group/btn"
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
