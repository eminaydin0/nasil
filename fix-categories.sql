-- Kategorileri standart hale getir

-- Dış Mekan düzeltmeleri
UPDATE games SET category = 'Dış Mekan' WHERE category ILIKE 'dış mekan';
UPDATE games SET category = 'Dış Mekan' WHERE category ILIKE 'dis mekan';
UPDATE games SET category = 'Dış Mekan' WHERE category ILIKE 'dış/iç mekan';
UPDATE games SET category = 'Dış Mekan' WHERE category ILIKE 'dis/ic mekan';

-- İç Mekan düzeltmeleri
UPDATE games SET category = 'İç Mekan' WHERE category ILIKE 'iç mekan';
UPDATE games SET category = 'İç Mekan' WHERE category ILIKE 'ic mekan';
UPDATE games SET category = 'İç Mekan' WHERE category ILIKE 'içmekan/dış mekan';
UPDATE games SET category = 'İç Mekan' WHERE category ILIKE 'icmekan/dis mekan';

-- Diğer kategorilerin baş harflerini düzelt
UPDATE games SET category = 'Masa Oyunları' WHERE category ILIKE 'masa oyunları';
UPDATE games SET category = 'Kağıt Oyunları' WHERE category ILIKE 'kağıt oyunları';
UPDATE games SET category = 'Kutu Oyunları' WHERE category ILIKE 'kutu oyunları';
UPDATE games SET category = 'Zeka Oyunları' WHERE category ILIKE 'zeka oyunları';

-- Gereksiz boşlukları temizle
UPDATE games SET category = TRIM(category);
