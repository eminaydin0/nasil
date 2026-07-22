import { Link } from 'react-router-dom';
import { Clock, Eye, TrendingUp, ArrowRight } from 'lucide-react';
import { formatNewsDate, NEWS_FALLBACK_IMAGE } from '../../utils/newsContent';
import { computeTrendScore } from '../../lib/newsAlgorithm';
import { handleImageFallback } from '../../constants/media';

function NewsFeaturedHero({ post, className = '' }) {
  if (!post) return null;

  const image = post.coverImage || NEWS_FALLBACK_IMAGE;
  const dateLabel = formatNewsDate(post.publishedAt || post.createdAt);
  const trendScore = post.trendScore ?? computeTrendScore(post);

  return (
    <Link
      to={`/haberler/${post.slug}`}
      className={`news-masthead-hero group ${className}`}
    >
      <img
        src={image}
        alt={post.title}
        className="news-masthead-hero-img"
        onError={handleImageFallback}
      />
      <div className="news-masthead-hero-overlay" />

      <div className="news-masthead-hero-content">
        <div className="news-masthead-hero-chips">
          <span className="news-chip news-chip-accent">
            {post.isFeatured ? 'Manşet' : 'Gündem'}
          </span>
          <span className="news-chip news-chip-glass">{post.category}</span>
          {trendScore >= 60 && (
            <span className="news-chip news-chip-live">
              <TrendingUp size={11} aria-hidden />
              Trend
            </span>
          )}
        </div>

        <h2 className="news-masthead-hero-title">{post.title}</h2>

        {(post.subtitle || post.excerpt) && (
          <p className="news-masthead-hero-lead">{post.subtitle || post.excerpt}</p>
        )}

        <div className="news-masthead-hero-foot">
          <div className="news-masthead-hero-stats">
            {dateLabel && <span>{dateLabel}</span>}
            {post.readTimeMinutes > 0 && (
              <span className="inline-flex items-center gap-1">
                <Clock size={13} aria-hidden />
                {post.readTimeMinutes} dk
              </span>
            )}
            {(post.viewCount ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1">
                <Eye size={13} aria-hidden />
                {post.viewCount.toLocaleString('tr-TR')}
              </span>
            )}
          </div>
          <span className="news-masthead-hero-cta">
            Oku
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default NewsFeaturedHero;
