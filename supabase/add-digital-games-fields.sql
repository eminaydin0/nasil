-- =====================================================
-- Dijital oyunlar (PC / Konsol / Mobil) — ek alanlar
-- Supabase SQL Editor'da çalıştırın
-- =====================================================

ALTER TABLE games ADD COLUMN IF NOT EXISTS digital_info JSONB DEFAULT NULL;

COMMENT ON COLUMN games.digital_info IS
  'PC/Konsol/Mobil oyunları: platform, indirme, dosya boyutu, sistem gereksinimleri';

-- Yeni kategoriler (categories tablosu varsa)
INSERT INTO categories (name, description, color, order_index, is_active)
VALUES
  (
    'PC Oyunları',
    'Steam, Epic ve PC platformlarındaki oyunlar. Sistem gereksinimleri ve indirme linkleri.',
    'blue',
    20,
    true
  ),
  (
    'Konsol Oyunları',
    'PlayStation, Xbox ve Nintendo oyunları. Platform ve mağaza bilgileri.',
    'purple',
    21,
    true
  ),
  (
    'Mobil Oyunlar',
    'Android ve iOS oyunları. Mağaza linkleri ve cihaz gereksinimleri.',
    'green',
    22,
    true
  )
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  order_index = EXCLUDED.order_index,
  is_active = true;

NOTIFY pgrst, 'reload schema';
