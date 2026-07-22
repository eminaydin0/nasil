/**
 * Sitemap & prerender için paylaşılan route tanımları.
 * generate-sitemap.js ve prerender-meta.js bu modülü kullanır.
 */

import { PAGE_SEO } from './seo.js';
import { TOOL_PAGE_SEO } from './seoKeywords.js';

export const SITEMAP_BASE_URL = 'https://kuraline.xyz';

/** Sitemap'e dahil edilmeyecek test / taslak oyunlar */
export const JUNK_GAME_SLUGS = new Set(['test', 'emin', 'deneme', 'demo', 'asdf', 'aaa']);
export const JUNK_SLUG_PATTERN = /^(test|demo|deneme)(-|_|$)/i;

export function isPublishableGame(game) {
  const slug = String(game?.slug || '').trim().toLowerCase();
  const name = String(game?.name || '').trim().toLowerCase();
  if (!slug || slug.length < 2) return false;
  if (JUNK_GAME_SLUGS.has(slug)) return false;
  if (JUNK_SLUG_PATTERN.test(slug)) return false;
  if (name === 'test' || name === 'deneme') return false;
  return true;
}

/** Statik sayfa rotaları */
export const STATIC_SITEMAP_PAGES = [
  { path: '', changefreq: 'daily', priority: '1.0', ...PAGE_SEO.home },
  { path: '/oyunlar', changefreq: 'daily', priority: '0.9', ...PAGE_SEO.allGames },
  { path: '/haberler', changefreq: 'daily', priority: '0.85', ...PAGE_SEO.news },
  { path: '/ucretsiz-oyunlar', changefreq: 'daily', priority: '0.88', ...PAGE_SEO.freeGames },
  { path: '/indirimler', changefreq: 'daily', priority: '0.85', ...PAGE_SEO.deals },
  { path: '/araclar', changefreq: 'weekly', priority: '0.85', ...PAGE_SEO.tools },
  { path: '/hakkimizda', changefreq: 'monthly', priority: '0.6', ...PAGE_SEO.about },
  { path: '/iletisim', changefreq: 'monthly', priority: '0.6', ...PAGE_SEO.contact },
  { path: '/kullanim-kosullari', changefreq: 'monthly', priority: '0.5', ...PAGE_SEO.terms },
  { path: '/gizlilik', changefreq: 'monthly', priority: '0.5', ...PAGE_SEO.privacy },
  { path: '/cerez-politikasi', changefreq: 'monthly', priority: '0.5', ...PAGE_SEO.cookie },
  { path: '/reklam-verin', changefreq: 'monthly', priority: '0.6', ...PAGE_SEO.reklamVerin },
];

/** Araç sayfaları — TOOL_PAGE_SEO + slug eşlemesi */
export const TOOL_SITEMAP_SLUGS = [
  '101-yazboz',
  'okey-sayaci',
  'batak-yazboz',
  'takim-olusturucu',
  'halisaha-takim-olusturucu',
  'karar-carki',
  'kura-cek',
  'zar-at',
  'skor-tablosu',
];

export function getToolSitemapPages() {
  return TOOL_SITEMAP_SLUGS.map((slug) => {
    const seo = TOOL_PAGE_SEO[slug] || {};
    return {
      path: `/araclar/${slug}`,
      changefreq: 'monthly',
      priority: '0.75',
      title: seo.title || slug,
      description: seo.description || '',
      keywords: seo.keywords || '',
    };
  });
}

/** Prerender / meta için statik + araç rotaları */
export function getStaticPrerenderRoutes() {
  return [
    ...STATIC_SITEMAP_PAGES.map(({ path, title, description, keywords }) => ({
      path: path || '/',
      title,
      description,
      keywords,
    })),
    ...getToolSitemapPages().map(({ path, title, description, keywords }) => ({
      path,
      title,
      description,
      keywords,
    })),
  ];
}

/**
 * Karşılaştırma sayfası çiftleri.
 * Her oyun için ayni kategoride en fazla 3 komşu ile esler.
 */
export function generateComparisonPairs(games) {
  const pairs = new Set();
  const result = [];
  const byCategory = {};

  games.forEach((g) => {
    if (!g.category) return;
    if (!byCategory[g.category]) byCategory[g.category] = [];
    byCategory[g.category].push(g);
  });

  Object.values(byCategory).forEach((bucket) => {
    bucket.forEach((gameA, i) => {
      bucket.slice(i + 1, i + 4).forEach((gameB) => {
        const [slugA, slugB] = [gameA.slug, gameB.slug].sort();
        const key = `${slugA}-vs-${slugB}`;
        if (!pairs.has(key)) {
          pairs.add(key);
          result.push({ slugA, slugB, gameA, gameB });
        }
      });
    });
  });

  return result;
}

export function buildSitemapLoc(path) {
  if (!path || path === '/') return `${SITEMAP_BASE_URL}/`;
  return `${SITEMAP_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
