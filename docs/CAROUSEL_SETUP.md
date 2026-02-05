# Carousel Tasarım Dokümantasyonu

Yeni carousel tasarımı tam ekran, modern ve etkileyici bir yapıya sahip.

## Özellikler

### Görsel Tasarım
- **Full-width Hero**: Maksimum 1400px, responsive
- **Yükseklik**: 500px (mobil), 600px (desktop)
- **Gradient Overlay**: Siyah-turuncu degrade arka plan
- **Dekoratif Efektler**: Blur blob'lar
- **Modern Shadows**: Derin gölgeler

### İnteraktif Elementler
1. **Navigation Dots** (sağ alt)
   - Aktif slide: Uzun turuncu bar
   - Pasif slide: Küçük beyaz nokta
   
2. **Thumbnail Preview** (sağ yan - sadece XL ekranlarda)
   - Mini slide önizlemeleri
   - Ring efektleri
   - Hover animasyonları

3. **CTA Buttons**
   - Primary: Gradient turuncu-kırmızı
   - Secondary: Glassmorphism beyaz

### Animasyonlar
- **Slide Geçişi**: 1000ms fade + scale
- **Content Entrance**: 700ms delay ile yukarı kayma
- **Auto-play**: 6 saniye interval

## Kurulum

### 1. Veritabanı Güncelleme

Supabase SQL Editor'da `update-carousel-slides.sql` dosyasını çalıştırın:

```bash
supabase/update-carousel-slides.sql
```

Bu 5 yeni, çekici slide ekler:
- **Slide 1**: Geleneksel Türk Oyunları (Hoş Geldiniz)
- **Slide 2**: Oyun Araçları (Yeni Özellik)
- **Slide 3**: Kutu Oyunları (Popüler)
- **Slide 4**: Kart Oyunları (En Çok Aranan)
- **Slide 5**: Çocuk Oyunları (Aile İçin)

### 2. Admin Panel'den Yönetim

**Admin Panel → Carousel Yönetimi**'nden:
- Slide ekle/düzenle/sil
- Görselleri değiştir
- Sıralama ayarla
- Aktif/pasif durumu değiştir

## Özelleştirme

### Yeni Slide Ekleme

```sql
INSERT INTO carousel_slides (
  title,              -- Büyük başlık
  description,        -- Alt açıklama
  image_url,          -- Unsplash veya başka kaynak
  badge,              -- Üst etiket (ör. "Yeni", "Popüler")
  button_text,        -- CTA butonu metni
  button_link,        -- Yönlendirilecek sayfa
  order_index,        -- Sıralama (1, 2, 3...)
  is_active           -- true/false
) VALUES (
  'Başlık Buraya',
  'Açıklama metni buraya. Maksimum 2-3 cümle önerilir.',
  'https://images.unsplash.com/photo-...',
  'Özel Etiket',
  'Hemen Keşfet',
  '/hedef-sayfa',
  6,
  true
);
```

### Görsel Önerileri

**En İyi Görsel Kaynakları:**
- [Unsplash](https://unsplash.com) - Ücretsiz yüksek kalite
- [Pexels](https://pexels.com) - Ücretsiz stok fotoğraf
- Önerilen boyut: 2000x1200px veya daha büyük
- Format: WebP, JPEG (PNG ağır olabilir)

**İyi Görseller:**
- Oyun teması olan
- İyi aydınlatılmış
- Odak noktası sol tarafta (metin sağda)
- Yüksek kontrast

## Teknik Detaylar

### Bileşen: `HeroCarousel.jsx`

```javascript
// Ana özellikler
- Auto-play: 6 saniye
- Geçiş: 1000ms ease-out
- Lazy loading: İlk slide hariç
- Touch swipe: Mobilde kaydırma (varsayılan)
```

### Responsive Breakpoints

| Ekran | Yükseklik | Özellikler |
|-------|-----------|------------|
| Mobile | 500px | Basitleştirilmiş UI, dots only |
| Tablet | 550px | Orta boy, dots |
| Desktop | 600px | Full özellik, dots |
| XL | 600px | Full + side thumbnails |

## Performans

- **Lazy Loading**: Görseller ihtiyaç dükçe yüklenir
- **Optimized Transitions**: GPU accelerated (transform, opacity)
- **Auto-pause**: Tab değiştirildiğinde durur (opsiyonel)

## Erişilebilirlik

- ✅ Klavye navigasyonu (ok tuşları - eklenebilir)
- ✅ ARIA labels
- ✅ Alt text'ler
- ✅ Odak göstergeleri

## Sorun Giderme

**Slide'lar görünmüyor:**
- `is_active = true` olduğundan emin olun
- Görsellerin yüklendiğini kontrol edin (Network tab)

**Geçişler yavaş:**
- Görsel boyutlarını optimize edin (WebP kullanın)
- CDN kullanın

**Auto-play çalışmıyor:**
- Console'da hata var mı kontrol edin
- `slides.length > 0` olduğundan emin olun
