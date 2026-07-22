import { ExternalLink, Star } from 'lucide-react';
import { formatUsd } from '../../lib/cheapShark';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';

function metacriticColor(score) {
  if (score >= 75) return 'bg-emerald-100 text-emerald-700';
  if (score >= 50) return 'bg-amber-100 text-amber-700';
  return 'bg-rose-100 text-rose-700';
}

function DealCard({ deal }) {
  const imageSrc = deal.image || deal.thumb || CARD_FALLBACK_IMAGE;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-warm-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
      <div className="relative aspect-[460/215] overflow-hidden bg-warm-100">
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          decoding="async"
          onError={handleImageFallback}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {deal.savings > 0 && (
          <span className="absolute left-2 top-2 rounded-lg bg-rose-600 px-2 py-1 text-xs font-black text-white shadow">
            -%{deal.savings}
          </span>
        )}

        <span className="absolute right-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          {deal.storeName}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        <h3
          className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-warm-900"
          title={deal.title}
        >
          {deal.title}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5">
          {deal.steamRatingPercent != null && deal.steamRatingPercent > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-1.5 py-0.5 text-[11px] font-bold text-sky-700">
              <Star size={11} className="fill-sky-500 text-sky-500" aria-hidden />
              %{deal.steamRatingPercent} Steam
            </span>
          )}
          {deal.metacritic != null && (
            <span
              className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${metacriticColor(deal.metacritic)}`}
            >
              Metacritic {deal.metacritic}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="min-w-0">
            {deal.normalPrice > deal.salePrice && (
              <span className="block text-xs font-semibold text-warm-400 line-through">
                {formatUsd(deal.normalPrice)}
              </span>
            )}
            <span className="block text-lg font-black text-orange-600">
              {deal.salePrice === 0 ? 'Ücretsiz' : formatUsd(deal.salePrice)}
            </span>
          </div>
        </div>

        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-warm-900 px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
        >
          <span>İndirime Git</span>
          <ExternalLink size={15} aria-hidden className="opacity-80" />
        </a>
      </div>
    </article>
  );
}

export default DealCard;
