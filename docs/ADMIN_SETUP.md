# 🔐 Admin Authentication Hızlı Kurulum

## Adım 1: Veritabanı Tabloları Oluşturun

Supabase Dashboard → SQL Editor → New Query

`create-admin-table.sql` dosyasını açın ve tüm SQL kodunu kopyalayıp Supabase'de çalıştırın.

## Adım 2: Şifre Hash'i Oluşturun

1. Tarayıcıda `admin-hash-generator.html` dosyasını açın
2. Güçlü bir şifre girin (en az 8 karakter)
3. "Hash Oluştur" butonuna tıklayın
4. Oluşan hash'i kopyalayın

## Adım 3: Admin Kullanıcısı Oluşturun

Supabase SQL Editor'de:

```sql
INSERT INTO admin_users (username, password_hash, email, full_name)
VALUES (
  'admin',
  'HASH_BURAYA_GELECEK',  -- Adım 2'de oluşturduğunuz hash
  'admin@kuraline.xyz',
  'Admin User'
);
```

## Adım 4: Test Edin

1. Canlı: `https://kuraline.xyz/admin-panel` — yerel geliştirme: `http://localhost:3060/admin-panel`
2. Kullanıcı adı: `admin`
3. Şifre: Adım 2'de belirlediğiniz şifre

## ✨ Özellikler

✅ Supabase ile güvenli authentication
✅ SHA-256 şifre hash'leme
✅ 5 başarısız denemeden sonra hesap kilitleme (15 dakika)
✅ Login attempt tracking (güvenlik için)
✅ "Beni hatırla" özelliği
✅ Şifre görünürlük toggle
✅ Modern ve profesyonel UI
✅ Toast notifications
✅ Responsive tasarım

## 📁 Yeni Dosyalar

- `src/utils/adminAuth.js` - Authentication fonksiyonları
- `src/components/admin/AdminLogin.jsx` - Yeni login UI
- `docs/ADMIN_AUTH.md` - Detaylı dokümantasyon
- `admin-hash-generator.html` - Şifre hash oluşturucu
- `create-admin-table.sql` - Veritabanı şeması

## 🔒 Güvenlik

- Şifreler hiçbir zaman plain text olarak saklanmaz
- 5 başarısız denemeden sonra hesap kilitlenir
- Tüm giriş denemeleri loglanır
- Session yönetimi (localStorage / sessionStorage)

## 📖 Detaylı Dokümantasyon

Daha fazla bilgi için `docs/ADMIN_AUTH.md` dosyasına bakın.

## 🚀 Sonraki Adımlar

1. Production'da bcrypt kullanmayı düşünün
2. HTTPS kullanın
3. Rate limiting ekleyin
4. 2FA ekleyebilirsiniz
5. Audit logging ekleyin
