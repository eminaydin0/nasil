-- Admin veya authenticated kullanıcılar oyun ekleyebilir
-- GEÇİCİ OLARAK: Herkes ekleyebilir (sonra kaldırılabilir)
DROP POLICY IF EXISTS "Enable insert for all users" ON games;

CREATE POLICY "Enable insert for all users" ON games 
FOR INSERT 
WITH CHECK (true);

-- Güncelleme için de izin ver
DROP POLICY IF EXISTS "Enable update for all users" ON games;

CREATE POLICY "Enable update for all users" ON games 
FOR UPDATE 
USING (true);

-- Silme için izin (sadece admin için olmalı ama şimdilik açık)
DROP POLICY IF EXISTS "Enable delete for all users" ON games;

CREATE POLICY "Enable delete for all users" ON games 
FOR DELETE 
USING (true);
