-- RLS politikalarını kaldır ve yeniden oluştur

-- Eski politikaları sil
DROP POLICY IF EXISTS "Admin can view own data" ON admin_users;
DROP POLICY IF EXISTS "Admin can update own data" ON admin_users;

-- RLS'i devre dışı bırak (geliştirme için - production'da dikkatli kullanın!)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_login_attempts DISABLE ROW LEVEL SECURITY;

-- Alternatif: RLS'i aktif tutup herkese erişim ver
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read" ON admin_users FOR SELECT USING (true);
-- CREATE POLICY "Allow public update" ON admin_users FOR UPDATE USING (true);
-- CREATE POLICY "Allow public insert" ON admin_users FOR INSERT WITH CHECK (true);

-- ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public insert" ON admin_login_attempts FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public select" ON admin_login_attempts FOR SELECT USING (true);
