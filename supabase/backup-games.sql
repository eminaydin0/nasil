-- 1. YEDEK ALMA
-- Bu komut mevcut 'games' tablosunun birebir kopyasını 'games_backup' adıyla oluşturur.
-- Eğer bir sorun olursa verileri buradan geri yükleyebiliriz.
CREATE TABLE IF NOT EXISTS games_backup AS 
SELECT * FROM games;

-- Yedek alındı mesajı (SQL editörde görünmez ama işlem başarılıysa tablo oluşur)
