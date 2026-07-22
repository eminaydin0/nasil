import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';

const ACCENT = {
  red: 'from-rose-600/90 via-rose-900/55 to-warm-950/80',
  orange: 'from-orange-600/90 via-amber-900/50 to-warm-950/80',
  amber: 'from-amber-500/90 via-orange-900/50 to-warm-950/80',
  purple: 'from-violet-600/90 via-violet-950/55 to-warm-950/80',
  blue: 'from-sky-600/90 via-slate-900/55 to-warm-950/80',
  green: 'from-emerald-600/90 via-emerald-950/50 to-warm-950/80',
  indigo: 'from-indigo-600/90 via-indigo-950/55 to-warm-950/80',
  cyan: 'from-cyan-600/90 via-slate-900/50 to-warm-950/80',
  teal: 'from-teal-600/90 via-teal-950/50 to-warm-950/80',
  fuchsia: 'from-fuchsia-600/90 via-fuchsia-950/55 to-warm-950/80',
  gray: 'from-warm-600/90 via-warm-900/55 to-warm-950/80',
};

function CategoryCard({
  category,
  count,
  icon: IconComponent,
  color = 'orange',
  compact = false,
  image,
}) {
  const categoryUrl = encodeURIComponent(category);
  const overlay = ACCENT[color] || ACCENT.orange;
  const src = image || CARD_FALLBACK_IMAGE;

  return (
    <Link
      to={`/kategori/${categoryUrl}`}
      className="category-tile group block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      <article
        className={`category-tile-inner relative overflow-hidden rounded-2xl bg-warm-900 shadow-soft transition-all duration-500 ease-spring group-hover:-translate-y-0.5 group-hover:shadow-soft-lg ${
          compact ? 'aspect-[4/5] sm:aspect-[5/4]' : 'aspect-[4/3]'
        }`}
      >
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.06]"
          loading="lazy"
          onError={(e) => handleImageFallback(e)}
        />

        {/* Soft vignette + brand-tinted bottom wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-950/92 via-warm-950/20 to-black/10" />
        <div
          className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t ${overlay} opacity-70 transition-opacity duration-500 group-hover:opacity-85`}
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />

        <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-3.5">
          <div className="flex items-start justify-between gap-2">
            {IconComponent && (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white shadow-soft backdrop-blur-md transition-transform duration-500 ease-spring group-hover:scale-105 sm:h-8 sm:w-8">
                <IconComponent size={14} aria-hidden="true" />
              </span>
            )}
            <span className="inline-flex h-7 w-7 translate-y-1 items-center justify-center rounded-full bg-white/0 text-white opacity-0 backdrop-blur-md transition-all duration-500 ease-spring group-hover:translate-y-0 group-hover:bg-white/20 group-hover:opacity-100 sm:h-8 sm:w-8">
              <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </div>

          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">
              {count} oyun
            </p>
            <h3 className="text-sm font-extrabold leading-snug tracking-tight text-white drop-shadow-sm sm:text-[0.95rem]">
              {category}
            </h3>
            <span
              className="mt-2 block h-0.5 w-6 rounded-full bg-white/70 transition-all duration-500 ease-spring group-hover:w-10 group-hover:bg-orange-300"
              aria-hidden
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

export default CategoryCard;
