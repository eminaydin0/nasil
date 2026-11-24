import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useFreeGames } from '../../hooks/useFreeGames';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';

function valueLine(game) {
  const worth = String(game.worth || '').trim();
  if (!worth || /^n\/?a$/i.test(worth) || worth === '0' || worth === '$0.00') return 'Bedava';
  return `Değeri ${worth}`;
}

function HomeDealFeed() {
  const { games, loading, error } = useFreeGames({ limit: 8 });
  const rows = games.slice(0, 8);

  return (
    <section className="home-block" aria-labelledby="home-deals-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">Bedava oyunlar</p>
          <h2 id="home-deals-title">Şu an ücretsiz kampanyalar</h2>
        </div>
        <Link to="/ucretsiz-oyunlar" className="home-text-link">
          Tüm kampanyalar
          <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>

      {loading && rows.length === 0 ? (
        <div className="home-deal-strip">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="home-poster home-skeleton" aria-hidden />
          ))}
        </div>
      ) : error || rows.length === 0 ? (
        <p className="home-deal-empty">
          Ücretsiz liste şu an gelmedi.{' '}
          <Link to="/ucretsiz-oyunlar">Bedava oyunlar sayfasına bak</Link>
        </p>
      ) : (
        <div className="home-deal-strip home-scroll-row">
          {rows.map((game) => (
            <a
              key={game.id}
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="home-poster home-scroll-item"
            >
              <span className="home-poster-shot">
                <img
                  src={game.image || CARD_FALLBACK_IMAGE}
                  alt=""
                  width="320"
                  height="180"
                  loading="lazy"
                  onError={handleImageFallback}
                />
                <em>Ücretsiz</em>
              </span>
              <span className="home-poster-copy">
                <strong>{game.title}</strong>
                <small>{game.platform || 'Kampanya'}</small>
                <b>{valueLine(game)}</b>
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomeDealFeed;
