-- =====================================================
-- HABERLER — Gelişmiş alanlar (mevcut tabloya ekleme)
-- Supabase SQL Editor'da çalıştırın (create-news-posts-table.sql sonrası)
-- =====================================================

ALTER TABLE news_posts ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE news_posts ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE news_posts ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE news_posts ADD COLUMN IF NOT EXISTS read_time_minutes INT DEFAULT 1;
ALTER TABLE news_posts ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0 NOT NULL;
ALTER TABLE news_posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;

CREATE INDEX IF NOT EXISTS idx_news_posts_views ON news_posts(view_count DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_news_posts_trending ON news_posts(is_published, published_at DESC, view_count DESC);

-- Görüntülenme sayacı (anonim ziyaretçiler için güvenli RPC)
CREATE OR REPLACE FUNCTION increment_news_view(post_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE news_posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = post_slug AND is_published = true;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_news_view(TEXT) TO anon, authenticated;
