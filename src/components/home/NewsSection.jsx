import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import NewsCard from '../news/NewsCard';
import SkeletonLoader from '../common/SkeletonLoader';
import { useNews } from '../../hooks/useNews';

function NewsSection() {
  const { posts, loading } = useNews({ limit: 5, sort: 'trending' });

  if (!loading && posts.length === 0) return null;

  const hero = posts[0];
  const secondary = posts.slice(1, 3);
  const rest = posts.slice(3, 5);

  return (
    <section className="news-home-section" aria-labelledby="news-title">
      <div className="news-home-header">
        <div>
          <p className="news-home-eyebrow">
            <Sparkles size={14} aria-hidden />
            Gündem
          </p>
          <h2 id="news-title" className="news-home-title">
            Oyun Haberleri
          </h2>
        </div>
        <Link to="/haberler" className="news-home-link">
          Tüm haberler
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      {loading ? (
        <div className="news-home-skeleton grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonLoader key={i} type="game-card" />
          ))}
        </div>
      ) : (
        <>
          {/* Desktop editorial layout */}
          <div className="news-home-editorial hidden md:grid">
            {hero && (
              <div className="news-home-editorial-main">
                <NewsCard post={hero} variant="featured" showTrend />
              </div>
            )}
            <div className="news-home-editorial-side">
              {secondary.map((post) => (
                <NewsCard key={post.id} post={post} variant="horizontal" showTrend />
              ))}
              {rest.map((post) => (
                <NewsCard key={post.id} post={post} variant="overlay" showTrend />
              ))}
            </div>
          </div>

          {/* Mobile scroll */}
          <div className="home-scroll-row -mx-3 flex gap-3 overflow-x-auto px-3 pb-1 md:hidden">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="home-scroll-item w-[min(82vw,300px)] shrink-0"
              >
                <NewsCard post={post} variant={index === 0 ? 'featured' : 'default'} showTrend />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default NewsSection;
