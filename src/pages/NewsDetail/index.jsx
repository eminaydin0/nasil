import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { Calendar, Clock, Eye, Gamepad2, ArrowLeft, User, Tag } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import ErrorPage from '../ErrorPage';
import { useNewsPost } from '../../hooks/useNewsPost';
import { useNews } from '../../hooks/useNews';
import NewsCard from '../../components/news/NewsCard';
import NewsContent from '../../components/news/NewsContent';
import NewsShareBar from '../../components/news/NewsShareBar';
import NewsSidebar from '../../components/news/NewsSidebar';
import NewsReadingProgress from '../../components/news/NewsReadingProgress';
import NewsEngagement from '../../components/news/NewsEngagement';
import { buildNewsSeoMeta, buildNewsStructuredData } from '../../lib/seoEngine';
import { getRelatedNewsPosts } from '../../lib/newsAlgorithm';
import { formatNewsDate, NEWS_FALLBACK_IMAGE } from '../../utils/newsContent';
import { trackNewsView } from '../../utils/analytics';

function NewsDetailPage() {
  const { slug } = useParams();
  const { post, loading, error } = useNewsPost(slug);
  const { rawPosts: allPosts } = useNews({ sort: 'trending' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (post) trackNewsView(post.title, post.id, post.category);
  }, [post]);

  const seoMeta = useMemo(() => buildNewsSeoMeta(post), [post]);
  const structuredData = useMemo(() => buildNewsStructuredData(post), [post]);

  const breadcrumbs = useMemo(() => {
    if (!post) return [];
    return [
      { name: 'Haberler', url: '/haberler' },
      { name: post.title, url: null },
    ];
  }, [post]);

  const relatedPosts = useMemo(
    () => (post ? getRelatedNewsPosts(post, allPosts, 3) : []),
    [post, allPosts]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <SkeletonLoader type="game-detail" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <ErrorPage
        status={404}
        message="Haber bulunamadı veya yayından kaldırılmış olabilir."
      />
    );
  }

  const coverImage = post.coverImage || NEWS_FALLBACK_IMAGE;
  const dateLabel = formatNewsDate(post.publishedAt || post.createdAt);
  const lead = post.subtitle || post.excerpt;

  return (
    <div className="news-article-page">
      <NewsReadingProgress />

      <SEO
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        url={seoMeta.url}
        image={seoMeta.image}
        imageAlt={seoMeta.imageAlt}
        type="article"
        author={seoMeta.author}
        publishedTime={seoMeta.publishedTime}
        modifiedTime={seoMeta.modifiedTime}
        section={seoMeta.section}
        tags={seoMeta.tags}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      {/* Full-bleed hero */}
      <header className="news-article-hero">
        <img
          src={coverImage}
          alt=""
          aria-hidden
          className="news-article-hero-bg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = NEWS_FALLBACK_IMAGE;
          }}
        />
        <div className="news-article-hero-overlay" />

        <div className="container relative mx-auto max-w-5xl px-4 pb-12 pt-6 sm:pb-16 sm:pt-10">
          <Breadcrumb items={breadcrumbs} className="news-article-breadcrumb" />

          <Link to="/haberler" className="news-article-back">
            <ArrowLeft size={16} aria-hidden />
            Haberler
          </Link>

          <div className="news-article-hero-chips">
            <span className="news-chip news-chip-accent">{post.category}</span>
            {post.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="news-chip news-chip-glass">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="news-article-title">{post.title}</h1>

          {lead && <p className="news-article-deck">{lead}</p>}

          <div className="news-article-byline">
            <div className="news-article-author">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt="" className="news-article-avatar" />
              ) : (
                <span className="news-article-avatar news-article-avatar-fallback">
                  <User size={16} aria-hidden />
                </span>
              )}
              <div>
                <p className="news-article-author-name">{post.author}</p>
                <p className="news-article-author-role">Kuralı Ne? Editör</p>
              </div>
            </div>

            <ul className="news-article-stats">
              {dateLabel && (
                <li>
                  <Calendar size={14} aria-hidden />
                  {dateLabel}
                </li>
              )}
              <li>
                <Clock size={14} aria-hidden />
                {post.readTimeMinutes} dk okuma
              </li>
              <li>
                <Eye size={14} aria-hidden />
                {(post.viewCount ?? 0).toLocaleString('tr-TR')}
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Article body */}
      <div className="container mx-auto max-w-6xl px-4 pb-16">
        <div className="news-article-layout">
          <div className="news-article-share-col hidden lg:block">
            <NewsShareBar title={post.title} url={`/haberler/${post.slug}`} layout="sticky" />
          </div>

          <article className="news-article-sheet">
            <figure className="news-article-cover">
              <img src={coverImage} alt={post.title} width="1200" height="630" />
            </figure>

            <div className="news-article-content-wrap">
              <NewsContent content={post.content} />
            </div>

            {post.tags?.length > 0 && (
              <footer className="news-article-tags">
                <Tag size={14} aria-hidden />
                {post.tags.map((tag) => (
                  <span key={tag} className="news-article-tag">
                    {tag}
                  </span>
                ))}
              </footer>
            )}

            <div className="news-article-share-mobile lg:hidden">
              <NewsShareBar title={post.title} url={`/haberler/${post.slug}`} layout="inline" />
            </div>

            {post.relatedGame && (
              <aside className="news-article-game">
                <p className="news-article-game-label">
                  <Gamepad2 size={16} aria-hidden />
                  İlgili oyun rehberi
                </p>
                <Link to={`/oyun/${post.relatedGame.slug}`} className="news-article-game-card group">
                  {post.relatedGame.image && (
                    <img src={post.relatedGame.image} alt={post.relatedGame.name} />
                  )}
                  <div>
                    <p className="news-article-game-name">{post.relatedGame.name}</p>
                    {post.relatedGame.shortDescription && (
                      <p className="news-article-game-desc">{post.relatedGame.shortDescription}</p>
                    )}
                  </div>
                </Link>
              </aside>
            )}
          </article>

          <NewsSidebar content={post.content} trendingPosts={allPosts} currentSlug={slug} />
        </div>

        <NewsEngagement post={post} />

        {relatedPosts.length > 0 && (
          <section className="news-article-related" aria-labelledby="related-news">
            <div className="news-article-related-head">
              <h2 id="related-news">İlgili haberler</h2>
              <Link to="/haberler" className="news-article-related-link">
                Tümünü gör
              </Link>
            </div>
            <div className="news-hub-grid news-hub-grid-compact">
              {relatedPosts.map((item) => (
                <NewsCard key={item.id} post={item} showTrend />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default NewsDetailPage;
