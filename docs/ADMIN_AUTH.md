# Admin Authentication Kurulumu

Bu dokümantasyon, güvenli admin authentication sisteminin nasıl kurulacağını açıklar.

## 1. Veritabanı Kurulumu

Supabase SQL Editor'de `create-admin-table.sql` dosyasını çalıştırın:

```sql
-- Admin kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE
);

-- Login girişimleri tablosu (güvenlik için)
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45),
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  success BOOLEAN DEFAULT false,
  user_agent TEXT
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_username ON admin_login_attempts(username);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON admin_login_attempts(attempted_at);

-- Row Level Security (RLS) Politikaları
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Admin tablosuna herkes okuma erişimi (authenticated olmadan)
CREATE POLICY "Admin users are publicly readable"
  ON admin_users FOR SELECT
  TO public
  USING (true);

-- Login attempts herkese yazabilir
CREATE POLICY "Login attempts are publicly writable"
  ON admin_login_attempts FOR INSERT
  TO public
  WITH CHECK (true);

-- Login attempts okunabilir
CREATE POLICY "Login attempts are publicly readable"
  ON admin_login_attempts FOR SELECT
  TO public
  USING (true);

-- Eski login attemptleri temizleme fonksiyonu
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_login_attempts
  WHERE attempted_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
```

## 2. Admin Kullanıcısı Oluşturma

### Şifre Hash'i Oluşturma

Node.js konsolunda (terminalde `node` yazarak) aşağıdaki kodu çalıştırın:

```javascript
// SHA-256 hash oluştur
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Şifrenizi burada girin
const myPassword = 'GüçlüŞifre123!';

hashPassword(myPassword).then(hash => {
  console.log('Şifre Hash:', hash);
});
```

Ya da tarayıcı konsolunda:

```javascript
(async () => {
  const encoder = new TextEncoder();
  const data = encoder.encode('GüçlüŞifre123!');
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log('Şifre Hash:', hashHex);
})();
```

### Admin Kullanıcısı Ekleme

Supabase SQL Editor'de hash'i kullanarak admin kullanıcısını ekleyin:

```sql
INSERT INTO admin_users (username, password_hash, email, full_name)
VALUES (
  'admin',  -- Kullanıcı adınız
  'HASH_BURAYA_GELECEK',  -- Yukarıda oluşturduğunuz hash
  'admin@nasiloynanir.com',
  'Admin User'
);
```

## 3. Güvenlik Özellikleri

### Hesap Kilitleme
- 5 başarısız giriş denemesinden sonra hesap 15 dakika kilitlenir
- Her başarılı girişte kilitleme sayacı sıfırlanır

### Login Attempt Tracking
- Tüm giriş denemeleri kaydedilir (başarılı ve başarısız)
- User agent bilgisi kaydedilir
- 30 gün sonra eski kayıtlar otomatik temizlenebilir

### Şifre Güvenliği
- SHA-256 hash kullanılır (production'da bcrypt önerilir)
- Şifreler hiçbir zaman plain text olarak saklanmaz

## 4. Kullanım

### Login
```javascript
import { adminLogin } from './utils/adminAuth';
import supabase from './lib/supabase';

const result = await adminLogin(supabase, 'admin', 'şifre');
if (result.success) {
  console.log('Giriş başarılı:', result.admin);
} else {
  console.error('Giriş hatası:', result.error);
}
```

### Şifre Değiştirme
```javascript
import { changeAdminPassword } from './utils/adminAuth';

const result = await changeAdminPassword(
  supabase,
  adminId,
  'eskiŞifre',
  'yeniŞifre'
);
```

## 5. Test

1. Admin giriş sayfasına gidin: `http://localhost:5162/admin`
2. Oluşturduğunuz kullanıcı adı ve şifre ile giriş yapın
3. Başarılı giriş sonrası admin paneline yönlendirileceksiniz

## 6. Güvenlik Önerileri

1. **Production'da Bcrypt Kullanın**: SHA-256 temel güvenlik sağlar ancak bcrypt daha güvenlidir
2. **HTTPS Kullanın**: Tüm admin işlemleri HTTPS üzerinden yapılmalı
3. **Rate Limiting**: API seviyesinde rate limiting ekleyin
4. **2FA Ekleyin**: İki faktörlü kimlik doğrulama ekleyebilirsiniz
5. **Audit Logging**: Tüm admin işlemlerini logladığınızdan emin olun
6. **Güçlü Şifreler**: En az 12 karakter, büyük/küçük harf, rakam ve özel karakter içermeli

## 7. Sorun Giderme

### "Kullanıcı adı veya şifre hatalı"
- Kullanıcı adını kontrol edin (büyük/küçük harf duyarlı)
- Şifre hash'ini doğru oluşturduğunuzdan emin olun
- Supabase'de kullanıcının `is_active = true` olduğunu kontrol edin

### "Hesabınız kilitlendi"
- 15 dakika bekleyin veya
- Supabase'de `locked_until` ve `login_attempts` alanlarını sıfırlayın:
  ```sql
  UPDATE admin_users
  SET locked_until = NULL, login_attempts = 0
  WHERE username = 'admin';
  ```

### Şifreyi Sıfırlama
```sql
-- Yeni hash oluşturun ve güncelleyin
UPDATE admin_users
SET password_hash = 'YENİ_HASH_BURAYA',
    login_attempts = 0,
    locked_until = NULL
WHERE username = 'admin';
```
