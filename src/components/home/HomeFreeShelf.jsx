import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useDeals } from '../../hooks/useDeals';
import { formatUsd } from '../../lib/cheapShark';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';

function HomeFreeShelf() {
  const { deals, loading, error } = useDeals({ pageSize: 4, sortBy: 'Deal Rating' });
  const rows = deals.slice(0, 4);

  if (!loading && (error || rows.length === 0)) return null;

  return (
    <section className="home-block" aria-labelledby="home-free-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">İndirimli oyunlar</p>
          <h2 id="home-free-title">Fırsat şeridi</h2>
        </div>
        <Link to="/indirimler" className="home-text-link">
          Tüm indirimler
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
          {rows.map((deal) => (
            <a
              key={deal.id}
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="home-free-card"
            >
              <img
                src={deal.image || deal.thumb || CARD_FALLBACK_IMAGE}
                alt=""
                width="96"
                height="72"
                loading="lazy"
                onError={handleImageFallback}
              />
              <span>
                <em className="is-deal">{deal.savings > 0 ? `-%${deal.savings}` : 'İndirim'}</em>
                <strong>{deal.title}</strong>
                <small>
                  {deal.storeName}
                  {deal.salePrice === 0 ? ' · Ücretsiz' : ` · ${formatUsd(deal.salePrice)}`}
                </small>
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomeFreeShelf;
