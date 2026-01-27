import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Sparkles, Users, ArrowRight, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function GameOfTheDay({ games }) {
  const [gameOfTheDay, setGameOfTheDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameOfTheDay();
  }, [games]);

  const fetchGameOfTheDay = async () => {
    try {
      const { data, error } = await supabase
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
          tips: data.game.tips
        });
      } else {
        fallbackToDeterministic();
      }
    } catch (error) {
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
    <section className="relative mb-10">
      {/* Sade ve Şık Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200/80 group hover:shadow-xl transition-all duration-300">
        <div className="relative z-10 p-6 md:p-8">
          {/* Header - Minimal */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg border border-orange-100">
              <Sparkles size={14} className="text-orange-600" />
              <span className="font-semibold text-xs tracking-wide">Günün Oyunu</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={14} />
              <span className="text-xs font-medium">
                {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Game Image - Sade */}
            <div className="relative group/image overflow-hidden rounded-xl">
              <img 
                src={gameOfTheDay.image} 
                alt={gameOfTheDay.name}
                className="w-full h-56 md:h-64 object-cover transform group-hover/image:scale-[1.02] transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop';
                }}
              />
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
              
              {/* Minimal Badges */}
              <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-md">
                  {gameOfTheDay.category}
                </span>
              </div>
            </div>

            {/* Game Info - Minimal Typography */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                  {gameOfTheDay.name}
                </h2>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {gameOfTheDay.shortDescription}
              </p>
              
              {/* Stats - Minimal */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <Users size={16} className="text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">{gameOfTheDay.players}</span>
                </div>
              </div>

              {/* CTA Button - Sade */}
              <Link
                to={`/oyun/${gameOfTheDay.slug}`}
                className="group/btn inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition-all duration-300 hover:shadow-md"
              >
                <span>Nasıl Oynanır</span>
                <ArrowRight size={16} className="transform group-hover/btn:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GameOfTheDay;
