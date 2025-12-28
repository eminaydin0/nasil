-- Önce mevcut comments tablosunu sil ve yeniden oluştur
DROP TABLE IF EXISTS comments CASCADE;

-- Yorumlar tablosunu doğru kolon isimleriyle oluştur
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  likes INTEGER DEFAULT 0,
  is_testimonial BOOLEAN DEFAULT FALSE,
  replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- İndeks ekle
CREATE INDEX IF NOT EXISTS idx_comments_game_id ON comments(game_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- RLS politikalarını ekle
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni
CREATE POLICY "Enable read access for all users" ON comments
  FOR SELECT USING (true);

-- Herkese yazma izni (geliştirme için, production'da değiştirin)
CREATE POLICY "Enable insert for all users" ON comments
  FOR INSERT WITH CHECK (true);

-- Herkese güncelleme izni
CREATE POLICY "Enable update for all users" ON comments
  FOR UPDATE USING (true);

-- Herkese silme izni
CREATE POLICY "Enable delete for all users" ON comments
  FOR DELETE USING (true);
