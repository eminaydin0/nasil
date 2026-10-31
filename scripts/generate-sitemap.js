import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import {
  STATIC_SITEMAP_PAGES,
  STATIC_SITEMAP_LASTMOD,
  getToolSitemapPages,
  isPublishableGame,
  generateComparisonPairs,
  buildSitemapLoc,
  SITEMAP_BASE_URL,
} from '../src/constants/sitemapRoutes.js';
import { canonicalNewsSlug } from '../src/constants/newsSlugRedirects.js';
import { categoryPath } from '../src/utils/categorySlug.js';
import { gameDescription, gameTitle } from '../src/lib/seoMeta.js';
import {
  absoluteCover,
  isBundledGameImage,
  isSharedPexelsUrl,
  isUnsplashUrl,
  needsWebpReupload,
} from '../src/lib/coverImage.js';
import { supabase, USING_FALLBACK_CREDENTIALS } from './supabase-build.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

if (USING_FALLBACK_CREDENTIALS) {
  console.warn(
    '⚠️  VITE_SUPABASE_* env bulunamadı — gömülü public anon key ile devam ediliyor (sitemap yine de oyun/haber içerecek).'
  );
}

const DYNAMIC_SITEMAP_FILES = [
  'sitemap-games.xml',
  'sitemap-news.xml',
  'sitemap-categories.xml',
  'sitemap-comparisons.xml',
];

const TOOL_SITEMAP_LASTMOD = '2026-11-01';

const ALL_SITEMAP_FILES = ['sitemap-static.xml', ...DYNAMIC_SITEMAP_FILES];

function sitemapHasUrls(filename) {
  try {
    const raw = fs.readFileSync(path.join(publicDir, filename), 'utf8');
    return /<loc>/.test(raw);
  } catch {
    return false;
  }
}

function toLastmod(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

function latestLastmod(values) {
  const times = values
    .map((value) => new Date(value).getTime())
    .filter((time) => !Number.isNaN(time));
  if (!times.length) return '';
  return new Date(Math.max(...times)).toISOString();
}

function toolEntries(toolPages) {
  return toolPages.map((page) =>
    urlEntry({
      loc: buildSitemapLoc(page.path),
      lastmod: TOOL_SITEMAP_LASTMOD,
    })
  );
}

function writeStaticOnlySitemaps() {
  const toolPages = getToolSitemapPages();
  const staticEntries = STATIC_SITEMAP_PAGES.map((page) =>
    urlEntry({
      loc: buildSitemapLoc(page.path),
      lastmod: STATIC_SITEMAP_LASTMOD,
    })
  );
  writeSitemap('sitemap-static.xml', wrapUrlset(staticEntries));
  writeSitemap('sitemap-tools.xml', wrapUrlset(toolEntries(toolPages)));

  // DB düşerse önceki iyi sitemap'leri SİLME — boş dosya yazmak Google keşfini bozar
  for (const file of DYNAMIC_SITEMAP_FILES) {
    if (!sitemapHasUrls(file)) {
      writeSitemap(file, wrapUrlset([]));
    } else {
      console.log(`♻️  ${file} korundu (önceki build içeriği)`);
    }
  }

  writeSitemapIndex([
    ...ALL_SITEMAP_FILES.map((file) => ({ file, lastmod: STATIC_SITEMAP_LASTMOD })),
    { file: 'sitemap-tools.xml', lastmod: TOOL_SITEMAP_LASTMOD },
  ]);
  console.log(`✅ Statik sitemap (${staticEntries.length} URL) — dinamik veri alınamadı`);
}

function escapeXml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Sitemap image:loc mutlak URL olmalı — göreli yollar GSC'de "Geçersiz URL" üretir */
function toAbsoluteUrl(url) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('//')) return `https:${raw}`;
  if (raw.startsWith('/')) return `${SITEMAP_BASE_URL}${raw}`;
  return `${SITEMAP_BASE_URL}/${raw}`;
}

