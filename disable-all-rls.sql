-- Tüm tabloların RLS politikalarını devre dışı bırak (geliştirme için)

-- game_views tablosu
ALTER TABLE game_views DISABLE ROW LEVEL SECURITY;

-- games tablosu (zaten kapalı olabilir ama emin olalım)
ALTER TABLE games DISABLE ROW LEVEL SECURITY;

-- comments tablosu
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- admin_users tablosu (zaten kapalı)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- admin_login_attempts tablosu (zaten kapalı)
ALTER TABLE admin_login_attempts DISABLE ROW LEVEL SECURITY;
