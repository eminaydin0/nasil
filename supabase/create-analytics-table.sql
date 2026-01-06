-- Analytics tablosunu oluştur
CREATE TABLE IF NOT EXISTS analytics (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni
CREATE POLICY "Allow public read access"
  ON analytics FOR SELECT
  TO public
  USING (true);

-- Herkese yazma izni (development için)
CREATE POLICY "Allow public insert access"
  ON analytics FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON analytics FOR UPDATE
  TO public
  USING (true);

-- Index oluştur
CREATE INDEX IF NOT EXISTS idx_analytics_key ON analytics(key);

-- Örnek veri ekle (opsiyonel)
INSERT INTO analytics (key, value) VALUES
  ('total_views', '{"count": 0}'),
  ('total_games', '{"count": 30}'),
  ('total_comments', '{"count": 0}'),
  ('popular_games', '[]')
ON CONFLICT (key) DO NOTHING;
