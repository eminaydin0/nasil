import { Link } from 'react-router-dom';
import { Users, Clock, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function GameCard({ game }) {
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
    <Link to={`/oyun/${game.slug}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
        {/* Image Section */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          <img 
            src={game.image} 
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-white text-sm font-semibold bg-orange-600 px-3 py-1 rounded-full inline-flex items-center">
              Detayları Gör →
            </span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
            <span className="flex items-center bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-medium">
              <Users size={14} className="mr-1.5" />
              {game.players}
            </span>
            <span className="flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              <Clock size={14} className="mr-1.5" />
              {game.category}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
            {game.name}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {game.shortDescription}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {averageRating > 0 ? (
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-gray-900">{averageRating}</span>
                <span className="text-xs text-gray-500">({commentCount})</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">Henüz değerlendirilmemiş</span>
            )}
            <span className="text-orange-600 font-semibold text-sm inline-flex items-center group-hover:gap-2 transition-all">
              <span>Devamını Oku</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default GameCard;
