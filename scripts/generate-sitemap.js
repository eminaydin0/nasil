import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import {
  STATIC_SITEMAP_PAGES,
  getToolSitemapPages,
  isPublishableGame,
  generateComparisonPairs,
  buildSitemapLoc,
  SITEMAP_BASE_URL,
} from '../src/constants/sitemapRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

function writeStaticOnlySitemaps() {
  const now = new Date().toISOString();
  const toolPages = getToolSitemapPages();
  const staticEntries = [
    ...STATIC_SITEMAP_PAGES.map((page) =>
      urlEntry({
        loc: buildSitemapLoc(page.path),
        lastmod: now,
        changefreq: page.changefreq,
        priority: page.priority,
      })
    ),
    ...toolPages.map((page) =>
      urlEntry({
        loc: buildSitemapLoc(page.path),
        lastmod: now,
        changefreq: page.changefreq,
        priority: page.priority,
      })
    ),
  ];
  writeSitemap('sitemap-static.xml', wrapUrlset(staticEntries));
  writeSitemap('sitemap-games.xml', wrapUrlset([]));
  writeSitemap('sitemap-news.xml', wrapUrlset([]));
  writeSitemap('sitemap-categories.xml', wrapUrlset([]));
  writeSitemap('sitemap-comparisons.xml', wrapUrlset([]));
  writeSitemapIndex(['sitemap-static.xml'], now);
  console.log(`✅ Statik sitemap (${staticEntries.length} URL) — Supabase olmadan üretildi`);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️  Supabase env yok — yalnızca statik sitemap üretiliyor.');
  writeStaticOnlySitemaps();
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escapeXml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry({ loc, lastmod, changefreq, priority, image }) {
  let block = `  <url>
    <loc>${loc}</loc>`;
  if (lastmod) block += `\n    <lastmod>${lastmod}</lastmod>`;
  if (changefreq) block += `\n    <changefreq>${changefreq}</changefreq>`;
  if (priority) block += `\n    <priority>${priority}</priority>`;
  if (image?.loc) {
    block += `
    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>`;
    if (image.title) block += `\n      <image:title>${escapeXml(image.title)}</image:title>`;
    if (image.caption) block += `\n      <image:caption>${escapeXml(image.caption)}</image:caption>`;
    block += `\n    </image:image>`;
  }
  block += `\n  </url>\n`;
  return block;
}

function wrapUrlset(entries, withImage = false) {
  const imageNs = withImage
    ? '\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageNs}>
${entries.join('')}</urlset>`;
}

function writeSitemap(filename, content) {
  const filePath = path.join(publicDir, filename);
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${filename}`);
}

