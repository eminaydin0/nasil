import { Link } from 'react-router-dom';
import { Users, Star, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function GameCard({ game, variant = 'default' }) {
  const [averageRating, setAverageRating] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    loadRating();
  }, [game.id]);

  const loadRating = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('rating')
        .eq('game_id', game.id);
      
      if (error) throw error;
      
      const comments = data || [];
      setCommentCount(comments.length);
      
      if (comments.length > 0) {
        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        setAverageRating((totalRating / comments.length).toFixed(1));
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error loading rating:', error);
      setAverageRating(0);
      setCommentCount(0);
    }
  };

  return (
    <Link to={`/oyun/${game.slug}`} className="group block h-full">
      <article className="relative h-full bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 border border-gray-100 hover:border-orange-200/50">
        {/* Image Section */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <img 
            src={game.image} 
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop';
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
          
          {/* Kategori badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-lg shadow-sm">
              {game.category}
            </span>
          </div>

          {/* Rating badge */}
          {averageRating > 0 && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-lg shadow-sm">
                <Star size={12} className="fill-current" />
                {averageRating}
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/10 transition-colors duration-300"></div>
        </div>
        
        {/* Content Section */}
        <div className="p-5">
          {/* Meta info */}
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Users size={14} className="text-gray-400" />
              {game.players}
            </span>
            {commentCount > 0 && (
              <span className="text-xs text-gray-400">
                {commentCount} yorum
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300 leading-snug line-clamp-1">
            {game.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {game.shortDescription}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm font-semibold text-orange-600 group-hover:text-orange-700 transition-colors">
              Nasıl Oynanır?
            </span>
            <span className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
              <ArrowUpRight size={16} className="text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default GameCard;
