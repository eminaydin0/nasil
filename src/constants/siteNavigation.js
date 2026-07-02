/**
 * Google sitelink adayları — header, footer, schema ve ana sayfa hub ile senkron.
 * Sitelink'ler Google tarafından otomatik seçilir; bu liste yapıyı netleştirir.
 */

import { SITE_CONFIG, PAGE_SEO } from './seo.js';

/** Ana site bölümleri (ShiftDelete tarzı sitelink hedefleri) */
export const SITE_SITELINK_SECTIONS = [
  {
    id: 'oyunlar',
    label: 'Oyunlar',
    href: '/oyunlar',
    description:
      'Okey, Batak, Pişti ve 50+ oyun rehberi. Geleneksel, masa, PC ve konsol oyunlarının kuralları.',
  },
  {
    id: 'haberler',
    label: 'Haberler',
    href: '/haberler',
    description:
      'Oyun dünyasından güncel haberler, çıkış tarihleri, fiyatlar ve Steam indirimleri.',
  },
  {
    id: 'bedava',
    label: 'Bedava Oyunlar',
    href: '/ucretsiz-oyunlar',
    description:
      'Steam, Epic Games ve GOG ücretsiz oyun kampanyaları — anlık bedava PC oyunları.',
  },
  {
    id: 'araclar',
    label: 'Araçlar',
    href: '/araclar',
    description:
      '101 yazboz, okey sayacı, batak yazboz, karar çarkı ve halı saha takım oluşturucu.',
  },
  {
    id: 'iletisim',
    label: 'İletişim',
    href: '/iletisim',
    description: PAGE_SEO.contact.description,
  },
  {
    id: 'hakkimizda',
    label: 'Hakkımızda',
    href: '/hakkimizda',
    description: PAGE_SEO.about.description,
  },
];

function absUrl(path) {
  if (!path || path === '/') return `${SITE_CONFIG.url}/`;
  return `${SITE_CONFIG.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/** SiteNavigationElement — her ana bölüm için */
export function generateSiteNavigationSchema() {
  return SITE_SITELINK_SECTIONS.map((section, index) => ({
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': `${absUrl(section.href)}#navigation`,
    position: index + 1,
    name: section.label,
    url: absUrl(section.href),
    description: section.description,
    isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
  }));
}

/** WebSite + hasPart — ana bölüm sayfalarını bağlar */
export function generateWebSiteWithSitelinksSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.name,
    alternateName: ['Kuralı Ne', 'kuraline.xyz', 'Kuraline'],
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.mission,
    inLanguage: 'tr-TR',
    publisher: { '@id': `${SITE_CONFIG.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/oyunlar?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    hasPart: SITE_SITELINK_SECTIONS.map((section) => ({
      '@type': 'WebPage',
      '@id': `${absUrl(section.href)}#webpage`,
      name: section.label,
      url: absUrl(section.href),
      description: section.description,
      isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
      inLanguage: 'tr-TR',
    })),
  };
}

/** ItemList — ana bölümler listesi (Google list rich results) */
export function generateSiteSectionsItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE_CONFIG.name} — Ana Bölümler`,
    description: 'Sitedeki temel oyun rehberi, haber, araç ve iletişim bölümleri.',
    numberOfItems: SITE_SITELINK_SECTIONS.length,
    itemListElement: SITE_SITELINK_SECTIONS.map((section, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: section.label,
      url: absUrl(section.href),
      description: section.description,
    })),
  };
}

/** Ana sayfa için tüm sitelink schema paketi */
export function generateHomeSitelinkSchemas() {
  return [
    generateWebSiteWithSitelinksSchema(),
    ...generateSiteNavigationSchema(),
    generateSiteSectionsItemListSchema(),
  ];
}
