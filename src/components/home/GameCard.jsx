import { Link } from 'react-router-dom';
import { Users, Star, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';

/**
 * GameCard - tek kaynaklı oyun kartı.
 *
 * Performans: rating ve commentCount artık prop olarak geliyor (parent
 * useGameStats ile tek sorguda batch çekiyor). Kart kendi sorgusunu yapmıyor.
 *
 * variant: 'default' | 'featured'
 *   - featured: 16:10 oran ama daha güçlü gölge / orange aura.
 */
function GameCard({ game, rating = 0, commentCount = 0, variant = 'default' }) {
  const ratingNumber = Number(rating) || 0;
  const ratingDisplay = ratingNumber > 0 ? ratingNumber.toFixed(1) : null;
  const isFeatured = variant === 'featured';
  const imageSrc = game.image || CARD_FALLBACK_IMAGE;

  return (
    <Link
      to={`/oyun/${game.slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-2xl"
      aria-label={`${game.name} - kuralı ne?`}
    >
      <article
        className={`relative h-full bg-white rounded-2xl overflow-hidden border border-warm-200/70 transition-all duration-500 ease-spring hover:-translate-y-0.5 ${
          isFeatured
            ? 'shadow-soft-md hover:shadow-warm-glow-lg hover:border-orange-200'
            : 'shadow-soft hover:shadow-warm-glow hover:border-orange-200/70'
        }`}
      >
        {/* Görsel */}
        <div className="relative aspect-[16/10] bg-warm-100 overflow-hidden">
          <img
            src={imageSrc}
            alt={game.name}
            loading="lazy"
            decoding="async"
            width="640"
            height="400"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.06]"
            onError={handleImageFallback}
          />

          {/* Yumuşak alt gradient (text contrast için) */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

          {/* Kategori rozeti - hover'da hafif kayar */}
          <div className="absolute top-3 left-3 transition-transform duration-500 ease-spring group-hover:-translate-y-0.5">
            <Badge variant="glass" size="md">
              {game.category}
            </Badge>
          </div>

          {/* Rating rozeti */}
          {ratingDisplay && (
            <div className="absolute top-3 right-3">
              <Badge variant="rating" size="md" icon={Star} className="shadow-soft">
                {ratingDisplay}
              </Badge>
            </div>
          )}

          {/* Hover sıcak parıltı katmanı */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/0 via-transparent to-transparent group-hover:from-orange-500/10 transition-colors duration-500 pointer-events-none" />
        </div>

        {/* İçerik */}
        <div className="p-4 sm:p-5">
          {/* Meta */}
          <div className="mb-2 flex items-center gap-2.5 text-warm-500 sm:mb-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium sm:text-xs">
              <Users size={13} className="text-warm-400 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
              {game.players}
            </span>
            {commentCount > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-warm-300" aria-hidden="true" />
                <span className="text-[11px] font-medium sm:text-xs">{commentCount} yorum</span>
              </>
            )}
          </div>

          <h3 className="mb-1.5 line-clamp-1 text-base font-extrabold leading-snug tracking-tight text-warm-900 transition-colors group-hover:text-orange-600 sm:mb-2 sm:text-lg md:text-xl">
            {game.name}
          </h3>

          <p className="mb-3 line-clamp-2 min-h-[2.25rem] text-xs leading-relaxed text-warm-500 sm:mb-4 sm:min-h-[2.5rem] sm:text-sm">
            {game.shortDescription}
          </p>

          <div className="flex items-center justify-between border-t border-warm-100 pt-3 sm:pt-4">
            <span className="text-sm font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
              Kuralı Ne?
            </span>
            <span className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300 ease-spring">
              <ArrowUpRight
                size={16}
                className="text-orange-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default GameCard;
