/**
 * Build-time Supabase istemcisi (Node ortamı).
 *
 * Neden: generate-sitemap.js ve prerender-meta.js build sırasında Supabase'den
 * oyun/haber verisini çeker. Vercel build'inde VITE_SUPABASE_* env değişkenleri
 * her zaman tanımlı olmayabiliyor; env yoksa sitemap "sadece statik" üretiliyor
 * ve oyun/haber sayfaları prerender edilmiyordu (Google keşfedemiyordu).
 *
 * Çözüm: client (src/lib/supabase.js) ile aynı public anon key fallback'ini
 * burada da kullan. anon key zaten tarayıcıya gönderilen public bir anahtar,
 * dolayısıyla build scriptlerinde bulunması güvenlik sorunu yaratmaz.
 */
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || 'https://yjnipjcevnxrzlgfmeci.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbmlwamNldm54cnpsZ2ZtZWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDMyMjUsImV4cCI6MjA4MjUxOTIyNX0.tuUrVzxDlZssFm3pwhB-fSsiL8DQUErHmGeqngvQohc';

/** true ise env değil, gömülü fallback kullanılıyor (build logunda uyarı için). */
export const USING_FALLBACK_CREDENTIALS = !process.env.VITE_SUPABASE_URL;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
