import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Users, ArrowRight, Trophy } from 'lucide-react';
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
    <section className="relative">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl group">
        {/* Dekoratif arka plan */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative z-10 p-6 md:p-10 lg:p-12">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <Sparkles size={18} className="text-white" />
              <span className="font-bold text-white text-sm">Günün Oyunu</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={16} />
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Görsel */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={gameOfTheDay.image} 
                  alt={gameOfTheDay.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop';
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 md:right-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-bold text-gray-900">Öne Çıkan</span>
                </div>
              </div>
            </div>

            {/* İçerik */}
            <div className="space-y-6">
              {/* Kategori */}
              <span className="inline-flex px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold rounded-lg border border-white/10">
                {gameOfTheDay.category}
              </span>

              {/* Başlık */}
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {gameOfTheDay.name}
              </h2>

              {/* Açıklama */}
              <p className="text-gray-300 text-base md:text-lg leading-relaxed line-clamp-3">
                {gameOfTheDay.shortDescription}
              </p>
              
              {/* Meta bilgiler */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
                  <Users size={18} className="text-orange-400" />
                  <span className="text-sm font-medium text-white">{gameOfTheDay.players}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/oyun/${gameOfTheDay.slug}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-base hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 group/btn"
              >
                <span>Nasıl Oynanır?</span>
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
