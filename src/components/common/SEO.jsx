import { Helmet } from 'react-helmet-async';
import {
  SITE_CONFIG,
  DEFAULT_META,
  ROBOTS_DIRECTIVES,
  getCanonicalUrl,
  generateTitle,
  getOgImageUrl,
} from '../../constants/seo';

/**
 * SEO bileşeni — crawler & sosyal paylaşımlar için meta + JSON-LD
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url = '',
  type = 'website',
  structuredData,
  robots,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  breadcrumbs,
  locale = SITE_CONFIG.locale,
  alternateLocales = [],
}) => {
  const fullTitle = generateTitle(title, true);
  const metaDescription = description || DEFAULT_META.description;
  const metaKeywords = keywords || DEFAULT_META.keywords;
  const canonicalUrl = getCanonicalUrl(url);
  const ogImage = getOgImageUrl(image);
  const robotsContent = noindex
    ? ROBOTS_DIRECTIVES.noindex
    : robots || ROBOTS_DIRECTIVES.default;
  const metaAuthor = author || SITE_CONFIG.author;

  const structuredDataArray = Array.isArray(structuredData)
    ? [...structuredData]
    : structuredData
      ? [structuredData]
      : [];

  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredDataArray.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url ? `${SITE_CONFIG.url}${item.url}` : undefined,
      })),
    });
  }

  return (
    <Helmet>
      <html lang={SITE_CONFIG.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta name="author" content={metaAuthor} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="tr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content={locale} />

      {alternateLocales.map((altLocale) => (
        <meta key={altLocale} property="og:locale:alternate" content={altLocale} />
      ))}

      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {section && <meta property="article:section" content={section} />}
          {metaAuthor && <meta property="article:author" content={metaAuthor} />}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      <meta name="theme-color" content={SITE_CONFIG.themeColor} />

      {structuredDataArray.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
