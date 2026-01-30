-- =====================================================
-- ANALYTICS VIEW'LARI
-- En Popüler Oyunlar ve Son Aktiviteler için
-- =====================================================
-- Supabase SQL Editor'da bu dosyayı çalıştırın
-- =====================================================

-- Önce eski view'ları sil (sütun değişikliği için gerekli)
DROP VIEW IF EXISTS top_games_weekly;
DROP VIEW IF EXISTS recent_activity;

-- 1. En Popüler Oyunlar (Haftalık/Tüm Zamanlar)
-- game_views + comments sayısına göre sıralı
CREATE VIEW top_games_weekly AS
SELECT 
  g.id AS game_id,
  COALESCE(gv.view_count, 0)::bigint AS views,
  COALESCE(c.comment_count, 0)::bigint AS comments,
  COALESCE(s.share_count, 0)::bigint AS shares,
  -- Engagement skoru: görüntülenme + yorum ağırlıklı
  (COALESCE(gv.view_count, 0) + (COALESCE(c.comment_count, 0) * 5))::numeric AS engagement_score
FROM games g
LEFT JOIN game_views gv ON g.id = gv.game_id
LEFT JOIN (
  SELECT game_id, COUNT(*)::int AS comment_count 
  FROM comments 
  GROUP BY game_id
) c ON g.id = c.game_id
LEFT JOIN (
  SELECT game_id, COUNT(*)::int AS share_count 
  FROM analytics_events 
  WHERE event_type = 'share_click' 
  GROUP BY game_id
) s ON g.id = s.game_id
ORDER BY 
  COALESCE(gv.view_count, 0) DESC,
  COALESCE(c.comment_count, 0) DESC;

-- 2. Son Aktiviteler
-- analytics_events'tan ilgili event tipleri (sıralama frontend'de .order().limit() ile)
CREATE VIEW recent_activity AS
SELECT 
  id,
  event_type,
  event_data,
  game_id,
  session_id,
  created_at
FROM analytics_events
WHERE event_type IN ('game_view', 'comment_submit', 'share_click', 'search', 'page_view');
