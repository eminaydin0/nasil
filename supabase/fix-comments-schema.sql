-- Kolon isimlerini düzelt
ALTER TABLE comments RENAME COLUMN name TO author_name;
ALTER TABLE comments RENAME COLUMN comment TO content;
ALTER TABLE comments DROP COLUMN IF EXISTS date;

-- created_at'i kullanacağız, date kolonuna gerek yok
