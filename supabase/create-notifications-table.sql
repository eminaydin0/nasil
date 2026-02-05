-- Bildirimler Tablosu
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  link VARCHAR(500),
  icon VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler (Performans için)
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politikalar
-- Kullanıcılar sadece kendi bildirimlerini görebilir
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcılar kendi bildirimlerini güncelleyebilir (okundu işaretleme)
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Kullanıcılar kendi bildirimlerini silebilir
CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Sistem bildirimleri ekleyebilir (backend/admin için)
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Trigger: Eski bildirimleri otomatik temizle (90 günden eski)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Scheduled job için (Supabase'de pg_cron ile kullanılabilir)
-- SELECT cron.schedule('cleanup-old-notifications', '0 2 * * *', 'SELECT cleanup_old_notifications();');

-- Helper function: Okunmamış bildirim sayısı
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INT AS $$
  SELECT COUNT(*)::INT
  FROM notifications
  WHERE user_id = p_user_id AND is_read = FALSE;
$$ LANGUAGE sql SECURITY DEFINER;

-- Trigger: Yeni bildirim geldiğinde sayacı güncelle
CREATE OR REPLACE FUNCTION notify_new_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Supabase Realtime için pg_notify
  PERFORM pg_notify(
    'new_notification',
    json_build_object(
      'user_id', NEW.user_id,
      'notification_id', NEW.id,
      'type', NEW.type,
      'title', NEW.title
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_notification_created
  AFTER INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_notification();

-- Örnek bildirim oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR,
  p_title VARCHAR,
  p_content TEXT,
  p_link VARCHAR DEFAULT NULL,
  p_icon VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, content, link, icon)
  VALUES (p_user_id, p_type, p_title, p_content, p_link, p_icon)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- İlk kontrol
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
    RAISE NOTICE 'notifications tablosu başarıyla oluşturuldu';
  ELSE
    RAISE NOTICE 'notifications tablosu zaten mevcut';
  END IF;
END $$;

-- Örnek bildirim türleri için comment
COMMENT ON TABLE notifications IS 'Kullanıcı bildirimleri: comment_reply, comment_like, new_follower, badge_earned, favorite_game_update, system_announcement';
COMMENT ON COLUMN notifications.type IS 'Bildirim türü: comment_reply | comment_like | new_follower | badge_earned | favorite_game_update | system_announcement';
COMMENT ON COLUMN notifications.icon IS 'Emoji veya icon adı: 💬 | ❤️ | 👤 | 🏆 | ⭐ | 📢';
