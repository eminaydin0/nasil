/**
 * Marka adı varyantları & yazım hataları
 * Schema alternateName, meta keywords, FAQ ve Hakkımızda metni için tek kaynak.
 *
 * Amaç: “kural ne / kurlne / kuralınee / kurılı ne” gibi yazımlarda da
 * Google’ın siteyi aynı markaya bağlaması.
 *
 * Not: Meta keywords zayıf sinyal; asıl etki alternateName + görünür FAQ metni.
 * Aşırı spam sayfa üretmiyoruz — tek marka sayfasında varyantları listeliyoruz.
 */

export const BRAND_PRIMARY = 'Kuralı Ne?';
export const BRAND_DOMAIN = 'kuraline.xyz';

/** Schema.org alternateName — Knowledge Graph / marka eşlemesi */
export const BRAND_SCHEMA_ALTERNATE_NAMES = [
  'Kuralı Ne',
  'Kurali Ne',
  'Kuraline',
  'Kuralıne',
  'kuraline',
  'kuraline.xyz',
  'Kuralı Ne sitesi',
  "oyunların kuralı ne",
  "oyunların kuralı ne sitesi",
  'site kuralı ne',
  "geleneksel oyunların kuralı ne",
  "geleneksel oyunların kuralı ne sitesi",
  "oyunlar nasıl oynanır",
  "oyunlar nasıl oynanır sitesi",
  "oyunlar nasıl oynanır kuralı ne",
  "oyunlar nasıl oynanır kuralı ne sitesi",
  'site kurali ne',
  'kural ne',
  'kurlne',
  'kurline',
  'kuralnee',
  'kuralınee',
  'kuralinee',
  'kurallnee',
  'kurılı ne',
  'kurili ne',
  'kurallı ne',
  'kuralline',
  'kura be',
  'kurali',
  'kuralı',
  'kuralin',
  'kuriline',
  'guralı ne',
  'gurali ne',
  'guraline',
  'guralıne',
  'guralınee',
  'guralinee',
  'gurlalı ne',
  'gurlalınee',
  'gurlaline',
  'curalıne',
  'curali ne',
  'curaline',
  'curalıne',
  'curalınee',
  'curaline',
  'curalınee',
  'kuralin.xyz',
];

/**
 * Arama / meta keywords — geniş yazım hatası kümesi
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
  'kurlne',
  'kurline',
  'kuralnee',
  'kuralınee',
  'kuralinee',
  'kurallnee',
  'kurallne',
  'kurılı ne',
  'kurili ne',
  'kurallı ne',
  'kuralline',
  'kura be',
  'kura li ne',
  'kurali',
  'kuralı',
  'kuralin',
  'kuralin.xyz',
  'kuralyne',
  'kuraline xyz',
  'kuralıne xyz',
  'nasıl oynanır kuralı ne',
  'oyun kuralı ne sitesi',
  'geleneksel oyunların kuralı ne',
  'geleneksel oyunların kuralı ne sitesi',
  'oyunlar nasıl oynanır',
  'oyunlar nasıl oynanır sitesi',
];

/** Ana sayfa / hakkımızda FAQ — yazım hatası sorgularına cevap */
export const BRAND_FAQS = [
  {
    question: 'Kuralı Ne? nedir?',
    answer:
      'Kuralı Ne? (kuraline.xyz), geleneksel ve dijital oyun kurallarını anlatan Türkçe oyun rehberi platformudur. Yazboz & skor araçları, oyun haberleri, bedava oyun kampanyaları ve AI asistan sunar.',
  },
  {
    question: 'Kuraline, Kuralıne, kurlne veya kuralınee nedir?',
    answer:
      'Kuraline, Kuralıne, kurlne, kuralınee, kuralinee gibi yazımlar Kuralı Ne? markasının sık görülen yazım hatalarıdır. Hepsi aynı siteyi kasteder; resmi adres kuraline.xyz’dir.',
  },
  {
    question: 'Site kuralı ne / kural ne / kurılı ne hangisi?',
    answer:
      '“Site kuralı ne”, “kural ne”, “kurılı ne”, “kurili ne”, “kura be” gibi aramalar genelde Kuralı Ne? (kuraline.xyz) içindir. Oyun kuralları ve araçlar: https://kuraline.xyz',
  },
  {
    question: 'Kuralı Ne nasıl yazılır?',
    answer:
      'Doğru yazım “Kuralı Ne?” şeklindedir. Yaygın alternatifler: Kurali Ne, Kuraline, Kuralıne, kurlne, kuralınee, kurılı ne, kuraline.xyz. Farklı siteler değil; aynı platformdur.',
  },
];

/** Virgülle birleştirilmiş meta keywords parçası */
export function getBrandKeywordsString(limit = 20) {
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
