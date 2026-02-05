# İçerik Sayfaları Kurulumu

Kullanım Koşulları, Gizlilik Politikası ve Çerez Politikası sayfaları Supabase `site_content` tablosundan içerik çeker.

## 1. Veritabanı Kurulumu

Supabase SQL Editor'da şu dosyaları çalıştırın:

```
supabase/insert-terms-of-use.sql
supabase/insert-privacy-policy.sql
supabase/insert-cookie-policy.sql
supabase/insert-reklam-verin.sql
```

Bu scriptler varsayılan içeriği ekler. İçerik daha sonra admin panelden düzenlenebilir.

## 2. Admin Panelden Düzenleme

- Admin Panel → **İçerik Yönetimi** sekmesi
- **Kullanım Koşulları**, **Gizlilik Politikası**, **Çerez Politikası** veya **Reklam Verin** alt sekmesine tıklayın
- Başlık, alt başlık ve metni düzenleyip Kaydet'e basın

## 3. İçerik Formatı

- Paragraflar arasında **boş satır** bırakın
- "1. GENEL BİLGİLER" gibi kısa satırlar otomatik **başlık** olarak gösterilir
- Metin düz metin olarak saklanır

## 4. Sayfa Adresleri

- Kullanım Koşulları: `/kullanim-kosullari`
- Gizlilik Politikası: `/gizlilik`
- Çerez Politikası: `/cerez-politikasi`
- Reklam Verin: `/reklam-verin`
- Footer'da tüm linkler mevcuttur
