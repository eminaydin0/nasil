import { Link } from 'react-router-dom';
import { Users, Star, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui';

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
            src={game.image}
            alt={game.name}
            loading="lazy"
            decoding="async"
            width="640"
            height="400"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.06]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop';
            }}
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
        <div className="p-5">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-2.5 text-warm-500">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
              <Users size={14} className="text-warm-400" aria-hidden="true" />
              {game.players}
            </span>
            {commentCount > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-warm-300" aria-hidden="true" />
                <span className="text-xs font-medium">{commentCount} yorum</span>
              </>
            )}
          </div>

          {/* Başlık */}
          <h3 className="text-lg md:text-xl font-extrabold text-warm-900 mb-2 leading-snug tracking-tight line-clamp-1 group-hover:text-orange-600 transition-colors">
            {game.name}
          </h3>

          {/* Açıklama */}
          <p className="text-warm-500 text-sm leading-relaxed line-clamp-2 mb-4 min-h-[2.5rem]">
            {game.shortDescription}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-warm-100">
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
