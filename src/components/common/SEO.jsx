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
 * Gelişmiş SEO Bileşeni
 * 
 * @param {string} title - Sayfa başlığı
 * @param {string} description - Sayfa açıklaması
 * @param {string} keywords - Anahtar kelimeler
 * @param {string} image - OG ve Twitter için görsel URL
 * @param {string} url - Sayfa URL'i (canonical için)
 * @param {string} type - OG tipi (website, article, product vb.)
 * @param {object|array} structuredData - JSON-LD yapılandırılmış veri
 * @param {string} robots - Robots meta direktifi
 * @param {string} author - Yazar bilgisi
 * @param {string} publishedTime - Yayınlanma tarihi (article için)
 * @param {string} modifiedTime - Güncellenme tarihi (article için)
 * @param {string} section - Makale bölümü/kategorisi
 * @param {array} tags - Etiketler
 * @param {boolean} noindex - Sayfayı indexleme
 * @param {object} breadcrumbs - Breadcrumb yapısı
 * @param {string} locale - Dil/bölge (varsayılan: tr_TR)
 * @param {array} alternateLocales - Alternatif dil versiyonları
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
  // Değerleri hazırla
  const fullTitle = generateTitle(title, true);
  const metaDescription = description || DEFAULT_META.description;
  const metaKeywords = keywords || DEFAULT_META.keywords;
  const canonicalUrl = getCanonicalUrl(url);
  const ogImage = getOgImageUrl(image);
  const robotsContent = noindex ? ROBOTS_DIRECTIVES.noindex : (robots || ROBOTS_DIRECTIVES.default);
  const metaAuthor = author || SITE_CONFIG.author;

  // Structured data array'e çevir (birden fazla schema destekle)
  const structuredDataArray = Array.isArray(structuredData) 
    ? structuredData 
    : structuredData 
      ? [structuredData] 
      : [];

  // Breadcrumb schema ekle (varsa)
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url ? `${SITE_CONFIG.url}${item.url}` : undefined,
      })),
    };
    structuredDataArray.push(breadcrumbSchema);
  }

  return (
    <Helmet>
      {/* Temel Meta Etiketleri */}
      <html lang={SITE_CONFIG.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta name="author" content={metaAuthor} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Dil ve Bölge */}
      <meta name="language" content="Turkish" />
      <meta httpEquiv="content-language" content={SITE_CONFIG.language} />
      <meta name="geo.region" content="TR" />
      <meta name="geo.placename" content="Turkey" />
      
      {/* Yeniden Ziyaret */}
      <meta name="revisit-after" content="3 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      
      {/* Tema Rengi */}
      <meta name="theme-color" content={SITE_CONFIG.themeColor} />
      <meta name="msapplication-TileColor" content={SITE_CONFIG.themeColor} />
      
      {/* Apple Spesifik */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={SITE_CONFIG.name} />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Open Graph / Facebook */}
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
      
      {/* Alternatif Diller */}
      {alternateLocales.map((altLocale) => (
        <meta key={altLocale} property="og:locale:alternate" content={altLocale} />
      ))}
      
      {/* Article Spesifik OG Etiketleri */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {metaAuthor && <meta property="article:author" content={metaAuthor} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      
      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />
      
      {/* Bing/Microsoft */}
      <meta name="msvalidate.01" content="" />
      
      {/* Google Site Verification (eğer varsa) */}
      {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> */}
      
      {/* DNS Prefetch & Preconnect */}
      <link rel="dns-prefetch" href="//yjnipjcevnxrzlgfmeci.supabase.co" />
      <link rel="preconnect" href="https://yjnipjcevnxrzlgfmeci.supabase.co" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* JSON-LD Structured Data */}
      {structuredDataArray.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
