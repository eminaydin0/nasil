import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️  Sitemap atlandı: VITE_SUPABASE_URL veya VITE_SUPABASE_ANON_KEY tanımlı değil.');
  console.warn('   Mevcut public/sitemap*.xml dosyaları kullanılacak.');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Site configuration
const BASE_URL = 'https://kuraline.xyz';

// Static pages configuration
const STATIC_PAGES = [
  { url: '', changefreq: 'daily', priority: '1.0' },
  { url: '/oyunlar', changefreq: 'daily', priority: '0.9' },
  { url: '/haberler', changefreq: 'daily', priority: '0.85' },
  { url: '/ucretsiz-oyunlar', changefreq: 'daily', priority: '0.88' },
  { url: '/araclar', changefreq: 'weekly', priority: '0.8' },
  { url: '/hakkimizda', changefreq: 'monthly', priority: '0.6' },
  { url: '/iletisim', changefreq: 'monthly', priority: '0.6' },
  { url: '/kullanim-kosullari', changefreq: 'monthly', priority: '0.5' },
  { url: '/gizlilik', changefreq: 'monthly', priority: '0.5' },
  { url: '/cerez-politikasi', changefreq: 'monthly', priority: '0.5' },
  { url: '/reklam-verin', changefreq: 'monthly', priority: '0.6' },
];

// Tools pages
const TOOL_PAGES = [
  { url: '/araclar/okey-sayaci', changefreq: 'monthly', priority: '0.7' },
  { url: '/araclar/101-yazboz', changefreq: 'monthly', priority: '0.7' },
  { url: '/araclar/batak-yazboz', changefreq: 'monthly', priority: '0.7' },
  { url: '/araclar/takim-olusturucu', changefreq: 'monthly', priority: '0.7' },
  { url: '/araclar/halisaha-takim-olusturucu', changefreq: 'monthly', priority: '0.7' },
  { url: '/araclar/zar-at', changefreq: 'monthly', priority: '0.7' },
  { url: '/araclar/skor-tablosu', changefreq: 'monthly', priority: '0.7' },
];

/**
 * Generate main sitemap.xml
 */
