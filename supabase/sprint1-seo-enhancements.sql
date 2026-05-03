-- =====================================================================
-- Sprint 1: SEO Enhancements
-- =====================================================================
-- Bu migration:
--   1) games tablosuna SEO odakli yeni kolonlar ekler:
--      video_url, video_title, play_time_minutes, faq
--   2) Yorumdan bagimsiz hizli yildiz puanlama icin game_ratings
--      tablosunu olusturur (AggregateRating schema icin).
--
-- Calistirma: Supabase SQL Editor'de bu dosyanin tamamini yapistirip
-- "Run" tiklayin. Idempotent yazildi, birden fazla calistirilabilir.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) games tablosuna yeni kolonlar
-- ---------------------------------------------------------------------

ALTER TABLE games
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS video_title TEXT,
  ADD COLUMN IF NOT EXISTS play_time_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN games.video_url IS 'YouTube/Vimeo video URL (embed icin). Bos ise video bolumu gosterilmez.';
COMMENT ON COLUMN games.video_title IS 'Video baslik metni (VideoObject schema icin). Bos ise oyun adindan turetilir.';
COMMENT ON COLUMN games.play_time_minutes IS 'Tahmini oyun suresi (dakika). UI rozeti ve Game schema icin.';
COMMENT ON COLUMN games.faq IS 'JSONB array: [{question, answer}]. FAQPage rich snippet icin.';

-- ---------------------------------------------------------------------
-- 2) game_ratings tablosu (hizli yildiz puanlama)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS game_ratings (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  -- Bir kullanici (girisli) bir oyun icin tek puan verebilir
  CONSTRAINT game_ratings_user_unique UNIQUE (game_id, user_id),
  -- Misafir kullanici (session_id) bir oyun icin tek puan verebilir
  CONSTRAINT game_ratings_session_unique UNIQUE (game_id, session_id),
  -- En az birinin dolu olmasi gerekiyor
  CONSTRAINT game_ratings_owner_check CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_game_ratings_game_id ON game_ratings(game_id);
CREATE INDEX IF NOT EXISTS idx_game_ratings_user_id ON game_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_game_ratings_session_id ON game_ratings(session_id);

-- updated_at otomatik guncellesin
DROP TRIGGER IF EXISTS update_game_ratings_updated_at ON game_ratings;
CREATE TRIGGER update_game_ratings_updated_at
  BEFORE UPDATE ON game_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------
-- 3) RLS politikalari
-- ---------------------------------------------------------------------

ALTER TABLE game_ratings ENABLE ROW LEVEL SECURITY;

-- Herkes (anon dahil) puanlari okuyabilir (aggregate hesaplamak icin)
DROP POLICY IF EXISTS "game_ratings_read_all" ON game_ratings;
CREATE POLICY "game_ratings_read_all" ON game_ratings
  FOR SELECT USING (true);

-- Herkes (anon dahil) puan ekleyebilir (misafir puanlama destegi)
DROP POLICY IF EXISTS "game_ratings_insert_all" ON game_ratings;
CREATE POLICY "game_ratings_insert_all" ON game_ratings
  FOR INSERT WITH CHECK (true);

-- Kullanicilar kendi puanlarini guncelleyebilir
-- Girisli kullanici: kendi user_id'si ile
-- Misafir: kendi session_id'si ile (client tarafi gondermek zorunda)
DROP POLICY IF EXISTS "game_ratings_update_own" ON game_ratings;
CREATE POLICY "game_ratings_update_own" ON game_ratings
  FOR UPDATE USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- Kullanicilar kendi puanlarini silebilir
DROP POLICY IF EXISTS "game_ratings_delete_own" ON game_ratings;
CREATE POLICY "game_ratings_delete_own" ON game_ratings
  FOR DELETE USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- ---------------------------------------------------------------------
-- 4) Aggregate fonksiyonu (opsiyonel - client-side aggregate de yapiyoruz)
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_game_rating_summary(p_game_id BIGINT)
RETURNS TABLE (
  total_count BIGINT,
  average_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_count,
    ROUND(AVG(rating)::NUMERIC, 2) AS average_rating
  FROM game_ratings
  WHERE game_id = p_game_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================================
-- BITTI. games tablosunu kontrol etmek icin:
--   SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'games' ORDER BY ordinal_position;
-- =====================================================================
