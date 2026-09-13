/**
 * Build sonrası yayınlanan haber/oyun sayfaları için dinamik HTML meta.
 * Statik prerender dosyası yoksa Vercel rewrite buraya düşer; Google ana sayfa
 * canonical'ı görmesin diye title/description/canonical enjekte edilir.
 */
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://kuraline.xyz';
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://yjnipjcevnxrzlgfmeci.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbmlwamNldm54cnpsZ2ZtZWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDMyMjUsImV4cCI6MjA4MjUxOTIyNX0.tuUrVzxDlZssFm3pwhB-fSsiL8DQUErHmGeqngvQohc';

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

function injectMeta(html, { title, description, canonical, keywords, image, type = 'website' }) {
  const fullTitle = title.includes('Kuralı Ne?') ? title : `${title} - Kuralı Ne?`;
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
  if (!res.ok) {
    throw new Error(`base html fetch failed: ${res.status}`);
  }
  return res.text();
}

async function resolveNews(slug) {
  const { data, error } = await supabase
    .from('news_posts')
    .select('slug, title, excerpt, seo_title, seo_description, cover_image, tags, category, is_published')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !data) return null;

  const title = data.seo_title || data.title;
  const description = truncate(data.seo_description || data.excerpt || data.title);
  const keywords = [data.title, data.category, ...(data.tags || []), 'kuralı ne', 'oyun haberleri']
    .filter(Boolean)
    .join(', ');

  return {
    title,
    description,
    keywords,
    image: data.cover_image,
    canonical: `${SITE_URL}/haberler/${data.slug}`,
    type: 'article',
  };
}

async function resolveGame(slug) {
  const { data, error } = await supabase
    .from('games')
    .select('slug, name, short_description, description, image, category')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;

  const isDigital = /pc|konsol|mobil/i.test(data.category || '');
  const title = isDigital ? `${data.name} Nasıl Oynanır?` : `${data.name} Kuralı Ne?`;
  const description = truncate(
    data.short_description || data.description || `${data.name} kuralları ve rehberi — Kuralı Ne?`
  );

  return {
    title,
    description,
    keywords: `${data.name}, ${data.category || ''}, kuralı ne, nasıl oynanır`.replace(/,\s*,/g, ','),
    image: data.image,
    canonical: `${SITE_URL}/oyun/${data.slug}`,
    type: 'article',
  };
}

export default async function handler(req, res) {
  try {
    const type = String(req.query?.type || '').toLowerCase();
    const slug = String(req.query?.slug || '')
      .trim()
      .replace(/^\/+|\/+$/g, '');

    if (!slug || !['news', 'game'].includes(type)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end('type=news|game ve slug gerekli');
    }

    const meta = type === 'news' ? await resolveNews(slug) : await resolveGame(slug);
    if (!meta) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.end(
        `<!doctype html><html lang="tr"><head><meta charset="utf-8"/><title>Sayfa bulunamadı - Kuralı Ne?</title><link rel="canonical" href="${SITE_URL}/"/><meta name="robots" content="noindex"/></head><body><h1>Sayfa bulunamadı</h1><p><a href="${SITE_URL}/">Ana sayfa</a></p></body></html>`
      );
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
