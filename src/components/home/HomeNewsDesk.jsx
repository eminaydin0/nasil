import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useNews } from '../../hooks/useNews';
import { CARD_FALLBACK_IMAGE } from '../../constants/media';
import { formatNewsDate } from '../../utils/newsContent';

function HomeNewsDesk() {
  const { posts, loading } = useNews({ limit: 5, sort: 'trending' });
  if (!loading && posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section className="home-block" aria-labelledby="home-news-desk-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">Haberler</p>
          <h2 id="home-news-desk-title">Gündem masası</h2>
        </div>
        <Link to="/haberler" className="home-text-link">
          Tüm haberler
          <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>

      <div className="home-desk">
        {loading && !featured ? (
          <div className="home-feature home-skeleton" aria-hidden />
        ) : featured ? (
          <Link to={`/haberler/${featured.slug}`} className="home-feature group">
            <img
              src={featured.coverImage || CARD_FALLBACK_IMAGE}
              alt=""
              width="960"
              height="540"
              loading="lazy"
            />
            <div className="home-feature-shade" aria-hidden />
            <div className="home-feature-body">
              <p className="home-kicker">{featured.category || 'Haber'}</p>
              <h3>{featured.title}</h3>
              {featured.excerpt ? <p>{featured.excerpt}</p> : null}
              <small className="text-xs font-semibold text-white/55">
                {formatNewsDate(featured.publishedAt || featured.createdAt, 'short')}
              </small>
            </div>
          </Link>
        ) : null}

        <div className="home-desk-list">
          {loading && rest.length === 0
            ? [1, 2, 3, 4].map((n) => <div key={n} className="home-desk-row home-skeleton" aria-hidden />)
            : rest.map((post) => (
                <Link key={post.id} to={`/haberler/${post.slug}`} className="home-desk-row">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt="" width="72" height="72" loading="lazy" />
                  ) : (
                    <span className="home-desk-mark" aria-hidden />
                  )}
                  <span className="home-desk-copy">
                    <em>{post.category || 'Haber'}</em>
                    <strong>{post.title}</strong>
                    <small>{formatNewsDate(post.publishedAt || post.createdAt, 'short')}</small>
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

export default HomeNewsDesk;
