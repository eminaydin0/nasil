-- Carousel slide'larını güncelle - daha çekici ve modern içerik
-- Supabase SQL Editor'da çalıştırın

-- Önce mevcut slide'ları temizle
TRUNCATE TABLE carousel_slides RESTART IDENTITY CASCADE;

-- Slide 1: Ana Tanıtım - Geleneksel Oyunlar
INSERT INTO carousel_slides (
  title, 
  description, 
  image_url, 
  badge, 
  button_text, 
  button_link, 
  order_index, 
  is_active
) VALUES (
  'Geleneksel Türk Oyunlarını Keşfedin',
  'Okey''den Batak''a, Pişti''den Saklambaç''a kadar yüzlerce oyunun kurallarını öğrenin. Kültürel mirasımızı dijital dünyada yaşatıyoruz.',
  'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2000&auto=format&fit=crop',
  'Hoş Geldiniz',
  'Oyunları Keşfet',
  '/oyunlar',
  1,
  true
);

-- Slide 2: Oyun Araçları
INSERT INTO carousel_slides (
  title, 
  description, 
  image_url, 
  badge, 
  button_text, 
  button_link, 
  order_index, 
  is_active
) VALUES (
  'Ücretsiz Oyun Araçları',
  '101 Okey yazboz, skor tablosu, zar atma ve daha fazlası. Oyunlarınızı kolaylaştıracak pratik araçlar.',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop',
  'Yeni Özellik',
  'Araçları Dene',
  '/araclar',
  2,
  true
);

-- Slide 3: Kutu Oyunları
INSERT INTO carousel_slides (
  title, 
  description, 
  image_url, 
  badge, 
  button_text, 
  button_link, 
  order_index, 
  is_active
) VALUES (
  'Kutu Oyunları Rehberi',
  'Monopoly, Tabu, Scrabble ve daha fazlası. Modern kutu oyunlarının detaylı kuralları ve stratejileri.',
  'https://images.unsplash.com/photo-1632501641765-e568d28b0015?q=80&w=2000&auto=format&fit=crop',
  'Popüler',
  'Kutu Oyunları',
  '/kategori/Kutu%20Oyunlar%C4%B1',
  3,
  true
);

-- Slide 4: Kart Oyunları
INSERT INTO carousel_slides (
  title, 
  description, 
  image_url, 
  badge, 
  button_text, 
  button_link, 
  order_index, 
  is_active
) VALUES (
  'Kart Oyunları Masterclass',
  'Batak, Pişti, King gibi klasik kart oyunlarında ustalaşın. Detaylı stratejiler ve ipuçları.',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop',
  'En Çok Aranan',
  'Kart Oyunları',
  '/kategori/Ka%C4%9F%C4%B1t%20Oyunlar%C4%B1',
  4,
  true
);

-- Slide 5: Çocuk Oyunları
INSERT INTO carousel_slides (
  title, 
  description, 
  image_url, 
  badge, 
  button_text, 
  button_link, 
  order_index, 
  is_active
) VALUES (
  'Çocuklarla Eğlenceli Vakit',
  'Saklambaç, körebe, ip atlama ve daha fazlası. Çocuklarınızla oynayabileceğiniz eğlenceli oyunlar.',
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2000&auto=format&fit=crop',
  'Aile İçin',
  'Çocuk Oyunları',
  '/kategori/%C4%B0%C3%A7%20Mekan%20Oyunlar%C4%B1',
  5,
  true
);

-- Not: İlk çalıştırmadan sonra istediğiniz slide'ları is_active = false yaparak gizleyebilirsiniz