const generateSitemap = async () => {
  console.log('🚀 Starting sitemap generation...');
  const now = new Date().toISOString();

  try {
    // Fetch all games
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('slug, name, image, category, updated_at, created_at')
      .order('updated_at', { ascending: false });

    if (gamesError) throw gamesError;
    console.log(`✅ Fetched ${games.length} games`);

    const { data: newsPosts, error: newsError } = await supabase
      .from('news_posts')
      .select('slug, title, cover_image, updated_at, published_at, created_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (newsError) {
      console.warn('⚠️ Could not fetch news posts (table may not exist yet)');
    }
    const publishedNews = newsPosts || [];
    console.log(`✅ Fetched ${publishedNews.length} news posts`);

    // Fetch all categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name, is_active')
      .eq('is_active', true);

    if (catError) {
      console.warn('⚠️ Could not fetch categories, using defaults');
    }

    const activeCategories = categories 
      ? categories.map(c => c.name) 
      : [...new Set(games.map(g => g.category).filter(Boolean))];
    
    console.log(`✅ Found ${activeCategories.length} active categories`);

    // Start building sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // Add static pages
    STATIC_PAGES.forEach(page => {
      sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add tool pages
    TOOL_PAGES.forEach(page => {
      sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add game pages with images
    games.forEach(game => {
      const lastMod = game.updated_at || game.created_at || now;
      const slug = encodeURIComponent(game.slug);
      
      sitemap += `  <url>
    <loc>${BASE_URL}/oyun/${slug}</loc>
    <lastmod>${new Date(lastMod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>`;
      
      // Add image sitemap extension if image exists
      if (game.image) {
        sitemap += `
    <image:image>
      <image:loc>${game.image}</image:loc>
      <image:title>${escapeXml(game.name)} - Kuralı Ne?</image:title>
      <image:caption>${escapeXml(game.name)} oyununun görseli</image:caption>
    </image:image>`;
      }
      
      sitemap += `
  </url>
`;
    });

    // Add news pages
    publishedNews.forEach((post) => {
      const lastMod = post.updated_at || post.published_at || post.created_at || now;
      const slug = encodeURIComponent(post.slug);

      sitemap += `  <url>
    <loc>${BASE_URL}/haberler/${slug}</loc>
    <lastmod>${new Date(lastMod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;

      if (post.cover_image) {
        sitemap += `
    <image:image>
      <image:loc>${post.cover_image}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>`;
      }

      sitemap += `
  </url>
`;
    });

    // Add category pages
    activeCategories.forEach(category => {
      if (category) {
        sitemap += `  <url>
    <loc>${BASE_URL}/kategori/${encodeURIComponent(category)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    });

    // Add comparison pages (X vs Y) - SEO odakli yeni sayfa kumesi
    const comparisonPairs = generateComparisonPairs(games);
    comparisonPairs.forEach(({ slugA, slugB }) => {
      sitemap += `  <url>
    <loc>${BASE_URL}/karsilastir/${slugA}-vs-${slugB}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    sitemap += '</urlset>';

    // Write main sitemap
    const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`✅ Main sitemap generated at public/sitemap.xml`);

    // Generate sitemap index if needed (for large sites)
    await generateSitemapIndex(games.length, activeCategories.length);

    // Generate games sitemap separately for better organization
    await generateGamesSitemap(games);

    console.log('\n🎉 Sitemap generation completed successfully!');
    console.log(`   - ${STATIC_PAGES.length + TOOL_PAGES.length} static pages`);
    console.log(`   - ${games.length} game pages`);
    console.log(`   - ${publishedNews.length} news pages`);
    console.log(`   - ${activeCategories.length} category pages`);
    console.log(`   - ${comparisonPairs.length} comparison pages`);
    console.log(`   - Total: ${STATIC_PAGES.length + TOOL_PAGES.length + games.length + publishedNews.length + activeCategories.length + comparisonPairs.length} URLs`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
};

/**
 * Karsilastirma sayfasi ciftleri uretir.
 * Her oyun icin: ayni kategoride en yakin 3 oyunla esler.
 * Spam onlemek icin (slugA, slugB) ciftleri leksikografik sirayla
 * uretilir, boylece (a, b) ve (b, a) olarak iki kez gecmez.
 */
function generateComparisonPairs(games) {
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
      // Her oyun icin ayni kategorideki diger oyunlarla en fazla 3 cift
      bucket.slice(i + 1, i + 4).forEach((gameB) => {
        const [slugA, slugB] = [gameA.slug, gameB.slug].sort();
        const key = `${slugA}-vs-${slugB}`;
        if (!pairs.has(key)) {
          pairs.add(key);
          result.push({ slugA, slugB });
        }
      });
    });
  });

  return result;
}

/**
 * Generate games-only sitemap for better crawling
 */
const generateGamesSitemap = async (games) => {
  const now = new Date().toISOString();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  games.forEach(game => {
    const lastMod = game.updated_at || game.created_at || now;
    const slug = encodeURIComponent(game.slug);
    
    sitemap += `  <url>
    <loc>${BASE_URL}/oyun/${slug}</loc>
    <lastmod>${new Date(lastMod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>`;
    
    if (game.image) {
      sitemap += `
    <image:image>
      <image:loc>${game.image}</image:loc>
      <image:title>${escapeXml(game.name)}</image:title>
    </image:image>`;
    }
    
    sitemap += `
  </url>
`;
  });

  sitemap += '</urlset>';

  const gamesPath = path.join(rootDir, 'public', 'sitemap-games.xml');
  fs.writeFileSync(gamesPath, sitemap);
  console.log(`✅ Games sitemap generated at public/sitemap-games.xml`);
};

/**
 * Generate sitemap index file
 */
const generateSitemapIndex = async (gameCount, categoryCount) => {
  const now = new Date().toISOString();
  
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-games.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  const indexPath = path.join(rootDir, 'public', 'sitemap-index.xml');
  fs.writeFileSync(indexPath, sitemapIndex);
  console.log(`✅ Sitemap index generated at public/sitemap-index.xml`);
};

/**
 * Escape special XML characters
 */
function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Run the generator
generateSitemap();
