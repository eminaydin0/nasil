import { Star, Quote } from 'lucide-react';

/**
 * TestimonialCard - paylaşılan yorum kartı.
 * TestimonialsSection ve gelecekte başka yerlerde tek kaynak.
 */
function TestimonialCard({ name, comment, rating = 5, gameName, avatarUrl }) {
  const initials = (name || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <article className="group relative flex flex-col h-full bg-white rounded-2xl p-6 md:p-7 border border-warm-200/70 shadow-soft hover:shadow-soft-lg transition-all duration-500 ease-spring hover:-translate-y-0.5">
      {/* Quote dekorasyon */}
      <Quote
        size={44}
        className="absolute top-5 right-5 text-orange-200/50 group-hover:text-orange-300/70 transition-colors"
        aria-hidden="true"
      />

      {/* Yıldızlar (amber yumuşak) */}
      <div className="flex items-center gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-accent-400 text-accent-400' : 'fill-warm-200 text-warm-200'}
          />
        ))}
      </div>

      {/* Yorum */}
      <p className="text-warm-700 leading-relaxed flex-1 line-clamp-4 text-[15px] tracking-[-0.005em]">
        “{comment}”
      </p>

      {/* Yazar */}
      <div className="flex items-center gap-3 pt-5 mt-5 border-t border-warm-100 shrink-0">
        <div className="shrink-0 w-11 h-11">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              loading="lazy"
              decoding="async"
              width="44"
              height="44"
              className="w-full h-full rounded-full object-cover ring-2 ring-warm-100"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-orange-100 shadow-warm-glow">
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-warm-900 text-sm truncate tracking-tight">{name}</p>
          {gameName && <p className="text-xs text-warm-500 truncate">{gameName}</p>}
        </div>
      </div>
    </article>
  );
}

export default TestimonialCard;
