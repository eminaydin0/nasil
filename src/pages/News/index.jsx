import { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, Clock, Flame, Sparkles } from 'lucide-react';
import NewsCard from '../../components/news/NewsCard';
import NewsFeaturedHero from '../../components/news/NewsFeaturedHero';
import NewsSidebar from '../../components/news/NewsSidebar';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useNews } from '../../hooks/useNews';
import { PAGE_SEO, SCHEMA_TEMPLATES, SITE_CONFIG } from '../../constants/seo';
import { buildNewsListSeoMeta } from '../../lib/seoEngine';
import { pickFeaturedPost, rankNewsPosts } from '../../lib/newsAlgorithm';
import { NEWS_CATEGORIES } from '../../utils/newsContent';

const SORT_TABS = [
  { id: 'trending', label: 'Trend', icon: TrendingUp },
  { id: 'latest', label: 'En Yeni', icon: Clock },
  { id: 'popular', label: 'Popüler', icon: Flame },
];

const FILTER_CATEGORIES = ['Tümü', ...NEWS_CATEGORIES];

function NewsPage() {
  const [sort, setSort] = useState('trending');
  const { posts, rawPosts, loading } = useNews({ sort });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let list = posts;

    if (selectedCategory !== 'Tümü') {
      list = list.filter((post) => post.category === selectedCategory);
    }

    if (term) {
      list = list.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.subtitle?.toLowerCase().includes(term) ||
          (post.tags || []).some((t) => t.toLowerCase().includes(term))
      );
    }

    return list;
  }, [posts, searchTerm, selectedCategory]);

  const showMasthead = !searchTerm && selectedCategory === 'Tümü' && sort === 'trending';

  const featuredPost = useMemo(() => {
    if (!showMasthead) return null;
    return pickFeaturedPost(rawPosts);
  }, [rawPosts, showMasthead]);

  const mastheadSide = useMemo(() => {
    if (!featuredPost) return filteredPosts.slice(0, 2);
    return filteredPosts.filter((p) => p.id !== featuredPost.id).slice(0, 2);
  }, [filteredPosts, featuredPost]);

  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    const excludeIds = new Set([featuredPost.id, ...mastheadSide.map((p) => p.id)]);
    return filteredPosts.filter((p) => !excludeIds.has(p.id));
  }, [filteredPosts, featuredPost, mastheadSide]);

  const categoryTabs = useMemo(() => {
    const counts = {};
    rawPosts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return FILTER_CATEGORIES.filter((name) => name === 'Tümü' || counts[name] > 0).map(
      (name) => ({
        name,
        count: name === 'Tümü' ? rawPosts.length : counts[name] || 0,
      })
    );
  }, [rawPosts]);

  const seoMeta = useMemo(
    () => buildNewsListSeoMeta(filteredPosts, { category: selectedCategory, searchTerm }),
    [filteredPosts, selectedCategory, searchTerm]
  );

  const structuredData = useMemo(
    () =>
      [
        SCHEMA_TEMPLATES.webPage(seoMeta.title, seoMeta.description, seoMeta.url),
        filteredPosts.length > 0
          ? {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Oyun Haberleri',
              numberOfItems: filteredPosts.length,
              itemListElement: rankNewsPosts(filteredPosts, { sort: 'trending' })
                .slice(0, 10)
                .map((p, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'NewsArticle',
                    headline: p.seoTitle || p.title,
                    description: p.excerpt,
                    url: `${SITE_CONFIG.url}/haberler/${p.slug}`,
                    datePublished: p.publishedAt || p.createdAt,
                  },
                })),
            }
          : null,
      ].filter(Boolean),
    [seoMeta, filteredPosts]
  );

  const breadcrumbs = [{ name: 'Haberler', url: null }];

  return (
    <div className="news-hub">
      <SEO
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords || PAGE_SEO.news.keywords}
        url={seoMeta.url}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      {/* Editorial header */}
      <header className="news-hub-header">
        <div className="news-hub-header-glow" aria-hidden />
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbs} className="news-hub-breadcrumb" />
          <div className="news-hub-header-inner">
            <div>
              <p className="news-hub-eyebrow">
                <Sparkles size={14} aria-hidden />
                Oyun dünyasından son dakika
              </p>
              <h1 className="news-hub-title">Haberler</h1>
              <p className="news-hub-subtitle">
                Çıkış tarihleri, fiyatlar, güncellemeler ve trend haberler — tek adreste.
              </p>
            </div>
            <div className="news-hub-header-stats">
              <div className="news-hub-stat">
                <span className="news-hub-stat-value">{rawPosts.length}</span>
                <span className="news-hub-stat-label">haber</span>
              </div>
              <div className="news-hub-stat">
                <span className="news-hub-stat-value">{categoryTabs.length - 1}</span>
                <span className="news-hub-stat-label">kategori</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-16 pt-6 sm:pt-8">
        {/* Toolbar */}
        <div className="news-hub-toolbar">
          <div className="news-hub-sort">
            {SORT_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSort(id)}
                className={`news-hub-sort-btn ${sort === id ? 'is-active' : ''}`}
              >
                <Icon size={14} aria-hidden />
                {label}
              </button>
            ))}
          </div>

          <div className="news-hub-search">
            <Search size={16} className="news-hub-search-icon" aria-hidden />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Haber ara..."
              className="news-hub-search-input"
            />
          </div>
        </div>

        <div className="news-hub-categories">
          {categoryTabs.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelectedCategory(name)}
              className={`news-hub-cat ${selectedCategory === name ? 'is-active' : ''}`}
            >
              {name}
              <span className="news-hub-cat-count">{count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="news-hub-grid mt-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonLoader key={i} type="game-card" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="news-hub-empty">
            <NewspaperIcon />
            <h2>Haber bulunamadı</h2>
            <p>Arama veya filtreyi değiştirmeyi deneyin.</p>
          </div>
        ) : (
          <div className="news-hub-layout">
            <div className="news-hub-main">
              {showMasthead && featuredPost && (
                <section className="news-hub-masthead" aria-label="Manşet">
                  <NewsFeaturedHero post={featuredPost} />
                  {mastheadSide.length > 0 && (
                    <div className="news-hub-masthead-side">
                      {mastheadSide.map((post) => (
                        <NewsCard key={post.id} post={post} variant="horizontal" showTrend />
                      ))}
                    </div>
                  )}
                </section>
              )}

              <section className="news-hub-grid" aria-label="Haber listesi">
                {gridPosts.map((post, index) => (
                  <NewsCard
                    key={post.id}
                    post={post}
                    variant={index === 0 && !featuredPost ? 'featured' : 'default'}
                    showTrend
                  />
                ))}
              </section>
            </div>

            <NewsSidebar trendingPosts={rawPosts} mode="list" />
          </div>
        )}
      </div>
    </div>
  );
}

function NewspaperIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-warm-300" aria-hidden>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" />
    </svg>
  );
}

export default NewsPage;
