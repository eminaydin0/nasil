import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useDeals } from '../../hooks/useDeals';
import { formatUsd } from '../../lib/cheapShark';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';

function HomeDealFeed() {
  const { deals, loading, error } = useDeals({ pageSize: 8, sortBy: 'Deal Rating' });
  const rows = deals.slice(0, 8);

  return (
    <section className="home-block" aria-labelledby="home-deals-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">İndirimli oyunlar</p>
          <h2 id="home-deals-title">Fırsat şeridi</h2>
        </div>
        <Link to="/indirimler" className="home-text-link">
          Tüm indirimler
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
          İndirim listesi şu an gelmedi.{' '}
          <Link to="/indirimler">İndirimler sayfasına bak</Link>
        </p>
      ) : (
        <div className="home-deal-strip home-scroll-row">
          {rows.map((deal) => (
            <a
              key={deal.id}
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="home-poster home-scroll-item"
            >
              <span className="home-poster-shot">
                <img
                  src={deal.image || deal.thumb || CARD_FALLBACK_IMAGE}
                  alt=""
                  width="320"
                  height="180"
                  loading="lazy"
                  onError={handleImageFallback}
                />
                {deal.savings > 0 ? <em>-%{deal.savings}</em> : null}
              </span>
              <span className="home-poster-copy">
                <strong>{deal.title}</strong>
                <small>{deal.storeName}</small>
                <b>{deal.salePrice === 0 ? 'Ücretsiz' : formatUsd(deal.salePrice)}</b>
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomeDealFeed;
