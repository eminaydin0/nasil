# Kategori Yönetimi Kurulumu

Admin panelinde kategori ekleme/düzenleme özelliği için Supabase'de `categories` tablosunun oluşturulması gerekir.

## Kurulum

1. **Supabase Dashboard** > **SQL Editor** > **New Query**
2. `supabase/create-categories-table.sql` dosyasının içeriğini yapıştır
3. **Run** butonuna bas

## Tablo Yapısı

| Alan | Tip | Açıklama |
|------|-----|----------|
| `id` | BIGINT | Birincil anahtar (otomatik) |
| `name` | TEXT | Kategori adı (benzersiz, zorunlu) |
| `description` | TEXT | Açıklama metni |
| `image_url` | TEXT | Kapak görseli URL'i |
| `color` | TEXT | Renk: red, orange, purple, blue, green, indigo, gray |
| `order_index` | INTEGER | Sıra numarası (küçükten büyüğe) |
| `is_active` | BOOLEAN | Aktif mi? (sitede görünsün mü) |

## Özellikler

### Otomatik Senkronizasyon
Kategori adını değiştirdiğinde, o kategorideki **tüm oyunlar otomatik güncellenir** (trigger ile).

### Aktif/Pasif Durumu
- **Aktif** kategoriler sitede görünür
- **Pasif** kategoriler gizlenir ama veriler silinmez
- Silmek yerine pasifleştirme önerilir

### Oyun Sayısı
Admin panelinde her kategoride kaç oyun olduğu gösterilir.

## Kullanım

1. Admin panele giriş yap
2. **Kategoriler** sekmesine tıkla
3. Yeni kategori için "Yeni Kategori" butonuna tıkla
4. Düzenle/Sil/Pasifleştir için tablodaki ikonları kullan

## Güvenlik Notları

- Kategori silmek oyunları **silmez**, sadece kategori bağlantısı kopar
- Oyunlu kategori silinirken uyarı gösterilir
- `is_active: false` yaparak gizlemek daha güvenlidir
- `games.category` TEXT olarak kalır (foreign key yok) - kasıtlı tasarım

## Fallback

- `categories` tablosu yoksa → site constants'tan kategorileri kullanır
- Tablo boşsa → varsayılan 6 kategori eklenir
- Hata olursa → constants'a fallback
