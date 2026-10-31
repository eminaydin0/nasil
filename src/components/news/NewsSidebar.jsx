import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, List, TrendingUp } from 'lucide-react';
import { extractHeadings, formatNewsDate } from '../../utils/newsContent';
import { rankNewsPosts } from '../../lib/newsAlgorithm';
import NewsCard from './NewsCard';

function NewsSidebar({ content, trendingPosts = [], currentSlug, mode = 'detail' }) {
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState(headings[0]?.id || '');
  const trending = rankNewsPosts(
    trendingPosts.filter((p) => p.slug !== currentSlug),
    { sort: 'trending' }
  ).slice(0, mode === 'list' ? 6 : 5);

  useEffect(() => {
    if (mode !== 'detail' || headings.length === 0) return undefined;

    const nodes = headings.map((heading) => document.getElementById(heading.id)).filter(Boolean);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.4, 1] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [mode, content, headings.length]);

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

      {mode === 'detail' && (headings.length > 0 || trending.length > 0) && (
        <div className="news-sidebar-rail">
          {headings.length > 0 && (
            <nav className="news-rail-section" aria-label="İçindekiler">
              <h2 className="news-rail-label">
                <List size={14} aria-hidden />
                İçindekiler
              </h2>
              <ol className="news-toc">
                {headings.map(({ id, text }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={`news-toc-link ${activeId === id ? 'is-active' : ''}`}
                      onClick={() => setActiveId(id)}
                    >
                      <span>{text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {trending.length > 0 && (
            <div className="news-rail-section">
              <h2 className="news-rail-label">
                <Flame size={14} aria-hidden />
                Trend haberler
              </h2>
              <ul className="news-trend-list">
                {trending.map((post, index) => (
                  <li key={post.id}>
                    <Link to={`/haberler/${post.slug}`} className="news-trend-item group">
                      <span className="news-trend-rank">{index + 1}</span>
                      <span className="news-trend-copy">
                        <span className="news-trend-title">{post.title}</span>
                        <span className="news-trend-meta">
                          <span>{formatNewsDate(post.publishedAt || post.createdAt, 'short')}</span>
                          {(post.trendScore ?? 0) >= 50 && (
                            <span className="news-trend-flag">
                              <TrendingUp size={10} aria-hidden />
                              Trend
                            </span>
                          )}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export default NewsSidebar;