function writeSitemapIndex(files, lastmod) {
  const body = files
    .map(
      (file) => `  <sitemap>
    <loc>${SITEMAP_BASE_URL}/${file}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;

  writeSitemap('sitemap-index.xml', xml);
  writeSitemap('sitemap.xml', xml);
}

async function generateSitemap() {
  console.log('🚀 Sitemap üretimi başlıyor…');
  const now = new Date().toISOString();
  const toolPages = getToolSitemapPages();

  const { data: gamesRaw, error: gamesError } = await supabase
    .from('games')
    .select('slug, name, image, category, updated_at, created_at')
    .order('updated_at', { ascending: false });

  if (gamesError) throw gamesError;

  const allGames = gamesRaw || [];
  const games = allGames.filter(isPublishableGame);
  const skipped = allGames.length - games.length;
  if (skipped > 0) console.log(`⚠️  ${skipped} test/taslak oyun atlandı`);
  console.log(`✅ ${games.length} oyun`);

  const { data: newsPosts, error: newsError } = await supabase
    .from('news_posts')
    .select('slug, title, cover_image, updated_at, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (newsError) console.warn('⚠️  Haberler alınamadı:', newsError.message);
  const news = newsPosts || [];
  console.log(`✅ ${news.length} haber`);

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('name, is_active')
    .eq('is_active', true);

  if (catError) console.warn('⚠️  Kategoriler alınamadı, oyunlardan türetilecek');

  const activeCategories = categories?.length
    ? categories.map((c) => c.name).filter(Boolean)
    : [...new Set(games.map((g) => g.category).filter(Boolean))];

  console.log(`✅ ${activeCategories.length} kategori`);

  const comparisons = generateComparisonPairs(games);
  console.log(`✅ ${comparisons.length} karşılaştırma`);

  // ── Statik + araçlar ──
  const staticEntries = [
    ...STATIC_SITEMAP_PAGES.map((page) =>
      urlEntry({
        loc: buildSitemapLoc(page.path),
        lastmod: now,
        changefreq: page.changefreq,
        priority: page.priority,
      })
    ),
    ...toolPages.map((page) =>
      urlEntry({
        loc: buildSitemapLoc(page.path),
        lastmod: now,
        changefreq: page.changefreq,
        priority: page.priority,
      })
    ),
  ];
  writeSitemap('sitemap-static.xml', wrapUrlset(staticEntries));

  // ── Oyunlar ──
  const gameEntries = games.map((game) => {
    const lastMod = new Date(game.updated_at || game.created_at || now).toISOString();
    const slug = encodeURIComponent(game.slug);
    return urlEntry({
      loc: `${SITEMAP_BASE_URL}/oyun/${slug}`,
      lastmod: lastMod,
      changefreq: 'weekly',
      priority: '0.9',
      image: game.image
        ? {
            loc: game.image,
            title: `${game.name} - Kuralı Ne?`,
            caption: `${game.name} oyun rehberi`,
          }
        : null,
    });
  });
  writeSitemap('sitemap-games.xml', wrapUrlset(gameEntries, true));

  // ── Haberler ──
  const newsEntries = news.map((post) => {
    const lastMod = new Date(
      post.updated_at || post.published_at || post.created_at || now
    ).toISOString();
    return urlEntry({
      loc: `${SITEMAP_BASE_URL}/haberler/${encodeURIComponent(post.slug)}`,
      lastmod: lastMod,
      changefreq: 'weekly',
      priority: '0.8',
      image: post.cover_image
        ? { loc: post.cover_image, title: post.title }
        : null,
    });
  });
  writeSitemap('sitemap-news.xml', wrapUrlset(newsEntries, true));

  // ── Kategoriler ──
  const categoryEntries = activeCategories.map((category) =>
    urlEntry({
      loc: `${SITEMAP_BASE_URL}/kategori/${encodeURIComponent(category)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8',
    })
  );
  writeSitemap('sitemap-categories.xml', wrapUrlset(categoryEntries));

  // ── Karşılaştırmalar ──
  const comparisonEntries = comparisons.map(({ slugA, slugB }) =>
    urlEntry({
      loc: `${SITEMAP_BASE_URL}/karsilastir/${encodeURIComponent(slugA)}-vs-${encodeURIComponent(slugB)}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.7',
    })
  );
  writeSitemap('sitemap-comparisons.xml', wrapUrlset(comparisonEntries));

  // ── Index ──
  const indexFiles = [
    'sitemap-static.xml',
    'sitemap-games.xml',
    'sitemap-news.xml',
    'sitemap-categories.xml',
    'sitemap-comparisons.xml',
  ];
  writeSitemapIndex(indexFiles, now);

  const total =
    staticEntries.length +
    gameEntries.length +
    newsEntries.length +
    categoryEntries.length +
    comparisonEntries.length;

  console.log('\n🎉 Sitemap tamamlandı');
  console.log(`   Statik + araç : ${staticEntries.length}`);
  console.log(`   Oyun          : ${gameEntries.length}`);
  console.log(`   Haber         : ${newsEntries.length}`);
  console.log(`   Kategori      : ${categoryEntries.length}`);
  console.log(`   Karşılaştırma : ${comparisonEntries.length}`);
  console.log(`   TOPLAM        : ${total} URL`);
}

generateSitemap().catch((err) => {
  console.error('❌ Sitemap hatası:', err);
  process.exit(1);
});
