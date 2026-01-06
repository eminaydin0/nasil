-- Oyunlar tablosu
CREATE TABLE IF NOT EXISTS games (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  players TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  image TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  rules JSONB,
  tips JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Yorumlar tablosu
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  date TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  is_testimonial BOOLEAN DEFAULT FALSE,
  replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Görüntüleme sayıları tablosu
CREATE TABLE IF NOT EXISTS game_views (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(game_id)
);

-- Analytics tablosu
CREATE TABLE IF NOT EXISTS analytics (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
CREATE INDEX IF NOT EXISTS idx_comments_game_id ON comments(game_id);
CREATE INDEX IF NOT EXISTS idx_comments_testimonial ON comments(is_testimonial);
CREATE INDEX IF NOT EXISTS idx_game_views_game_id ON game_views(game_id);

-- Row Level Security (RLS) politikaları
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Enable read access for all users" ON games FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON comments FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON game_views FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON analytics FOR SELECT USING (true);

-- Herkes yorum ekleyebilir
CREATE POLICY "Enable insert for all users" ON comments FOR INSERT WITH CHECK (true);

-- Herkes görüntülenme sayısını artırabilir
CREATE POLICY "Enable insert for all users" ON game_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON game_views FOR UPDATE USING (true);

-- Analytics yazma izni
CREATE POLICY "Enable insert for all users" ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON analytics FOR UPDATE USING (true);

-- Otomatik updated_at güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'lar
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_views_updated_at BEFORE UPDATE ON game_views
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
