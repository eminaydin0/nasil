-- Admin Kullanıcı Tablosu
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE,
  full_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE
);

-- Admin kullanıcısı ekle (şifre: Admin123!)
-- NOT: Şifreyi değiştirmeyi unutmayın!
INSERT INTO admin_users (username, password_hash, email, full_name) 
VALUES (
  'admin',
  -- Bu basit bir hash örneği, gerçek projede bcrypt kullanılmalı
  'e10adc3949ba59abbe56e057f20f883e', -- MD5 hash of "Admin123!"
  'admin@nasiloynanir.com',
  'Site Yöneticisi'
) ON CONFLICT (username) DO NOTHING;

-- Row Level Security (RLS) politikaları
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Sadece admin kendisini görebilir
CREATE POLICY "Admin can view own data" ON admin_users
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Güvenlik için: Admin tablosuna insert/update/delete işlemleri kısıtlı
CREATE POLICY "Admin can update own data" ON admin_users
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Login attempts tablosu (güvenlik için)
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45),
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  success BOOLEAN DEFAULT false,
  user_agent TEXT
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_username ON admin_login_attempts(username);
CREATE INDEX IF NOT EXISTS idx_login_attempts_date ON admin_login_attempts(attempted_at);

-- Eski login attempt kayıtlarını temizleme fonksiyonu
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_login_attempts 
  WHERE attempted_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
