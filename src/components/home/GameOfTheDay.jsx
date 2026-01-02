import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Sparkles } from 'lucide-react';
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
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 group hover:shadow-2xl transition-all duration-500">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      
      <div className="relative z-10 p-6 md:p-8">
        {/* Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full border border-orange-200">
            <Sparkles className="text-orange-600 animate-pulse" size={16} />
            <span className="font-bold text-xs tracking-wide uppercase">Günün Oyunu</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar size={16} />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Game Image */}
          <div className="relative group/image overflow-hidden rounded-xl shadow-lg">
            <img 
              src={gameOfTheDay.image} 
              alt={gameOfTheDay.name}
              className="w-full h-64 md:h-80 object-cover transform group-hover/image:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                {gameOfTheDay.category}
              </span>
              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                {gameOfTheDay.difficulty}
              </span>
            </div>
          </div>

          {/* Game Info */}
          <div className="text-gray-900">
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight text-gray-900 group-hover:text-orange-600 transition-colors">
              {gameOfTheDay.name}
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed line-clamp-3">
              {gameOfTheDay.shortDescription}
            </p>
            
            <div className="flex items-center gap-6 mb-8 text-gray-500">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <TrendingUp size={18} className="text-blue-500" />
                <span className="text-sm font-medium">{gameOfTheDay.players}</span>
              </div>
            </div>

            <Link
              to={`/oyun/${gameOfTheDay.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-orange-600 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <span>Nasıl Oynanır</span>
              <Sparkles size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameOfTheDay;
