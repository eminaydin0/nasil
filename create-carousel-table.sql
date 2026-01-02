CREATE TABLE IF NOT EXISTS carousel_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  badge TEXT DEFAULT 'ÖNE ÇIKAN',
  button_text TEXT DEFAULT 'İncele',
  button_link TEXT DEFAULT '#',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- Allow public access (since admin auth is custom and runs as anon)
CREATE POLICY "Public full access" ON carousel_slides
  FOR ALL USING (true) WITH CHECK (true);
