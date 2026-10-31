/**
 * Build sonrası eksik statik HTML için dinamik meta enjeksiyonu.
 * Destek: news | game | category | compare
 */
import { createClient } from '@supabase/supabase-js';
import { getGameSeoHeadline } from '../src/constants/seo.js';
import { absoluteCover } from '../src/lib/coverImage.js';
import {
  categoryDescription,
  categoryTitle,
  comparisonDescription,
  comparisonTitle,
  gameDescription,
  withBrand,
} from '../src/lib/seoMeta.js';
import { canonicalNewsSlug, storedNewsSlug } from '../src/constants/newsSlugRedirects.js';
import { categoryToSlug } from '../src/utils/categorySlug.js';
import { isSameFamily } from '../src/constants/comparisonFamilies.js';
import { isPublishableGame } from '../src/constants/sitemapRoutes.js';

const SITE_URL = 'https://kuraline.xyz';
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://yjnipjcevnxrzlgfmeci.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbmlwamNldm54cnpsZ2ZtZWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDMyMjUsImV4cCI6MjA4MjUxOTIyNX0.tuUrVzxDlZssFm3pwhB-fSsiL8DQUErHmGeqngvQohc';

const COMPARISON_SEPARATOR = '-vs-';
const VALID_TYPES = new Set(['news', 'game', 'category', 'compare']);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(text, max = 160) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

function injectMeta(html, { title, description, canonical, keywords, image, type = 'website', robots }) {
  const fullTitle = withBrand(title);
  const desc = description || 'Kuralı Ne? oyun rehberi platformu.';
  const ogImage = image || `${SITE_URL}/og-image.jpg`;
  const kw = keywords || 'kuralı ne, oyun kuralları';

  let out = html;
  const pairs = [
    [/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`],
    [/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${escapeHtml(fullTitle)}" />`],
    [
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(desc)}" />`,
    ],
    [
      /<meta name="keywords" content="[^"]*" \/>/,
      `<meta name="keywords" content="${escapeHtml(kw)}" />`,
    ],
    [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`],
    [/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${escapeHtml(type)}" />`],
    [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`],
    [
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`,
    ],
    [
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeHtml(desc)}" />`,
    ],
    [/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${escapeHtml(ogImage)}" />`],
    [
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`,
    ],
    [
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeHtml(desc)}" />`,
    ],
    [/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${escapeHtml(canonical)}" />`],
    [/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`],
  ];

  for (const [re, replacement] of pairs) {
    out = out.replace(re, replacement);
  }

  if (robots) {
    if (/<meta name="robots" content="[^"]*"\s*\/?>/.test(out)) {
      out = out.replace(
        /<meta name="robots" content="[^"]*"\s*\/?>/,
        `<meta name="robots" content="${escapeHtml(robots)}" />`
      );
    } else {
      out = out.replace('</head>', `<meta name="robots" content="${escapeHtml(robots)}" /></head>`);
    }
  }

  const bodySnippet = `<div id="prerender-content"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(desc)}</p></div>`;
  if (out.includes('id="prerender-content"')) {
    out = out.replace(/<div id="prerender-content">[\s\S]*?<\/div>/, bodySnippet);
  } else if (out.includes('<div id="root"></div>')) {
    out = out.replace('<div id="root"></div>', `<div id="root">${bodySnippet}</div>`);
  }

  return out;
}

async function fetchBaseHtml(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'kuraline.xyz';
  const baseUrl = `${proto}://${host}/index.html`;
  const res = await fetch(baseUrl, {
    headers: { 'user-agent': 'kuraline-prerender/1.0' },
  });
  if (!res.ok) throw new Error(`base html fetch failed: ${res.status}`);
  return res.text();
}

function notFoundHtml({ titlePath, listPath, listLabel }) {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"/><title>Sayfa bulunamadı - Kuralı Ne?</title><link rel="canonical" href="${SITE_URL}${titlePath}"/><meta name="robots" content="noindex, follow"/></head><body><h1>Sayfa bulunamadı</h1><p><a href="${SITE_URL}${listPath}">${listLabel}</a></p></body></html>`;
}

async function resolveNews(slug) {
  const canonical = canonicalNewsSlug(slug);
  if (canonical !== slug) {
    return { redirect: `${SITE_URL}/haberler/${canonical}` };
  }

  const lookup = storedNewsSlug(slug);
  let { data, error } = await supabase
    .from('news_posts')
    .select('slug, title, excerpt, seo_title, seo_description, cover_image, tags, category, is_published')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!data && !error && lookup !== slug) {
    const fallback = await supabase
      .from('news_posts')
      .select('slug, title, excerpt, seo_title, seo_description, cover_image, tags, category, is_published')
      .eq('slug', lookup)
      .eq('is_published', true)
      .maybeSingle();
    data = fallback.data;
    error = fallback.error;
  }

  if (error || !data) return null;

  return {
    title: data.seo_title || data.title,
    description: truncate(data.seo_description || data.excerpt || data.title),
    keywords: [data.title, data.category, ...(data.tags || []), 'kuralı ne', 'oyun haberleri']
      .filter(Boolean)
      .join(', '),
    image: data.cover_image,
    canonical: `${SITE_URL}/haberler/${canonical}`,
    type: 'article',
  };
}

