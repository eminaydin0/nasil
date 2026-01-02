-- Tüm Hataları Düzelt - Tek SQL Dosyası
-- Bu dosyayı Supabase SQL Editor'de çalıştırın

-- 1. Storage Bucket Oluştur
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('game-images', 'game-images', true, 5242880)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage Policy
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'game-images')
WITH CHECK (bucket_id = 'game-images');

-- 3. game_views RLS Düzelt
ALTER TABLE game_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON game_views;
CREATE POLICY "Enable read access for all users"
ON game_views FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON game_views;
CREATE POLICY "Enable insert for all users"
ON game_views FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all users" ON game_views;
CREATE POLICY "Enable update for all users"
ON game_views FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 4. Gallery kolonu ekle (eğer yoksa)
ALTER TABLE games ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_games_gallery ON games USING GIN(gallery);

-- 5. Kontrol
SELECT 'Tüm düzeltmeler tamamlandı! ✅' as status,
       (SELECT count(*) FROM storage.buckets WHERE id = 'game-images') as bucket_count,
       (SELECT count(*) FROM pg_policies WHERE tablename = 'game_views') as game_views_policies;
