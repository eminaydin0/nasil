-- Supabase SQL Editor'da çalıştırılacak sorgular

-- 1. Tüm yorumları listele
SELECT * FROM comments ORDER BY created_at DESC;

-- 2. Yorum sayısını kontrol et
SELECT COUNT(*) as total_comments FROM comments;

-- 3. Oyun başına yorum sayısı
SELECT 
  g.name,
  COUNT(c.id) as comment_count
FROM games g
LEFT JOIN comments c ON g.id = c.game_id
GROUP BY g.id, g.name
ORDER BY comment_count DESC;

-- 4. Son eklenen 5 yorum
SELECT 
  c.*,
  g.name as game_name
FROM comments c
JOIN games g ON c.game_id = g.id
ORDER BY c.created_at DESC
LIMIT 5;