function sitemapImage(loc, title, caption) {
  const absolute = toAbsoluteUrl(loc);
  if (!absolute) return null;
  return { loc: absolute, title, caption };
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

const imageStatus = new Map();

async function imageReturns200(url) {
  if (!url) return false;
  if (imageStatus.has(url)) return imageStatus.get(url);
  let ok = false;
  const raw = String(url);
  const pathOnly = raw.replace(/^https?:\/\/[^/]+/i, '').split('?')[0];
  const local = raw.startsWith('/') || /^https?:\/\/kuraline\.xyz\//i.test(raw);
  if (pathOnly.startsWith('/api/og')) {
    ok = true;
  } else if (local && pathOnly.startsWith('/')) {
    ok = fs.existsSync(path.join(process.cwd(), 'public', pathOnly.slice(1)));
  } else {
    try {
      const head = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      ok = head.ok;
      if (!ok) {
        const get = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          headers: { Range: 'bytes=0-0' },
        });
        ok = get.ok || get.status === 206;
      }
    } catch {
      ok = false;
    }
  }
  imageStatus.set(url, ok);
  return ok;
}

function reportSection(title, rows) {
  const body = rows.length ? rows.map((row) => `- ${row}`).join('\n') : '- yok';
  return `## ${title}\n\n${body}\n`;
}

