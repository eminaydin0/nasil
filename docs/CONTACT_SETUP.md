# İletişim Formu Kurulumu

İletişim sayfasındaki form artık Supabase veritabanına bağlıdır. Mesajlar `contact_messages` tablosuna kaydedilir ve admin panelden görüntülenebilir.

## 1. Veritabanı Kurulumu

Supabase SQL Editor'da aşağıdaki dosyayı çalıştırın:

```
supabase/create-contact-messages-table.sql
```

Bu script şunları oluşturur:
- `contact_messages` tablosu (name, email, message, is_read, created_at)
- RLS (Row Level Security) politikaları
- İndeksler

## 2. Nasıl Çalışır

1. **İletişim Sayfası** (`/iletisim`): Ziyaretçiler formu doldurup gönderir. Mesajlar `contact_messages` tablosuna eklenir.

2. **Admin Panel** (İletişim sekmesi): Gelen tüm mesajlar listelenir. Her mesaj için:
   - Okundu / okunmadı işaretleme
   - Silme
   - E-posta linki ile doğrudan yanıt

## 3. Tablo Yapısı

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | bigint | Otomatik ID |
| name | text | Gönderen adı |
| email | text | Gönderen e-postası |
| message | text | Mesaj içeriği |
| is_read | boolean | Okundu durumu (varsayılan: false) |
| created_at | timestamp | Gönderim tarihi |
