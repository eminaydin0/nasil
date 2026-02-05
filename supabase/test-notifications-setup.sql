-- Bildirimlerin kurulu olup olmadığını test et
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın

-- 1. Notifications tablosu var mı?
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'notifications'
) as notifications_table_exists;

-- 2. Comments tablosunda author_user_id var mı?
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'comments'
  AND column_name = 'author_user_id'
) as author_user_id_column_exists;

-- 3. create_notification fonksiyonu var mı?
SELECT EXISTS (
  SELECT FROM pg_proc 
  WHERE proname = 'create_notification'
) as create_notification_function_exists;

-- 4. User_favorites tablosu var mı?
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_favorites'
) as favorites_table_exists;

-- 5. Notifications tablosundaki veriler (son 5)
SELECT 
  id,
  user_id,
  type,
  title,
  is_read,
  created_at
FROM notifications
ORDER BY created_at DESC
LIMIT 5;

-- 6. Comments'teki author_user_id durumu (son 10 yorum)
SELECT 
  id,
  author_name,
  author_user_id,
  content,
  created_at
FROM comments
ORDER BY created_at DESC
LIMIT 10;
