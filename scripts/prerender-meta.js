/**
 * Build sonrası tüm public sayfalar için route-bazlı HTML meta enjekte eder.
 * Statik sayfalar + Supabase'den oyun, haber, kategori, karşılaştırma rotaları.
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import {
  DEFAULT_META,
  generateTitle,
  getCanonicalUrl,
  getOgImageUrl,
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
  buildGameStructuredData,
  buildNewsStructuredData,
} from '../src/lib/seoEngine.js';
import { supabase, USING_FALLBACK_CREDENTIALS } from './supabase-build.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (USING_FALLBACK_CREDENTIALS) {
  console.warn(
    '⚠️  VITE_SUPABASE_* env bulunamadı — prerender gömülü public anon key ile devam ediyor.'
  );
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildJsonLdBlock(structuredData) {
  const list = Array.isArray(structuredData)
    ? structuredData.filter(Boolean)
    : structuredData
      ? [structuredData]
      : [];
  if (list.length === 0) return '';
  return list
    .map(
      (schema) =>
        `<script type="application/ld+json" data-prerender="1">${JSON.stringify(schema)}</script>`
    )
    .join('\n    ');
}

function injectMeta(
  html,
  {
    path: routePath,
    title,
    description,
    keywords,
    image,
    imageAlt,
    type = 'website',
    publishedTime,
    modifiedTime,
    structuredData,
    bodyHtml,
  }
) {
  const fullTitle = generateTitle(title, true);
  const metaDescription = description || DEFAULT_META.description;
  const canonical = getCanonicalUrl(routePath === '/' ? '' : routePath);
  const metaKeywords = keywords || DEFAULT_META.keywords;
  const ogImage = getOgImageUrl(image);
  const ogImageAlt = imageAlt || fullTitle;

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
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="${escapeHtml(type)}" />`,
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
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    ],
    [
      /<meta property="og:image:alt" content="[^"]*" \/>/,
      `<meta property="og:image:alt" content="${escapeHtml(ogImageAlt)}" />`,
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
    [
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
    ],
    [
      /<meta name="twitter:image:alt" content="[^"]*" \/>/,
      `<meta name="twitter:image:alt" content="${escapeHtml(ogImageAlt)}" />`,
    ],
  ];

  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement);
  }

  // article:published_time / modified_time (haber + oyun) — og:type article'dan sonra ekle
  if (type === 'article' && (publishedTime || modifiedTime)) {
    const articleTags = [
      publishedTime
        ? `<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />`
        : '',
      modifiedTime
        ? `<meta property="article:modified_time" content="${escapeHtml(modifiedTime)}" />`
        : '',
    ]
      .filter(Boolean)
      .join('\n    ');
    out = out.replace(
      /(<meta property="og:type" content="[^"]*" \/>)/,
      `$1\n    ${articleTags}`
    );
  }

  // Route'a özel JSON-LD şemalarını </head>'den önce ekle
  const jsonLd = buildJsonLdBlock(structuredData);
  if (jsonLd) {
    out = out.replace('</head>', `    ${jsonLd}\n  </head>`);
  }

  // Crawlable içerik: #root içine koy. React createRoot mount olunca bu içeriği
  // temizleyip gerçek uygulamayı render eder; botlar ise JS'siz metni görür.
  if (bodyHtml) {
    out = out.replace(
      '<div id="root"></div>',
      `<div id="root"><div id="prerender-content">${bodyHtml}</div></div>`
    );
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

/** Markdown'ı düz metne indir (prerender body için). */
function stripMarkdown(md) {
  return String(md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function listBlock(heading, items, limit) {
  const clean = (items || [])
    .map((x) => (typeof x === 'string' ? x : x?.text || ''))
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, limit);
  if (clean.length === 0) return '';
  return `<h2>${escapeHtml(heading)}</h2><ul>${clean
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join('')}</ul>`;
}

/** Oyun sayfası için crawlable body. */
function buildGameBody(game, meta) {
  const parts = [`<h1>${escapeHtml(meta.title || game.name)}</h1>`];
  if (game.shortDescription) parts.push(`<p>${escapeHtml(game.shortDescription)}</p>`);
  if (game.description) {
    parts.push(`<p>${escapeHtml(stripMarkdown(game.description).slice(0, 600))}</p>`);
  }
  parts.push(listBlock('Nasıl Oynanır — Kurallar', game.rules, 12));
  parts.push(listBlock('İpuçları', game.tips, 8));

  const faq = Array.isArray(game.faq)
    ? game.faq.filter((f) => f?.question && f?.answer).slice(0, 6)
    : [];
  if (faq.length) {
    parts.push(
      '<h2>Sıkça Sorulan Sorular</h2>' +
        faq
          .map(
            (f) =>
              `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`
          )
          .join('')
    );
  }
  return parts.filter(Boolean).join('\n');
}

/** Haber sayfası için crawlable body. */
function buildNewsBody(post) {
  const parts = [`<h1>${escapeHtml(post.title)}</h1>`];
  if (post.subtitle) parts.push(`<p>${escapeHtml(post.subtitle)}</p>`);
  const text = stripMarkdown(post.content).slice(0, 1600);
  if (text) parts.push(`<p>${escapeHtml(text)}</p>`);
  return parts.filter(Boolean).join('\n');
}

async function fetchDynamicRoutes() {
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
      image: game.image,
      imageAlt: `${game.name} — Kuralı Ne?`,
      structuredData: buildGameStructuredData(game),
      bodyHtml: buildGameBody(game, meta),
    });

    if (game.category) {
      if (!gamesByCategory[game.category]) gamesByCategory[game.category] = [];
      gamesByCategory[game.category].push(game);
    }
  });

  Object.entries(gamesByCategory).forEach(([category, categoryGames]) => {
    const meta = buildCategorySeoMeta(category, categoryGames);
    const listHtml = categoryGames
      .slice(0, 30)
      .map(
        (g) =>
          `<li><a href="/oyun/${escapeHtml(g.slug)}">${escapeHtml(g.name)}</a></li>`
      )
      .join('');
    routes.push({
      path: meta.url,
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      bodyHtml: `<h1>${escapeHtml(meta.title)}</h1><ul>${listHtml}</ul>`,
    });
  });

  generateComparisonPairs(games).forEach(({ gameA, gameB }) => {
    const meta = buildComparisonSeoMeta(gameA, gameB);
    routes.push({
      path: meta.url,
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      bodyHtml: `<h1>${escapeHtml(meta.title)}</h1><p>${escapeHtml(meta.description || '')}</p>`,
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
      image: post.cover_image,
      imageAlt: post.title,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at || post.published_at || post.created_at,
      structuredData: buildNewsStructuredData({
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
      }),
      bodyHtml: buildNewsBody(post),
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
  const staticRoutes = getStaticPrerenderRoutes().map((r) => {
    const path = r.path === '' ? '/' : r.path;
    const title = r.title || SITE_CONFIG.name;
    const description = r.description || DEFAULT_META.description;
    return {
      ...r,
      path,
      bodyHtml:
        r.bodyHtml ||
        `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><nav><a href="/oyunlar">Oyunlar</a> · <a href="/haberler">Haberler</a> · <a href="/ucretsiz-oyunlar">Bedava Oyunlar</a> · <a href="/indirimler">İndirimler</a> · <a href="/araclar">Araçlar</a></nav>`,
    };
  });

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
