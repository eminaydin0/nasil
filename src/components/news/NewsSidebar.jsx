import { Link } from 'react-router-dom';
import { Flame, List, TrendingUp } from 'lucide-react';
import { extractHeadings, formatNewsDate } from '../../utils/newsContent';
import { rankNewsPosts } from '../../lib/newsAlgorithm';
import NewsCard from './NewsCard';

function NewsSidebar({ content, trendingPosts = [], currentSlug, mode = 'detail' }) {
  const headings = extractHeadings(content);
  const trending = rankNewsPosts(
    trendingPosts.filter((p) => p.slug !== currentSlug),
    { sort: 'trending' }
  ).slice(0, mode === 'list' ? 6 : 5);

  return (
    <aside className={`news-sidebar ${mode === 'list' ? 'news-sidebar-list' : ''}`}>
      {mode === 'list' && trending.length > 0 && (
        <div className="news-sidebar-panel news-sidebar-panel-accent">
          <h2 className="news-sidebar-title">
            <Flame size={16} aria-hidden />
            Günün trendleri
          </h2>
          <ul className="news-sidebar-trend-list">
            {trending.map((post, index) => (
              <li key={post.id}>
                <NewsCard post={post} variant="minimal" rank={index + 1} showTrend />
              </li>
            ))}
          </ul>
        </div>
      )}

      {headings.length > 0 && (
        <nav className="news-sidebar-panel news-sidebar-sticky" aria-label="İçindekiler">
          <h2 className="news-sidebar-title">
            <List size={16} aria-hidden />
            İçindekiler
          </h2>
          <ol className="news-toc">
            {headings.map(({ id, text }) => (
              <li key={id}>
                <a href={`#${id}`} className="news-toc-link">
                  {text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {mode === 'detail' && trending.length > 0 && (
        <div className="news-sidebar-panel news-sidebar-sticky">
          <h2 className="news-sidebar-title">
            <Flame size={16} aria-hidden />
            Trend haberler
          </h2>
          <ul className="space-y-1">
            {trending.map((post, index) => (
              <li key={post.id}>
                <Link to={`/haberler/${post.slug}`} className="news-trend-item group">
                  <span className="news-trend-rank">{index + 1}</span>
                  <div className="min-w-0">
                    <p className="font-bold leading-snug text-warm-900 group-hover:text-orange-600 line-clamp-2">
                      {post.title}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-warm-500">
                      <span>{formatNewsDate(post.publishedAt || post.createdAt, 'short')}</span>
                      {(post.trendScore ?? 0) >= 50 && (
                        <span className="inline-flex items-center gap-0.5 text-orange-600">
                          <TrendingUp size={10} aria-hidden />
                          Trend
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

export default NewsSidebar;
