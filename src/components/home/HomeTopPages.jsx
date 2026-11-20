import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';
import { coverSrc } from '../../lib/coverImage';

function formatVisits(n) {
  const value = Number(n) || 0;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M+`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K+`;
  return value.toLocaleString('tr-TR');
}

function HomeTopPages({ games = [], loading = false }) {
  const pages = useMemo(
    () =>
      [...games]
        .filter((game) => game?.slug)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5),
    [games]
  );

  if (!loading && pages.length === 0) return null;

  return (
    <section className="home-block" aria-labelledby="home-top-pages-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">En çok girilen sayfalar</p>
          <h2 id="home-top-pages-title">Şu an en çok bakılanlar</h2>
        </div>
        <Link to="/oyunlar" className="home-text-link">
          Tüm Oyunlar
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>

      <div className="home-top-pages">
        {loading && pages.length === 0
          ? [1, 2, 3, 4, 5].map((n) => <div key={n} className="home-top-card home-skeleton" aria-hidden />)
          : pages.map((game, index) => (
              <Link key={game.id} to={`/oyun/${game.slug}`} className="home-top-card">
                <span className="home-top-rank" aria-hidden>
                  {index + 1}
                </span>
                <span className="home-top-media">
                  <img
                    src={coverSrc(game, 640) || CARD_FALLBACK_IMAGE}
                    alt=""
                    width="320"
                    height="180"
                    loading="lazy"
                    decoding="async"
                    onError={handleImageFallback}
                  />
                </span>
                <span className="home-top-copy">
                  <strong>{game.name}</strong>
                  {(game.views || 0) > 0 ? (
                    <em>
                      <i />
                      {formatVisits(game.views)} görüntülenme
                    </em>
                  ) : game.category ? (
                    <em className="home-top-muted">{game.category}</em>
                  ) : null}
                </span>
              </Link>
            ))}
      </div>
    </section>
  );
}

export default HomeTopPages;
