import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useFreeGames } from '../../hooks/useFreeGames';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';

function valueLine(game) {
  const worth = String(game.worth || '').trim();
  if (!worth || /^n\/?a$/i.test(worth) || worth === '0' || worth === '$0.00') return 'Bedava';
  return `Değeri ${worth}`;
}

function HomeFreeShelf() {
  const { games, loading, error } = useFreeGames({ limit: 4 });
  const rows = games.slice(0, 4);

  if (!loading && (error || rows.length === 0)) return null;

  return (
    <section className="home-block" aria-labelledby="home-free-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">Bedava oyunlar</p>
          <h2 id="home-free-title">Şu an ücretsiz kampanyalar</h2>
        </div>
        <Link to="/ucretsiz-oyunlar" className="home-text-link">
          Tüm kampanyalar
          <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>

      {loading && rows.length === 0 ? (
        <div className="home-free-row">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="home-free-card home-skeleton" aria-hidden />
          ))}
        </div>
      ) : (
        <div className="home-free-row">
          {rows.map((game) => (
            <a
              key={game.id}
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="home-free-card"
            >
              <img
                src={game.image || CARD_FALLBACK_IMAGE}
                alt=""
                width="96"
                height="72"
                loading="lazy"
                onError={handleImageFallback}
              />
              <span>
                <em>Ücretsiz</em>
                <strong>{game.title}</strong>
                <small>{valueLine(game)}</small>
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomeFreeShelf;
