/**
 * SEO Anahtar Kelime Kümeleri & Meta Şablonları
 * docs/SEO-KILAVUZU.md ile senkron tutulmalıdır.
 */

import { SITE_CONFIG } from './seo.js';

export const KEYWORD_TIERS = {
  head: [
    'kuralı ne',
    'kurali ne',
    'kuraline',
    'kuralıne',
    'kuraline.xyz',
    'site kuralı ne',
    'oyun kuralları',
    'okey kuralı ne',
    'batak kuralı ne',
    '101 okey kuralları',
    'oyun haberleri',
    'ücretsiz oyun',
    'pc oyun rehberi',
  ],
  body: [
    'kural ne',
    'kurlne',
    'kurline',
    'kuralınee',
    'kuralinee',
    'kurallnee',
    'kurılı ne',
    'kurili ne',
    'kura be',
    'kurallı ne',
    'pişti kuralı ne',
    'tavla nasıl oynanır',
    'saklambaç nasıl oynanır',
    'ihaleli batak kuralları',
    '101 okey yazboz online',
    'okey puan sayacı',
    'steam ücretsiz oyun',
    'epic games bedava',
    'sistem gereksinimleri',
    'konsol oyun rehberi',
    'mobil oyun nasıl oynanır',
    'kağıt oyunları kuralları',
    'masa oyunları kuralları',
    'sokak oyunları',
  ],
  longTail: [
    'kuralı ne sitesi',
    'kurali ne sitesi',
    'site kurali ne',
    'kurlne sitesi',
    'kuralınee nedir',
    'kurılı ne sitesi',
    '101 okey ceza puanları hesaplama',
    'batak yazboz dijital',
    'halısaha takım oluşturucu',
    'online zar at',
    'skor tablosu online',
    'okey mi 101 okey mi',
    'gta 6 çıkış tarihi',
    'steam haftalık ücretsiz oyun',
    'epic games haftalık bedava',
    'ps5 oyun rehberi türkçe',
  ],
};

export const TOOL_PAGE_SEO = {
  '101-yazboz': {
    title: '101 Yazboz Online — Ücretsiz 101 Okey Puan Tablosu',
    description:
      '101 yazboz online: kağıt kalem yok. -101/-202 kısayol, otomatik toplam, el geçmişi. Ücretsiz 101 okey yazboz — kayıt yok, mobilde aç.',
    keywords:
      '101 yazboz, 101 okey yazboz, 101 yazboz online, 101 okey puan tablosu, 101 okey ceza puanları, online yazboz, 101 okey yazboz ücretsiz, yüzbir yazboz',
  },
  'okey-sayaci': {
    title: 'Okey Sayacı Online — Düşmeli Okey Puan Hesaplama',
    description:
      'Okey sayacı online: düşmeli okeyde ceza puanını otomatik düşün. Ücretsiz, kayıtsız, mobil — kağıt kalem bırak.',
    keywords:
      'okey sayacı, okey puan sayacı, düşmeli okey sayacı, okey ceza puanı, okey puan hesaplama, okey sayacı online',
  },
  'batak-yazboz': {
    title: 'Batak Yazboz Online — İhaleli Batak & King Puan Tablosu',
    description:
      'Batak yazboz online: ihaleli batak, eşli batak ve king için dijital puan tablosu. Otomatik toplam, ücretsiz, mobil.',
    keywords:
      'batak yazboz, batak yazboz online, king yazboz, batak puan tablosu, ihaleli batak yazboz, batak skor tablosu online',
  },
  'takim-olusturucu': {
    title: 'Takım Oluşturucu Online — Rastgele Adil Kura',
    description:
      'Takım oluşturucu: isimleri yaz, takım sayısını seç, rastgele böl. Halı saha ve oyun gecesi için ücretsiz online kura.',
    keywords:
      'takım oluşturucu, rastgele takım, takım oluşturucu online, kura çekme, takım kurma aracı, online takım oluşturucu',
  },
  'halisaha-takim-olusturucu': {
    title: 'Halı Saha Takım Oluşturucu — Ücretsiz Kadro & Diziliş',
    description:
      'Halı saha takım oluşturucu: isimleri yaz, 5v5–11v11 diz, PNG indir. Ücretsiz, kayıtsız, WhatsApp’a hazır — maçtan önce 1 dakikada kadro.',
    keywords:
      'halı saha takım oluşturucu, halı saha takım oluşturma, halı saha takım oluşturucu, 5v5 takım, 11v11 diziliş, halı saha kura, futbol takım oluşturucu, halı saha diziliş, online kadro kur',
  },
  'zar-at': {
    title: 'Online Zar At — Tek ve Çift Zar (Ücretsiz)',
    description:
      'Online zar at: tek veya çift zar, animasyonlu sonuç. Tavla ve masa oyunları için ücretsiz dijital zar — kayıt yok.',
    keywords: 'zar at, online zar, online zar at, dijital zar, çift zar, tavla zarı, zar atma aracı',
  },
  'skor-tablosu': {
    title: 'Skor Tablosu Online — Dijital Puan Tutucu',
    description:
      'Skor tablosu online: oyuncu ekle, puan güncelle, sıralama otomatik. Her oyun için ücretsiz dijital puan tutucu.',
    keywords:
      'skor tablosu, skor tablosu online, puan tablosu online, skor tutucu, dijital skor tablosu, oyun skor tablosu',
  },
  'karar-carki': {
    title: 'Karar Çarkı Online — Şans Çarkı Çevir',
    description:
      'Karar çarkı online: seçenekleri yaz, çarkı çevir. Kura, ceza ve “kim başlasın?” için ücretsiz şans çarkı.',
    keywords:
      'karar çarkı, karar çarkı online, şans çarkı, online çark, kura çarkı, karar verme aracı, rastgele seçim çarkı',
  },
  'kura-cek': {
    title: 'Kura Çek Online — Rastgele İsim Çekilişi',
    description:
      'Kura çek online: isimleri yaz, rastgele kazananı seç. Sınıf, etkinlik ve oyun gecesi için ücretsiz çekiliş aracı.',
    keywords:
      'kura çek, kura çek online, kura çekme, isim çekilişi, online kura, rastgele isim seçici, çekiliş aracı',
  },
}

