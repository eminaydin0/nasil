-- Mevcut verileri temizle (isteğe bağlı, temiz bir başlangıç için)
TRUNCATE TABLE carousel_slides;

-- İlk slayt: Geleneksel Türk Oyunları
INSERT INTO carousel_slides (title, description, image_url, badge, button_text, button_link, order_index, is_active)
VALUES (
  'Geleneksel Türk Oyunlarını Keşfet',
  'Unutulmaya yüz tutmuş sokak oyunlarından en sevilen masa oyunlarına kadar geniş bir arşiv.',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop',
  'HOŞ GELDİNİZ',
  'Oyunları İncele',
  '#oyunlar',
  0,
  true
);

-- İkinci slayt: Oyun Kuralları
INSERT INTO carousel_slides (title, description, image_url, badge, button_text, button_link, order_index, is_active)
VALUES (
  'Oyun Kurallarını Hızlıca Öğren',
  'Karmaşık kuralları basitleştirilmiş anlatımlarla hemen kavrayın ve oynamaya başlayın.',
  'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop',
  'REHBER',
  'Nasıl Oynanır?',
  '#oyunlar',
  1,
  true
);

-- Üçüncü slayt: Sosyal Oyunlar
INSERT INTO carousel_slides (title, description, image_url, badge, button_text, button_link, order_index, is_active)
VALUES (
  'Sevdiklerinizle Keyifli Vakit Geçirin',
  'Aileniz ve arkadaşlarınızla oynayabileceğiniz en eğlenceli grup oyunlarını bulun.',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop',
  'SOSYAL',
  'Grup Oyunları',
  '/kategori/Kutu Oyunları',
  2,
  true
);