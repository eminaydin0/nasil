-- Reklam Verin sayfası içeriğini site_content tablosuna ekle
-- Supabase SQL Editor'da çalıştırın

INSERT INTO site_content (section_key, title, subtitle, content)
VALUES (
  'reklam_verin',
  'Reklam Verin',
  'Markanızı oyunseverlere ulaştırın',
  'Nasıl Oynanır, geleneksel Türk oyunları ve popüler kutu oyunları meraklısı binlerce ziyaretçiye ulaşan bir platformdur. Markanızı doğru kitleye taşımak için ideal bir alandayız.

1. NEDEN BİZİ SEÇMELİSİNİZ?
Oyun ve eğlence odaklı hedef kitlemiz, sizin ürün veya hizmetinizle örtüşen demografik bir profil sunar. Kart oyunları, masa oyunları, aile oyunları ve geleneksel kültür konularına ilgi duyan ziyaretçilerimizle markanızı buluşturabiliriz.

2. REKLAM SEÇENEKLERİ
Banner reklamları: Ana sayfa, kategori ve oyun detay sayfalarında görsel alanlar
Sponsorlu içerik: Belirli oyun veya araç sayfalarında markanızın adına özel içerik
E-posta bülteni: Abonelerimize düzenli iletilen kampanya ve duyurular
Özel paketler: Hedef kitlenize özel fiyatlandırma ve yerleşim seçenekleri

3. TARGETING VE ÖLÇÜMLEME
Trafik istatistiklerimizi paylaşabilir, hedef kitlenizi analiz edebiliriz. Performans raporları ve tıklanma oranları ile reklam yatırımınızın etkisini takip edebilirsiniz.

4. UYGUN İÇERİK
Oyun, eğlence, kültür, eğitim ve aile odaklı markalar önceliklidir. Spor bahisleri, kumar ve benzeri içerikler kabul edilmemektedir.

5. İLETİŞİM
Reklam ve işbirliği talepleriniz için iletişim sayfamızdan bize ulaşın. E-posta konu satırına "Reklam Talebi" yazarak daha hızlı yanıt alabilirsiniz.'
) ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  updated_at = timezone('utc'::text, now());
