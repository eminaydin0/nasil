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
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const generateSitemap = async () => {
  console.log('Generating sitemap...');

  try {
    // Fetch all games
    const { data: games, error } = await supabase
      .from('games')
      .select('slug, updated_at');

    if (error) throw error;

    const baseUrl = 'https://nasiloynanir.com';
    const staticPages = [
      '',
      '/oyunlar',
      '/hakkimizda',
      '/iletisim'
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
    });

    // Add game pages
    games.forEach(game => {
      const lastMod = game.updated_at ? new Date(game.updated_at).toISOString() : new Date().toISOString();
      sitemap += `  <url>
    <loc>${baseUrl}/oyun/${game.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
    });

    // Add category pages
    const { data: categories } = await supabase
      .from('games')
      .select('category');
    
    if (categories) {
      const uniqueCategories = [...new Set(categories.map(c => c.category))];
      uniqueCategories.forEach(category => {
        if (category) {
            sitemap += `  <url>
    <loc>${baseUrl}/kategori/${encodeURIComponent(category)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
        }
      });
    }

    sitemap += '</urlset>';

    fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully at public/sitemap.xml');

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

generateSitemap();
