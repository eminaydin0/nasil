import { Link } from 'react-router-dom';
import { Users, Clock, Star } from 'lucide-react';

function GameCard({ game }) {

  // Calculate average rating from comments
  const getAverageRating = () => {
    const comments = localStorage.getItem(`comments_${game.id}`);
    if (!comments) return 0;
    
    const parsedComments = JSON.parse(comments);
    if (parsedComments.length === 0) return 0;
    
    const totalRating = parsedComments.reduce((sum, comment) => sum + comment.rating, 0);
    return (totalRating / parsedComments.length).toFixed(1);
  };

  const averageRating = getAverageRating();
  const commentCount = JSON.parse(localStorage.getItem(`comments_${game.id}`) || '[]').length;

  return (
    <Link to={`/oyun/${game.slug}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
        {/* Image Section */}
        <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
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
