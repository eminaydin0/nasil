import { Link } from 'react-router-dom';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';
import { coverSrc } from '../../lib/coverImage';
import GameOfTheDay from './GameOfTheDay';

function GameReel({ games, loading }) {
  if (loading && games.length === 0) {
    return <div className="home-reel home-skeleton" aria-hidden />;
  }
  if (games.length === 0) return null;

  const loop = [...games, ...games];
  const duration = `${Math.max(games.length, 6) * 2.4}s`;

  return (
    <div className="home-reel" aria-label="Tüm oyunlar">
      <div className="home-reel-track" style={{ '--reel-ms': duration }}>
        {loop.map((game, index) => {
          const copy = index >= games.length;
          return (
            <Link
              key={`${game.id}-${index}`}
              to={`/oyun/${game.slug}`}
              className="home-reel-row"
              tabIndex={copy ? -1 : undefined}
              aria-hidden={copy ? true : undefined}
            >
              <img
                src={coverSrc(game, 160) || CARD_FALLBACK_IMAGE}
                alt=""
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
                onError={handleImageFallback}
              />
              <span>
                <strong>{game.name}</strong>
                {game.category ? <em>{game.category}</em> : null}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function HomeSpotlight({ games = [], loading = false }) {
  return (
    <section className="home-block home-block--tight" aria-label="Günün oyunu ve tüm oyunlar">
      <div className="home-spot">
        <GameOfTheDay games={games} variant="stage" />
        <GameReel games={games} loading={loading} />
      </div>
    </section>
  );
}

export default HomeSpotlight;
