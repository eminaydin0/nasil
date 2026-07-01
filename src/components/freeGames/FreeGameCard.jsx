import { ExternalLink, Gift } from 'lucide-react';
import { formatGiveawayEndDate, formatWorth } from '../../lib/gamerPower';

function FreeGameCard({ game, compact = false }) {
  const worthLabel = formatWorth(game.worth);
  const endLabel = formatGiveawayEndDate(game.endDate);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-warm-200/70 bg-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-soft-md ${compact ? 'free-game-card-compact' : ''}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-warm-100">
        {game.image ? (
          <img
            src={game.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-warm-400">
            <Gift size={32} aria-hidden />
          </div>
        )}
        <span className="free-game-worth-badge">{worthLabel}</span>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-3' : 'p-4'}`}>
        {game.platform && (
          <span className="free-game-platform">{game.platform}</span>
        )}
        <h3
          className={`mt-1.5 line-clamp-2 font-extrabold tracking-tight text-warm-900 ${compact ? 'text-sm' : 'text-base'}`}
        >
          {game.title}
        </h3>
        <p className="mt-1 text-xs text-warm-500">Bitiş: {endLabel}</p>

        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-orange-600 font-bold text-white transition hover:bg-orange-700 ${compact ? 'mt-3 px-3 py-2 text-xs' : 'mt-4 px-4 py-2.5 text-sm'}`}
        >
          Oyunu Kap
          <ExternalLink size={14} aria-hidden />
        </a>
      </div>
    </article>
  );
}

export default FreeGameCard;
