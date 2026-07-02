/**
 * Build sonrası tüm public sayfalar için route-bazlı HTML meta enjekte eder.
 * Statik sayfalar + Supabase'den oyun, haber, kategori, karşılaştırma rotaları.
 */
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import {
  DEFAULT_META,
  generateTitle,
  getCanonicalUrl,
  SITE_CONFIG,
} from '../src/constants/seo.js';
import {
  getStaticPrerenderRoutes,
  isPublishableGame,
  generateComparisonPairs,
} from '../src/constants/sitemapRoutes.js';
import {
  buildGameSeoMeta,
  buildNewsSeoMeta,
  buildCategorySeoMeta,
  buildComparisonSeoMeta,
} from '../src/lib/seoEngine.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function injectMeta(html, { path: routePath, title, description, keywords }) {
  const fullTitle = generateTitle(title, true);
  const metaDescription = description || DEFAULT_META.description;
  const canonical = getCanonicalUrl(routePath === '/' ? '' : routePath);
  const metaKeywords = keywords || DEFAULT_META.keywords;

  let out = html;

  const replacements = [
    [/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`],
    [
      /<meta name="title" content="[^"]*" \/>/,
      `<meta name="title" content="${escapeHtml(fullTitle)}" />`,
    ],
    [
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(metaDescription)}" />`,
    ],
    [
      /<meta name="keywords" content="[^"]*" \/>/,
      `<meta name="keywords" content="${escapeHtml(metaKeywords)}" />`,
    ],
    [
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    ],
    [
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    ],
    [
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`,
    ],
    [
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeHtml(metaDescription)}" />`,
    ],
    [
      /<meta name="twitter:url" content="[^"]*" \/>/,
      `<meta name="twitter:url" content="${escapeHtml(canonical)}" />`,
    ],
    [
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`,
    ],
    [
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeHtml(metaDescription)}" />`,
    ],
  ];

  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement);
  }

  return out;
}

function writeRouteHtml(routePath, html) {
  if (routePath === '/') {
    fs.writeFileSync(indexPath, html, 'utf8');
    return;
  }

  const dir = path.join(distDir, routePath.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

function formatGameRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    players: row.players,
    difficulty: row.difficulty,
    image: row.image,
    shortDescription: row.short_description,
    description: row.description,
    rules: row.rules,
    tips: row.tips,
    videoUrl: row.video_url,
    videoTitle: row.video_title,
    playTimeMinutes: row.play_time_minutes,
    faq: row.faq,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchDynamicRoutes() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('⚠️  Supabase yok — yalnızca statik sayfalar prerender edilecek.');
    return [];
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const routes = [];

  const { data: gamesRaw } = await supabase
    .from('games')
    .select(
      'id, slug, name, category, players, difficulty, image, short_description, description, rules, tips, video_url, video_title, play_time_minutes, faq, created_at, updated_at'
    )
    .order('updated_at', { ascending: false });

  const games = (gamesRaw || []).filter(isPublishableGame).map(formatGameRow);
  const gamesByCategory = {};

  games.forEach((game) => {
    const meta = buildGameSeoMeta(game);
    routes.push({
      path: `/oyun/${game.slug}`,
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
    });

    if (game.category) {
      if (!gamesByCategory[game.category]) gamesByCategory[game.category] = [];
      gamesByCategory[game.category].push(game);
    }
  });

  Object.entries(gamesByCategory).forEach(([category, categoryGames]) => {
    const meta = buildCategorySeoMeta(category, categoryGames);
    routes.push({
      path: meta.url,
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
    });
  });

  generateComparisonPairs(games).forEach(({ gameA, gameB }) => {
    const meta = buildComparisonSeoMeta(gameA, gameB);
    routes.push({
      path: meta.url,
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
    });
  });

  const { data: newsPosts } = await supabase
    .from('news_posts')
    .select(
      'slug, title, subtitle, excerpt, content, cover_image, category, tags, author, seo_title, seo_description, read_time_minutes, published_at, created_at, updated_at'
    )
    .eq('is_published', true);

  (newsPosts || []).forEach((post) => {
    const meta = buildNewsSeoMeta({
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.cover_image,
      category: post.category,
      tags: post.tags,
      author: post.author,
      seoTitle: post.seo_title,
      seoDescription: post.seo_description,
      readTimeMinutes: post.read_time_minutes,
      publishedAt: post.published_at,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    });
    routes.push({
      path: meta.url,
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
    });
  });

  return routes;
}

async function main() {
  if (!fs.existsSync(indexPath)) {
    console.warn('⚠️  prerender-meta atlandı: dist/index.html bulunamadı.');
    process.exit(0);
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf8');
  const staticRoutes = getStaticPrerenderRoutes().map((r) => ({
    ...r,
    path: r.path === '' ? '/' : r.path,
  }));

  const dynamicRoutes = await fetchDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const seen = new Set();
  let count = 0;

  for (const route of allRoutes) {
    if (!route.path || !route.title) continue;
    const key = route.path;
    if (seen.has(key)) continue;
    seen.add(key);

    const html = injectMeta(baseHtml, route);
    writeRouteHtml(route.path, html);
    count += 1;
  }

  console.log(
    `✅ ${count} route prerender edildi (${staticRoutes.length} statik + ${dynamicRoutes.length} dinamik) — ${SITE_CONFIG.url}`
  );
}

main().catch((err) => {
  console.error('❌ prerender-meta hatası:', err);
  process.exit(1);
});
