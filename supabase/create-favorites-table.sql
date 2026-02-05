-- Favoriler Tablosu
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id INT REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- İndeksler (Performans için)
CREATE INDEX IF NOT EXISTS idx_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_game ON user_favorites(game_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created ON user_favorites(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Politikalar
-- Kullanıcılar kendi favorilerini görebilir
CREATE POLICY "Users can view their own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcılar favori ekleyebilir
CREATE POLICY "Users can add favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi favorilerini silebilir
CREATE POLICY "Users can remove their favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Favori sayılarını görmek için public view (opsiyonel)
CREATE OR REPLACE VIEW game_favorite_counts AS
SELECT 
  game_id,
  COUNT(*) as favorite_count
FROM user_favorites
GROUP BY game_id;

-- Trigger: Favori sayısını güncellemek için (opsiyonel)
CREATE OR REPLACE FUNCTION update_game_stats_on_favorite()
RETURNS TRIGGER AS $$
BEGIN
  -- Burada games tablosuna favorite_count eklenirse güncellenebilir
  -- ALTER TABLE games ADD COLUMN IF NOT EXISTS favorite_count INT DEFAULT 0;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- İlk veri kontrolü
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_favorites') THEN
    RAISE NOTICE 'user_favorites tablosu başarıyla oluşturuldu';
  ELSE
    RAISE NOTICE 'user_favorites tablosu zaten mevcut';
  END IF;
END $$;
