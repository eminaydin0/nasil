import { ExternalLink, Clock, Gift } from 'lucide-react';
import {
  formatGiveawayEndDate,
  formatGiveawayCountdown,
  formatWorth,
  parseGiveawayPlatforms,
} from '../../lib/gamerPower';

function storeChipClass(name) {
  const key = name.toLowerCase();
  if (key.includes('steam')) return 'free-game-chip--steam';
  if (key.includes('epic')) return 'free-game-chip--epic';
  if (key.includes('gog')) return 'free-game-chip--gog';
  if (key.includes('itch')) return 'free-game-chip--itch';
  return 'free-game-chip--default';
}

function FreeGameCard({ game, compact = false }) {
  const worthLabel = formatWorth(game.worth);
  const endLabel = formatGiveawayEndDate(game.endDate);
  const countdown = formatGiveawayCountdown(game.endDate);
  const platforms = parseGiveawayPlatforms(game.platform);
  const showWorth = worthLabel !== 'Ücretsiz';

  return (
    <article
      className={`free-game-card group ${compact ? 'free-game-card--compact' : ''}`}
    >
      <div className="free-game-card-media">
        {game.image ? (
          <img
            src={game.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="free-game-card-img"
          />
        ) : (
          <div className="free-game-card-placeholder">
            <Gift size={compact ? 28 : 36} aria-hidden />
          </div>
        )}

        <div className="free-game-card-media-overlay" aria-hidden />

        <div className="free-game-card-badges">
          <span className="free-game-badge free-game-badge--free">Ücretsiz</span>
          {showWorth && (
            <span className="free-game-badge free-game-badge--worth">{worthLabel}</span>
          )}
        </div>
      </div>

      <div className="free-game-card-body">
        <div className="free-game-card-chips">
          {platforms.map((platform) => (
            <span
              key={platform}
              className={`free-game-chip ${storeChipClass(platform)}`}
            >
              {platform}
            </span>
          ))}
        </div>

        <h3 className="free-game-card-title">{game.title}</h3>

        <div className="free-game-card-meta">
          <div className="free-game-card-date">
            <Clock size={13} aria-hidden className="shrink-0 text-warm-400" />
            <span className="min-w-0 truncate" title={endLabel}>
              {endLabel}
            </span>
          </div>
          <span
            className={`free-game-countdown ${countdown.urgent ? 'free-game-countdown--urgent' : ''}`}
          >
            {countdown.label}
          </span>
        </div>

        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="free-game-card-cta"
        >
          <span>Oyunu Kap</span>
          <ExternalLink size={15} aria-hidden className="opacity-80" />
        </a>
      </div>
    </article>
  );
}

export default FreeGameCard;
