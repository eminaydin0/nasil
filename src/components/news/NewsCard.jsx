import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, Clock, Eye, Flame } from 'lucide-react';
import { formatNewsDate, NEWS_FALLBACK_IMAGE } from '../../utils/newsContent';
import { computeTrendScore } from '../../lib/newsAlgorithm';
import { handleImageFallback } from '../../constants/media';

/**
 * variant:
 * - default     — dikey kart
 * - horizontal  — yatay kompakt (manşet yanı)
 * - overlay     — görsel üstü metin (küçük manşet)
 * - minimal     — sadece metin + küçük thumb (trend listesi)
 */
function NewsCard({ post, variant = 'default', showTrend = false, rank }) {
  const image = post.coverImage || NEWS_FALLBACK_IMAGE;
  const dateLabel = formatNewsDate(post.publishedAt || post.createdAt, 'short');
  const trendScore = post.trendScore ?? computeTrendScore(post);
  const isTrending = showTrend && trendScore >= 55;

  if (variant === 'minimal') {
    return (
      <Link to={`/haberler/${post.slug}`} className="news-card-minimal group">
        {rank != null && <span className="news-card-minimal-rank">{rank}</span>}
        <div className="min-w-0 flex-1">
          <p className="news-card-minimal-cat">{post.category}</p>
          <h3 className="news-card-minimal-title">{post.title}</h3>
          <p className="news-card-minimal-meta">
            {dateLabel}
            {post.readTimeMinutes > 0 && ` · ${post.readTimeMinutes} dk`}
          </p>
        </div>
        <div className="news-card-minimal-thumb">
          <img src={image} alt="" loading="lazy" onError={handleImageFallback} />
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link to={`/haberler/${post.slug}`} className="news-card-horizontal group">
        <div className="news-card-horizontal-media">
          <img src={image} alt={post.title} loading="lazy" onError={handleImageFallback} />
          {isTrending && (
            <span className="news-chip news-chip-live">
              <Flame size={10} aria-hidden />
              Trend
            </span>
          )}
        </div>
        <div className="news-card-horizontal-body">
          <span className="news-card-cat">{post.category}</span>
          <h3 className="news-card-title">{post.title}</h3>
          <p className="news-card-meta">
            {dateLabel}
            {post.readTimeMinutes > 0 && (
              <>
                <span aria-hidden>·</span>
                {post.readTimeMinutes} dk
              </>
            )}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'overlay') {
    return (
      <Link to={`/haberler/${post.slug}`} className="news-card-overlay group">
        <img src={image} alt={post.title} loading="lazy" className="news-card-overlay-img" onError={handleImageFallback} />
        <div className="news-card-overlay-shade" />
        <div className="news-card-overlay-content">
          <span className="news-chip news-chip-glass">{post.category}</span>
          <h3 className="news-card-overlay-title">{post.title}</h3>
          <p className="news-card-overlay-meta">{dateLabel}</p>
        </div>
      </Link>
    );
  }

  // default — editorial vertical
  const isFeatured = variant === 'featured';

  return (
    <Link
      to={`/haberler/${post.slug}`}
      className={`news-card group ${isFeatured ? 'news-card-featured' : ''}`}
      aria-label={post.title}
    >
      <div className="news-card-media">
        <img src={image} alt={post.title} loading="lazy" decoding="async" onError={handleImageFallback} />
        <div className="news-card-media-shade" />
        <div className="news-card-badges">
          <span className="news-chip news-chip-glass">{post.category}</span>
          {isTrending && (
            <span className="news-chip news-chip-live">
              <Flame size={10} aria-hidden />
              Trend
            </span>
          )}
          {post.isFeatured && <span className="news-chip news-chip-accent">Manşet</span>}
        </div>
        <span className="news-card-arrow" aria-hidden>
          <ArrowUpRight size={18} />
        </span>
      </div>

      <div className="news-card-body">
        <div className="news-card-meta-row">
          {dateLabel && (
            <span className="news-card-meta-item">
              <Calendar size={12} aria-hidden />
              {dateLabel}
            </span>
          )}
          {post.readTimeMinutes > 0 && (
            <span className="news-card-meta-item">
              <Clock size={12} aria-hidden />
              {post.readTimeMinutes} dk
            </span>
          )}
          {(post.viewCount ?? 0) > 0 && (
            <span className="news-card-meta-item">
              <Eye size={12} aria-hidden />
              {post.viewCount.toLocaleString('tr-TR')}
            </span>
          )}
        </div>
        <h3 className="news-card-title">{post.title}</h3>
        {(post.subtitle || post.excerpt) && (
          <p className="news-card-excerpt">{post.subtitle || post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

export default NewsCard;
