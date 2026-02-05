import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useState } from 'react';

export default function FavoriteButton({ 
  gameId, 
  size = 20, 
  className = '',
  showLabel = false 
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const favorite = isFavorite(gameId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    await toggleFavorite(gameId);
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative inline-flex items-center gap-2 p-2 rounded-full transition-all duration-300 ${
        favorite 
          ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:scale-110' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
      } ${isAnimating ? 'animate-bounce' : ''} ${className}`}
      title={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <Heart 
        size={size} 
        className={`transition-all duration-300 ${
          favorite ? 'fill-current scale-110' : 'group-hover:scale-110'
        }`}
        strokeWidth={favorite ? 2.5 : 2}
      />
      {showLabel && (
        <span className="text-sm font-semibold">
          {favorite ? 'Favorilerde' : 'Favorilere Ekle'}
        </span>
      )}
    </button>
  );
}
