/**
 * Marka adı varyantları & yazım hataları
 * Schema alternateName, meta keywords, FAQ ve görünür “Hakkımızda” metni için tek kaynak.
 *
 * Not: Google meta keywords’ü neredeyse yok sayar; asıl etki alternateName +
 * görünür metin + FAQ schema üzerindedir. Aşırı spam stuffing yapılmaz.
 */

export const BRAND_PRIMARY = 'Kuralı Ne?';
export const BRAND_DOMAIN = 'kuraline.xyz';

/** Schema.org alternateName — makul uzunlukta, Knowledge Graph / marka eşlemesi */
export const BRAND_SCHEMA_ALTERNATE_NAMES = [
  'Kuralı Ne',
  'Kurali Ne',
  'Kuraline',
  'Kuralıne',
  'kuraline',
  'kuraline.xyz',
  'Kuralı Ne sitesi',
  'site kuralı ne',
  'kural ne',
  'kurallı ne',
  'kuralinee',
  'kurallnee',
  'kura be',
];

/**
 * Arama / meta keywords için geniş küme (home + about).
 * Noktalama ve tekrarlar dedupe edilir.
 */
export const BRAND_SEARCH_VARIANTS = [
  'kuralı ne',
  'kurali ne',
  'kuralıne',
  'kuraline',
  'kuraline.xyz',
  'kuralı ne?',
  'kurali ne?',
  'site kuralı ne',
  'site kurali ne',
  'kuralı ne sitesi',
  'kurali ne sitesi',
  'kural ne',
  'kural ne sitesi',
  'kurallı ne',
  'kuralline',
  'kuralinee',
  'kurallnee',
  'kura be',
  'kurali',
  'kuralı',
  'nasıl oynanır kuralı ne',
];

/** Ana sayfa / hakkımızda FAQ — marka sorgularına cevap */
export const BRAND_FAQS = [
  {
    question: 'Kuralı Ne? nedir?',
    answer:
      'Kuralı Ne? (kuraline.xyz), geleneksel ve dijital oyun kurallarını anlatan Türkçe oyun rehberi platformudur. Yazboz & skor araçları, oyun haberleri, bedava oyun kampanyaları ve AI asistan sunar.',
  },
  {
    question: 'Kuraline veya Kuralıne nedir?',
    answer:
      'Kuraline / Kuralıne, Kuralı Ne? sitesinin domain ve yazım varyantıdır. Resmi site adresi kuraline.xyz’dir; “kurali ne”, “site kuralı ne” gibi aramalarda da aynı platform kastedilir.',
  },
  {
    question: 'Site kuralı ne / kural ne sitesi hangisi?',
    answer:
      '“Site kuralı ne”, “kural ne sitesi” veya “kura be” gibi yazımlar genelde Kuralı Ne? (kuraline.xyz) aramasıdır. Oyun kuralları, araçlar ve haberler için resmi adres: https://kuraline.xyz',
  },
  {
    question: 'Kuralı Ne nasıl yazılır?',
    answer:
      'Doğru yazım “Kuralı Ne?” şeklindedir. Sık görülen alternatifler: Kurali Ne, Kuraline, Kuralıne, kuraline.xyz. Hepsi aynı markayı ifade eder.',
  },
];

/** Virgülle birleştirilmiş meta keywords parçası */
export function getBrandKeywordsString(limit = 16) {
  const seen = new Set();
  const out = [];
  for (const v of BRAND_SEARCH_VARIANTS) {
    const key = String(v).trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(v.trim());
    if (out.length >= limit) break;
  }
  return out.join(', ');
}