/** Oyun detay meta şablonları */
export function buildGameTitle(gameName, category) {
  if (!gameName) return 'Oyun Rehberi';
  const digital = ['PC Oyunları', 'Konsol Oyunları', 'Mobil Oyunlar'].includes(category);
  return digital ? `${gameName} Nasıl Oynanır?` : `${gameName} Kuralı Ne?`;
}

export function buildGameDescription(game) {
  const name = game?.name || 'Oyun';
  const short = game?.shortDescription || game?.description?.slice(0, 120) || '';
  const players = game?.players ? ` ${game.players} kişi ·` : '';
  const diff = game?.difficulty ? ` ${game.difficulty} ·` : '';
  const base = `${name} kuralı ne? ${short}`.trim();
  const suffix = `${players}${diff} Adım adım kurallar ve ipuçları.`.replace(/\s+/g, ' ');
  const combined = `${base} ${suffix}`.trim();
  return combined.length > 160 ? `${combined.slice(0, 157)}…` : combined;
}

export function buildGameKeywords(game) {
  const name = game?.name || '';
  const cat = game?.category || '';
  const isDigital = ['PC Oyunları', 'Konsol Oyunları', 'Mobil Oyunlar'].includes(cat);
  const base = isDigital
    ? [
        `${name} nasıl oynanır`,
        `${name} rehberi`,
        `${name} sistem gereksinimleri`,
        `${name} steam`,
        `${name} türkçe rehber`,
      ]
    : [
        `${name} kuralı ne`,
        `${name} nasıl oynanır`,
        `${name} kuralları`,
        `${name} ipuçları`,
      ];
  return [
    ...base,
    cat,
    'kuralı ne',
    'oyun kuralları',
    isDigital ? 'oyun rehberi' : 'geleneksel türk oyunları',
  ]
    .filter(Boolean)
    .join(', ');
}

/** Karşılaştırma sayfası meta */
export function buildComparisonTitle(gameA, gameB) {
  return `${gameA} vs ${gameB} - Hangisi Daha İyi?`;
}

export function buildComparisonDescription(gameA, gameB) {
  return `${gameA} ile ${gameB} karşılaştırması: oyuncu sayısı, zorluk, süre ve kurallar. Hangi oyunu seçmelisiniz? Detaylı karşılaştırma.`;
}

/** FAQ snippet şablonları — oyun detay SSS üretimi için */
export const FAQ_TEMPLATES = (gameName, players, difficulty) => [
  {
    question: `${gameName} kaç kişiyle oynanır?`,
    answer: players
      ? `${gameName} ${players} oynanır.`
      : `${gameName} oyuncu sayısı oyun varyantına göre değişir; detaylar aşağıda.`,
  },
  {
    question: `${gameName} nasıl oynanır?`,
    answer: `${gameName} oyununun kuralları adım adım bu sayfada anlatılmıştır. Aşağıdaki kural listesini takip ederek oynamaya başlayabilirsiniz.`,
  },
  {
    question: `${gameName} zor mu?`,
    answer: difficulty
      ? `${gameName} genellikle ${difficulty} seviyede kabul edilir. Kuralları öğrendikten sonra pratikle kolaylaşır.`
      : `${gameName} kurallarına alıştıktan sonra oynamak kolaylaşır.`,
  },
];

/** WebApplication schema — araç sayfaları */
export function generateWebApplicationSchema({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: `${SITE_CONFIG.url}${url}`,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock',
    },
    inLanguage: 'tr',
    isAccessibleForFree: true,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };
}