function writeSitemapIndex(files) {
  const body = files
    .map(({ file, lastmod }) => {
      const stamp = toLastmod(lastmod) || STATIC_SITEMAP_LASTMOD;
      return `  <sitemap>
    <loc>${SITEMAP_BASE_URL}/${file}</loc>
    <lastmod>${stamp}</lastmod>
  </sitemap>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;

  writeSitemap('sitemap.xml', xml);
}

async function generateSitemap() {
  console.log('🚀 Sitemap üretimi başlıyor…');
  const toolPages = getToolSitemapPages();

  const { data: gamesRaw, error: gamesError } = await supabase
    .from('games')
    .select('slug, name, image, category, players, difficulty, play_time_minutes, short_description, description, rules, updated_at, created_at')
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

  const staticEntries = STATIC_SITEMAP_PAGES.map((page) =>
    urlEntry({
      loc: buildSitemapLoc(page.path),
      lastmod: STATIC_SITEMAP_LASTMOD,
    })
  );
  const toolSitemapEntries = toolEntries(toolPages);
  writeSitemap('sitemap-static.xml', wrapUrlset(staticEntries));
  writeSitemap('sitemap-tools.xml', wrapUrlset(toolSitemapEntries));

  // ── Oyunlar ──
  const gameEntries = [];
  const report = {
    unsplash: [],
    shared: [],
    missing: [],
    raster: [],
    generated: [],
    dropped: [],
  };
  for (const game of games) {
    const raw = game.image || '';
    const who = `${game.name} (${game.slug})`;
    if (isUnsplashUrl(raw)) report.unsplash.push(`${who} — ${raw}`);
    if (isSharedPexelsUrl(raw)) report.shared.push(`${who} — ${raw}`);
    if (isBundledGameImage(raw)) report.missing.push(`${who} — ${raw}`);
    if (needsWebpReupload(raw)) report.raster.push(`${who} — ${raw}`);
    const cover = absoluteCover(game);
    const ok = await imageReturns200(cover);
    if (cover.includes('/api/og?')) report.generated.push(`${who} — ${cover}`);
    if (!ok) report.dropped.push(`${who} — ${cover}`);
    gameEntries.push(urlEntry({
      loc: `${SITEMAP_BASE_URL}/oyun/${encodeURIComponent(game.slug)}`,
      lastmod: toLastmod(game.updated_at || game.created_at),
      image: ok ? sitemapImage(cover, gameTitle(game), gameDescription(game)) : null,
    }));
  }
  writeSitemap('sitemap-games.xml', wrapUrlset(gameEntries, true));

  // ── Haberler ──
  const newsEntries = [];
  for (const post of news) {
    const slug = canonicalNewsSlug(post.slug);
    const cover = post.cover_image || '';
    if (needsWebpReupload(cover)) report.raster.push(`haber ${post.title} (${slug}) — ${cover}`);
    const ok = cover ? await imageReturns200(cover) : false;
    if (cover && !ok) report.dropped.push(`haber ${post.title} — ${cover}`);
    newsEntries.push(urlEntry({
      loc: `${SITEMAP_BASE_URL}/haberler/${encodeURIComponent(slug)}`,
      lastmod: toLastmod(post.updated_at || post.published_at || post.created_at),
      image: ok ? sitemapImage(cover, post.title) : null,
    }));
  }
  writeSitemap('sitemap-news.xml', wrapUrlset(newsEntries, true));

  const categoryLastmod = {};
  games.forEach((game) => {
    if (!game.category) return;
    const stamp = game.updated_at || game.created_at;
    const prev = categoryLastmod[game.category];
    if (!prev || new Date(stamp) > new Date(prev)) categoryLastmod[game.category] = stamp;
  });

  // ── Kategoriler ──
  const categoryEntries = activeCategories.map((category) =>
    urlEntry({
      loc: buildSitemapLoc(categoryPath(category)),
      lastmod: toLastmod(categoryLastmod[category]),
    })
  );
  writeSitemap('sitemap-categories.xml', wrapUrlset(categoryEntries));

  // ── Karşılaştırmalar ──
  const comparisonEntries = comparisons.map(({ slugA, slugB, gameA, gameB }) =>
    urlEntry({
      loc: `${SITEMAP_BASE_URL}/karsilastir/${encodeURIComponent(slugA)}-vs-${encodeURIComponent(slugB)}`,
      lastmod: latestLastmod([
        gameA?.updated_at || gameA?.created_at,
        gameB?.updated_at || gameB?.created_at,
      ]),
    })
  );
  writeSitemap('sitemap-comparisons.xml', wrapUrlset(comparisonEntries));

  // ── Index (sitemap-index.xml ayrıca üretilmez; 301 ile sitemap.xml'e gider) ──
  writeSitemapIndex([
    { file: 'sitemap-static.xml', lastmod: STATIC_SITEMAP_LASTMOD },
    { file: 'sitemap-tools.xml', lastmod: TOOL_SITEMAP_LASTMOD },
    { file: 'sitemap-games.xml', lastmod: latestLastmod(games.map((game) => game.updated_at || game.created_at)) },
    { file: 'sitemap-news.xml', lastmod: latestLastmod(news.map((post) => post.updated_at || post.published_at || post.created_at)) },
    { file: 'sitemap-categories.xml', lastmod: latestLastmod(Object.values(categoryLastmod)) },
    { file: 'sitemap-comparisons.xml', lastmod: latestLastmod(comparisons.flatMap(({ gameA, gameB }) => [gameA?.updated_at, gameB?.updated_at])) },
  ]);

  fs.writeFileSync(
    path.join(process.cwd(), 'MISSING_IMAGES.md'),
    [
      '# Eksik ve stok görseller',
      '',
      'Sitemap yalnızca 200 dönen adresleri yazar. `/api/og` aynı deploy ile gelir, bu yüzden burada HEAD atılmaz.',
      'Veritabanındaki adresler değiştirilmedi. `.jfif` / `.avif` dosyalar duruyor; uzantı `.webp` diye yazılmadı.',
      '',
      reportSection('Unsplash adresleri (kayıttaki hali)', report.unsplash),
      reportSection('Ortak Pexels 1871508', report.shared),
      reportSection('public/images/games altında olmayan dosyalar', report.missing),
      reportSection('jfif / avif — yeniden webp yüklenene kadar duruyor', report.raster),
      reportSection('Sitemapte üretilen kapak kullanılanlar', report.generated),
      reportSection('200 dönmediği için sitemap görselinden çıkarılanlar', report.dropped),
    ].join('\n'),
    'utf8'
  );

  const total =
    staticEntries.length +
    toolSitemapEntries.length +
    gameEntries.length +
    newsEntries.length +
    categoryEntries.length +
    comparisonEntries.length;

  console.log('\n🎉 Sitemap tamamlandı');
  console.log(`   Statik        : ${staticEntries.length}`);
  console.log(`   Araç          : ${toolSitemapEntries.length}`);
  console.log(`   Oyun          : ${gameEntries.length}`);
  console.log(`   Haber         : ${newsEntries.length}`);
  console.log(`   Kategori      : ${categoryEntries.length}`);
  console.log(`   Karşılaştırma : ${comparisonEntries.length}`);
  console.log(`   TOPLAM        : ${total} URL`);
}

generateSitemap().catch((err) => {
  console.error('❌ Sitemap hatası (dinamik veri alınamadı):', err?.message || err);
  // Deploy'u kırma: en azından statik sitemap üret.
  try {
    writeStaticOnlySitemaps();
  } catch (fallbackErr) {
    console.error('❌ Statik sitemap fallback de başarısız:', fallbackErr?.message || fallbackErr);
    process.exit(1);
  }
});
