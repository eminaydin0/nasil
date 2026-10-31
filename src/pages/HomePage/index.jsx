import { useMemo } from 'react';
import SEO from '../../components/common/SEO';
import HomeHero from '../../components/home/HomeHero';
import HomeCategoryRail from '../../components/home/HomeCategoryRail';
import HomeSpotlight from '../../components/home/HomeSpotlight';
import HomeNewsDesk from '../../components/home/HomeNewsDesk';
import HomeDealFeed from '../../components/home/HomeDealFeed';
import HomeFreeShelf from '../../components/home/HomeFreeShelf';
import HomeToolRail from '../../components/home/HomeToolRail';
import HomeKurAli from '../../components/home/HomeKurAli';
import HomeAbout from '../../components/home/HomeAbout';
import WhenVisible from '../../components/common/WhenVisible';
import { useGames } from '../../hooks/useGames';
import { getCategoriesWithCounts } from '../../constants/categories';
import { useCategories } from '../../hooks/useCategories';
import {
  PAGE_SEO,
  SCHEMA_TEMPLATES,
  SITE_CONFIG,
  generateItemListSchema,
  generateFAQSchema,
} from '../../constants/seo';
import { buildHomeSeoMeta, buildHomeFaqs } from '../../lib/seoEngine';
import { generateHomeSitelinkSchemas } from '../../constants/siteNavigation';
import { SITE_TOOLS } from '../../constants/tools';

function HomePage() {
  const { games, loading } = useGames();
  const { categories: dbCategories } = useCategories();
  const categories = useMemo(
    () => getCategoriesWithCounts(games, dbCategories),
    [games, dbCategories]
  );

  const homeSeo = useMemo(() => buildHomeSeoMeta(games), [games]);

  const structuredData = useMemo(() => {
    const schemas = [
      SCHEMA_TEMPLATES.website,
      SCHEMA_TEMPLATES.organization,
      ...generateHomeSitelinkSchemas(),
    ];

    if (games.length > 0) {
      const byViews = [...games].sort((a, b) => (b.views || 0) - (a.views || 0));
      schemas.push(generateItemListSchema(byViews.slice(0, 10), 'Popüler Oyunlar'));
    }

    schemas.push(generateFAQSchema(buildHomeFaqs(games)));
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Oyun araçları',
      itemListElement: SITE_TOOLS.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        url: `${SITE_CONFIG.url}${tool.link}`,
      })),
    });
    return schemas;
  }, [games]);

  return (
    <div className="home-night">
      {!loading && (
        <SEO
          title={PAGE_SEO.home.title}
          description={homeSeo.description}
          keywords={homeSeo.keywords || PAGE_SEO.home.keywords}
          url="/"
          structuredData={structuredData}
          breadcrumbs={[{ name: 'Ana Sayfa', url: '/' }]}
        />
      )}

      <HomeHero games={games} />
      <div className="container mx-auto px-3 pb-6 sm:px-4 sm:pb-10">
        <HomeCategoryRail categories={categories} loading={loading} />
        <HomeToolRail />
        <HomeKurAli />
        <HomeSpotlight games={games} loading={loading} />
        <HomeNewsDesk />
        <WhenVisible className="home-reveal">
          <HomeDealFeed />
        </WhenVisible>
        <WhenVisible className="home-reveal">
          <HomeFreeShelf />
        </WhenVisible>
        <HomeAbout />
      </div>
    </div>
  );
}

export default HomePage;