async function resolveGame(slug) {
  const { data, error } = await supabase
    .from('games')
    .select('slug, name, short_description, description, image, category, players, difficulty, play_time_minutes, rules')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;

  const title = getGameSeoHeadline(data.name, data.category);

  return {
    title,
    robots: isPublishableGame(data) ? undefined : 'noindex, follow',
    description: gameDescription(data),
    keywords: `${data.name} kuralı ne, ${data.name} kuralları, ${data.name} nasıl oynanır, ${data.category || ''}, kuralı ne`.replace(/,\s*,/g, ','),
    image: absoluteCover(data),
    canonical: `${SITE_URL}/oyun/${data.slug}`,
    type: 'article',
  };
}

async function resolveCategory(name) {
  const decoded = decodeURIComponent(name).trim();
  if (!decoded) return null;

  const { data: categories } = await supabase
    .from('categories')
    .select('name')
    .eq('is_active', true);
  let categoryNames = (categories || []).map((row) => row.name).filter(Boolean);
  if (!categoryNames.length) {
    const { data: categoryRows } = await supabase.from('games').select('category');
    categoryNames = [...new Set((categoryRows || []).map((row) => row.category).filter(Boolean))];
  }
  const resolved =
    categoryNames.find((item) => categoryToSlug(item) === decoded) ||
    categoryNames.find((item) => item === decoded) ||
    categoryNames.find((item) => categoryToSlug(item) === categoryToSlug(decoded));
  if (!resolved) return null;

  const canonical = categoryToSlug(resolved);
  if (decoded !== canonical) {
    return { redirect: `${SITE_URL}/kategori/${canonical}` };
  }

  const { data: games } = await supabase
    .from('games')
    .select('name, short_description, image')
    .eq('category', resolved)
    .limit(8);

  const title = categoryTitle(resolved);
  const description = categoryDescription(resolved, games || []);

  return {
    title,
    description,
    keywords: `${resolved}, ${resolved} oyunları, nasıl oynanır, kuralı ne, oyun rehberi`,
    image: games?.[0]?.image || null,
    canonical: `${SITE_URL}/kategori/${canonical}`,
    type: 'website',
  };
}

async function resolveCompare(param) {
  const idx = param.indexOf(COMPARISON_SEPARATOR);
  if (idx <= 0) return null;
  const slugA = param.slice(0, idx);
  const slugB = param.slice(idx + COMPARISON_SEPARATOR.length);
  if (!slugA || !slugB) return null;

  const [{ data: a }, { data: b }] = await Promise.all([
    supabase.from('games').select('slug, name, short_description, description, image, category, players, play_time_minutes').eq('slug', slugA).maybeSingle(),
    supabase.from('games').select('slug, name, short_description, description, image, category, players, play_time_minutes').eq('slug', slugB).maybeSingle(),
  ]);

  if (!a || !b) return null;

  const title = comparisonTitle(a, b);
  const description = comparisonDescription(a, b);

  return {
    title,
    description,
    keywords: `${a.name} vs ${b.name}, ${a.name}, ${b.name}, oyun karşılaştırma, kuralı ne`,
    image: absoluteCover(a) || absoluteCover(b),
    canonical: `${SITE_URL}/karsilastir/${a.slug}${COMPARISON_SEPARATOR}${b.slug}`,
    type: 'article',
    robots:
      isSameFamily(a, b) && isPublishableGame(a) && isPublishableGame(b)
        ? undefined
        : 'noindex, follow',
  };
}

export default async function handler(req, res) {
  try {
    const type = String(req.query?.type || '').toLowerCase();
    const slug = String(req.query?.slug || '')
      .trim()
      .replace(/^\/+|\/+$/g, '');

    if (!slug || !VALID_TYPES.has(type)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end('type=news|game|category|compare ve slug gerekli');
    }

    let meta = null;
    if (type === 'news') meta = await resolveNews(slug);
    else if (type === 'game') meta = await resolveGame(slug);
    else if (type === 'category') meta = await resolveCategory(slug);
    else if (type === 'compare') meta = await resolveCompare(slug);

    if (meta?.redirect) {
      res.statusCode = 301;
      res.setHeader('Location', meta.redirect);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.end();
    }

    if (!meta) {
      const map = {
        news: { titlePath: `/haberler/${escapeHtml(slug)}`, listPath: '/haberler', listLabel: 'Haberlere dön' },
        game: { titlePath: `/oyun/${escapeHtml(slug)}`, listPath: '/oyunlar', listLabel: 'Oyunlara dön' },
        category: { titlePath: `/kategori/${escapeHtml(slug)}`, listPath: '/oyunlar', listLabel: 'Oyunlara dön' },
        compare: { titlePath: `/karsilastir/${escapeHtml(slug)}`, listPath: '/oyunlar', listLabel: 'Oyunlara dön' },
      };
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.end(notFoundHtml(map[type]));
    }

    const baseHtml = await fetchBaseHtml(req);
    const html = injectMeta(baseHtml, meta);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.setHeader('X-Kuraline-Prerender', 'dynamic');
    return res.end(html);
  } catch (err) {
    console.error('[api/prerender]', err);
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
}
