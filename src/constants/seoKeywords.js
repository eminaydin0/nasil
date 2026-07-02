/**
 * SEO Anahtar Kelime Kümeleri & Meta Şablonları
 * docs/SEO-KILAVUZU.md ile senkron tutulmalıdır.
 */

import { SITE_CONFIG } from './seo';

export const KEYWORD_TIERS = {
  head: [
    'kuralı ne',
    'oyun kuralları',
    'okey kuralı ne',
    'batak kuralı ne',
    '101 okey kuralları',
    'oyun haberleri',
    'ücretsiz oyun',
    'pc oyun rehberi',
  ],
  body: [
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
    title: '101 Okey Yazboz Online - Ceza Puanı Hesaplama',
    description:
      '101 okey yazboz aracı: el geçmişi, ceza puanları, -101/-202 kısayolları. Ücretsiz online 101 yazboz — kayıt gerekmez, mobil uyumlu.',
    keywords:
      '101 okey yazboz, 101 okey ceza puanları, 101 okey hesaplama, online yazboz, 101 okey online',
  },
  'okey-sayaci': {
    title: 'Okey Puan Sayacı - Düşmeli Okey Online',
    description:
      'Düşmeli okey puan sayacı. Normal bitiş 2 puan, okey/çift 4 puan — otomatik hesap. Kağıt kalem bırakın, ücretsiz kullanın.',
    keywords:
      'okey puan sayacı, düşmeli okey sayacı, okey ceza puanı, okey puan hesaplama, okey sayacı online',
  },
  'batak-yazboz': {
    title: 'Batak Yazboz - King & İhaleli Batak Online',
    description:
      'Batak ve King yazboz aracı. Tur bazlı puan girişi, otomatik toplam. İhaleli batak, eşli batak ve king için dijital yazboz.',
    keywords:
      'batak yazboz, king yazboz, batak puan tablosu, ihaleli batak yazboz, batak skor tablosu online',
  },
  'takim-olusturucu': {
    title: 'Takım Oluşturucu - Rastgele Kura Çek',
    description:
      'Adil takım oluşturucu: isimleri yazın, takım sayısını seçin, rastgele dağıtın. Halı saha, oyun gecesi ve etkinlikler için ücretsiz.',
    keywords:
      'takım oluşturucu, rastgele takım, kura çekme, takım kurma aracı, online takım oluşturucu',
  },
  'halisaha-takim-olusturucu': {
    title: 'Halısaha Takım Oluşturucu - 5v5 ile 11v11',
    description:
      'Halısaha diziliş editörü: 5v5’ten 11v11’e kadar. Hazır taktikler, kaptan, forma renkleri ve PNG indirme.',
    keywords:
      'halısaha takım oluşturucu, 5v5 takım, 11v11 diziliş, halı saha kura, futbol takım oluşturucu',
  },
  'zar-at': {
    title: 'Online Zar At - Tek ve Çift Zar',
    description:
      'Kayıp zarların dijital alternatifi. Tek veya çift zar atın, sonuç geçmişini görün. Tavla ve masa oyunları için ücretsiz zar aracı.',
    keywords: 'zar at, online zar, dijital zar, çift zar, tavla zarı, zar atma aracı',
  },
  'skor-tablosu': {
    title: 'Skor Tablosu - Dijital Puan Tutucu',
    description:
      'Her oyun için basit skor tablosu. Oyuncu ekleyin, puanları güncelleyin, sıralama otomatik. Ücretsiz dijital puan tutucu.',
    keywords: 'skor tablosu, puan tablosu online, skor tutucu, dijital skor tablosu, oyun skor tablosu',
  },
};

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
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
    },
    inLanguage: 'tr',
    author: {
      '@type': 'Organization',
      name: 'Kuralı Ne?',
    },
  };
}
