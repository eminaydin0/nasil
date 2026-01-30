/**
 * Oyun detay sayfasında gösterilecek "İlgili Araç" butonları
 * game slug veya name'e göre eşleşir
 */
export const GAME_TOOL_LINKS = [
  // 101 / 51 Okey varyasyonları → 101 Yazboz
  {
    slugs: ['101-okey', '51-okey', 'yuzbir-okey', '101-okey-yuzbir'],
    names: ['101', '51', 'yüzbir'],
    link: '/araclar/101-yazboz',
    label: '101 Okey Yazboz',
    icon: 'Grid3X3',
  },
  // Klasik Okey varyasyonları → Okey Puan Sayacı
  {
    slugs: ['duz-okey', 'perisan-okey', 'okey', 'dusmeli-okey', 'klasik-okey'],
    names: ['okey', 'düşmeli'],
    link: '/araclar/okey-sayaci',
    label: 'Okey Puan Sayacı',
    icon: 'Trophy',
  },
  // Batak varyasyonları → Batak Yazboz
  {
    slugs: ['batak', 'esli-batak', 'ihaleli-batak', 'ihalesiz-batak', 'gommeli-batak', 'king'],
    names: ['batak', 'king', 'eşli batak', 'ihaleli batak', 'gömmeli batak'],
    link: '/araclar/batak-yazboz',
    label: 'Batak & King Yazboz',
    icon: 'PencilLine',
  },
];

/**
 * Oyun slug veya name'e göre ilgili aracı bulur
 * @param {Object} game - { slug, name }
 * @returns {Object|null} { link, label } veya null
 */
export function getToolForGame(game) {
  if (!game) return null;

  const slug = (game.slug || '').toLowerCase().replace(/\s/g, '-');
  const name = (game.name || '').toLowerCase();

  for (const tool of GAME_TOOL_LINKS) {
    const slugMatch = tool.slugs.some((s) => slug.includes(s) || s.includes(slug));
    const nameMatch = tool.names.some((n) => name.includes(n));
    if (slugMatch || nameMatch) {
      return { link: tool.link, label: tool.label };
    }
  }
  return null;
}
