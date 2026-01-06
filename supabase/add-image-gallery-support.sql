-- Oyunlara Çoklu Resim Desteği Ekleme
-- Bu dosyayı Supabase SQL Editor'de çalıştırın

-- 1. Games tablosuna gallery kolonu ekle (ek resimler için)
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';

-- 2. Storage bucket oluşturma (Supabase Dashboard > Storage'dan manuel yapılmalı)
-- Bucket adı: game-images
-- Public access: true
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- 3. RLS politikaları (Storage bucket için - Dashboard'dan ekleyin)
-- Policy: Anyone can view images
--   Operation: SELECT
--   Policy: true
--
-- Policy: Authenticated users can upload
--   Operation: INSERT
--   Policy: true
--
-- Policy: Authenticated users can update
--   Operation: UPDATE
--   Policy: true

-- 4. İndeks ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_games_gallery ON games USING GIN(gallery);

-- Başarı mesajı
SELECT 'Gallery desteği eklendi! Şimdi Supabase Dashboard > Storage > Create Bucket yapın: game-images' as message;
