/**
 * Türkçe karakterleri ASCII’ye çeviren URL / storage-safe slug.
 * tr-TR'de "I".toLowerCase() → "ı" olur ve [^a-z] bu harfi düşürür
 * ("başladı" → "baslad"). Harita, küçük harften önce ve sonra uygulanır.
 */
const TR_MAP = {
  '\u00e7': 'c',
  '\u00c7': 'c',
  '\u011f': 'g',
  '\u011e': 'g',
  '\u0131': 'i',
  '\u0130': 'i',
  '\u00f6': 'o',
  '\u00d6': 'o',
  '\u015f': 's',
  '\u015e': 's',
  '\u00fc': 'u',
  '\u00dc': 'u',
};

function foldTurkish(value) {
  return String(value).replace(
    /[\u00e7\u00c7\u011f\u011e\u0131\u0130\u00f6\u00d6\u015f\u015e\u00fc\u00dc]/g,
    (ch) => TR_MAP[ch] || ch
  );
}

export function slugify(text) {
  if (!text) return '';
  const folded = foldTurkish(String(text)).replace(/\u0049/g, 'i');
  return foldTurkish(folded.toLocaleLowerCase('tr-TR'))
    .replace(/\u0307/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
