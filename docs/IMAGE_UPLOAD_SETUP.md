# 📸 Resim Yükleme Sistemi Kurulum Rehberi

## 🎯 Özellikler
✅ Bilgisayardan direkt resim yükleme
✅ Birden fazla resim (galeri) desteği
✅ URL ile resim ekleme (mevcut özellik korundu)
✅ Drag & drop (opsiyonel)
✅ Resim önizleme
✅ Otomatik Supabase Storage entegrasyonu

---

## 📋 ADIM 1: Supabase Storage Bucket Oluşturma

1. **Supabase Dashboard**'a gidin: https://supabase.com/dashboard
2. Projenizi seçin: `yjnipjcevnxrzlgfmeci`
3. Sol menüden **Storage** > **Create a new bucket** tıklayın
4. Ayarlar:
   - **Bucket Name**: `game-images`
   - **Public bucket**: ✅ **AÇIK** (Public access)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`

5. **Create bucket** butonuna tıklayın

---

## 📋 ADIM 2: Storage Policies (RLS) Ayarlama

Bucket oluşturduktan sonra **Policies** sekmesine gidin:

### Policy 1: Herkes Okuyabilir (Public Read)
```
Policy name: Anyone can view images
Allowed operation: SELECT
Target roles: public
USING expression: true
```

### Policy 2: Herkes Yükleyebilir (Public Upload)
```
Policy name: Anyone can upload images
Allowed operation: INSERT
Target roles: public
WITH CHECK expression: true
```

### Policy 3: Herkes Güncelleyebilir (Public Update)
```
Policy name: Anyone can update images
Allowed operation: UPDATE
Target roles: public
USING expression: true
WITH CHECK expression: true
```

### Policy 4: Herkes Silebilir (Public Delete)
```
Policy name: Anyone can delete images
Allowed operation: DELETE
Target roles: public
USING expression: true
```

**NOT**: Production'da bu policy'leri authenticated (giriş yapmış) kullanıcılarla sınırlayabilirsiniz.

---

## 📋 ADIM 3: Veritabanı Şeması Güncelleme

1. **SQL Editor** sekmesine gidin
2. `add-image-gallery-support.sql` dosyasını açın
3. SQL komutlarını kopyalayıp **RUN** yapın

Bu işlem:
- ✅ `games` tablosuna `gallery` kolonu ekler (TEXT[] array)
- ✅ Performans için indeks oluşturur

---

## 📋 ADIM 4: Test Etme

1. Dev server'ı başlatın: `npm run dev`
2. Admin panele giriş yapın: https://kuraline.xyz/admin-panel (yerel: http://localhost:3060/admin-panel)
3. **Yeni Oyun Ekle** veya mevcut bir oyunu düzenle
4. **Ana Görsel** bölümünde:
   - **Bilgisayardan Yükle** butonuna tıklayın
   - Resim seçin (JPEG, PNG, WebP, GIF)
   - Otomatik yüklenip önizleme gösterilecek
5. **Galeri Resimleri** bölümünde:
   - Birden fazla resim seçin (Ctrl/Cmd tuşuyla)
   - Maksimum 5 resim eklenebilir
   - Her resmin üzerine gelince X butonuyla silebilirsiniz

---

## 🎨 Kullanıcı Arayüzü

### Ana Resim Yükleme:
```
┌─────────────────────────────────────┐
│ URL: [https://example.com/img.jpg] │
│                                     │
│ ┌───────────────────────────────┐  │
│ │  📤 Bilgisayardan Yükle      │  │
│ └───────────────────────────────┘  │
│                                     │
│ [Önizleme]                         │
└─────────────────────────────────────┘
```

### Galeri Yükleme:
```
┌─────────────────────────────────────┐
│  🖼️ Birden fazla resim seçin       │
│     (Maks. 5 resim)                │
└─────────────────────────────────────┘

Yüklenen Resimler:
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│ ❌ │ │ ❌ │ │ ❌ │ │ ❌ │ │ ❌ │
│img1│ │img2│ │img3│ │img4│ │img5│
└────┘ └────┘ └────┘ └────┘ └────┘
```

---

## 🔧 Teknik Detaylar

### Dosya Boyutu Limitleri:
- Ana resim: **Maks. 5MB**
- Galeri resimleri: **Her biri maks. 5MB**

### Desteklenen Formatlar:
- JPEG / JPG
- PNG
- WebP
- GIF

### Storage Yolu:
```
game-images/
  └── games/
      ├── monopoly-1735683000123.jpg
      ├── monopoly-1735683001234.jpg
      └── tabu-1735683002345.png
```

### Public URL Formatı:
```
https://yjnipjcevnxrzlgfmeci.supabase.co/storage/v1/object/public/game-images/games/monopoly-1735683000123.jpg
```

---

## 🐛 Sorun Giderme

### Hata: "Error uploading image"
- **Çözüm**: Supabase Storage bucket'in oluşturulduğundan emin olun
- Bucket adının tam olarak `game-images` olduğunu kontrol edin

### Hata: "new row violates row-level security policy"
- **Çözüm**: RLS policy'lerini kontrol edin
- Public INSERT/UPDATE policy'lerinin olduğundan emin olun

### Hata: "Dosya boyutu 5MB'dan büyük"
- **Çözüm**: Resmi sıkıştırın veya yeniden boyutlandırın
- Online araçlar: TinyPNG, Squoosh

### Resim yüklendi ama görünmüyor
- **Çözüm**: Bucket'in **Public** olduğundan emin olun
- Tarayıcı önbelleğini temizleyin (Ctrl+Shift+R)

---

## 📊 Veritabanı Şeması (Güncellenmiş)

```sql
CREATE TABLE games (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  players TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  image TEXT NOT NULL,           -- Ana resim URL
  gallery TEXT[],                -- Galeri resimleri (YENİ!)
  short_description TEXT,
  description TEXT,
  rules JSONB,
  tips JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ Kontrol Listesi

- [ ] Supabase Storage'da `game-images` bucket'i oluşturuldu
- [ ] Bucket **Public** olarak ayarlandı
- [ ] 4 RLS policy eklendi (SELECT, INSERT, UPDATE, DELETE)
- [ ] SQL dosyası çalıştırıldı (`add-image-gallery-support.sql`)
- [ ] `games` tablosuna `gallery` kolonu eklendi
- [ ] Dev server yeniden başlatıldı
- [ ] Admin panelde test yapıldı
- [ ] Resim yükleme çalışıyor ✅
- [ ] Galeri resimleri ekleniyor ✅
- [ ] Resim silme çalışıyor ✅

---

## 🚀 Production İçin Öneriler

1. **RLS Policy'leri Sıkılaştırın**:
   - Sadece authenticated kullanıcılar yükleyebilsin
   - Admin rolü kontrolü ekleyin

2. **Dosya Boyutu Optimizasyonu**:
   - Yükleme sırasında otomatik resize
   - WebP formatına dönüştürme

3. **CDN Entegrasyonu**:
   - Cloudflare veya AWS CloudFront
   - Daha hızlı resim yükleme

4. **Yedekleme**:
   - Storage bucket'ların düzenli yedeğini alın
   - Silinen resimleri soft delete yapın

---

## 📞 Destek

Sorun yaşarsanız:
1. Browser Console'u kontrol edin (F12)
2. Supabase Dashboard > Logs sekmesine bakın
3. Network sekmesinde failed request'leri inceleyin

**Başarılar! 🎉**
