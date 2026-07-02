/**
 * SEO Yapılandırma Dosyası
 * Tüm SEO ayarlarını merkezi olarak yönetir
 *
 * Platform vizyonu:
 * 1. Geleneksel & masa/kutu oyunları (köken misyon)
 * 2. PC / konsol / mobil oyun rehberleri
 * 3. Ücretsiz oyun kampanyaları
 * 4. Oyun araçları (yazboz, sayaç, takım oluşturucu)
 * 5. Oyun haberleri & AI asistan
 */

import { isDigitalGameCategory } from './digitalGames.js';
import { SITE_COMPANY, SITE_CONTACT_EMAIL, SITE_CREATOR } from './siteMeta.js';

// Site temel bilgileri
export const SITE_CONFIG = {
  name: 'Kuralı Ne?',
  tagline: 'Oyun Rehberi & Keşif Platformu',
  mission:
    'Geleneksel oyunlardan dijitale — kurallar, rehberler, araçlar, haberler ve bedava oyunlar tek adreste.',
  url: 'https://kuraline.xyz',
  defaultImage: 'https://kuraline.xyz/og-image.jpg',
  locale: 'tr_TR',
  language: 'tr',
  charset: 'UTF-8',
  themeColor: '#f97316',
  twitterHandle: '@kuraline',
  author: 'Kuralı Ne?',
  publisher: 'Kuralı Ne?',
  foundingDate: '2026',
  email: SITE_CONTACT_EMAIL,
  company: SITE_COMPANY,
  creator: SITE_CREATOR,
};

/** SEO içerik sütunları — anahtar kelime & sayfa stratejisi */
export const SEO_PILLARS = {
  traditional: {
    label: 'Geleneksel & masa oyunları',
    keywords: ['okey kuralı ne', 'batak kuralları', 'pişti nasıl oynanır', 'sokak oyunları', 'geleneksel türk oyunları'],
  },
  digital: {
    label: 'PC / konsol / mobil',
    keywords: ['pc oyun rehberi', 'sistem gereksinimleri', 'steam oyun', 'ps5 oyun', 'mobil oyun rehberi'],
  },
  tools: {
    label: 'Oyun araçları',
    keywords: ['101 okey yazboz', 'okey sayacı', 'batak yazboz', 'takım oluşturucu', 'skor tablosu'],
  },
  news: {
    label: 'Oyun haberleri',
    keywords: ['oyun haberleri', 'oyun çıkış tarihi', 'oyun fiyatları', 'indirim', 'gta 6'],
  },
  freeGames: {
    label: 'Bedava oyunlar',
    keywords: ['ücretsiz oyun', 'steam ücretsiz', 'epic games bedava', 'giveaway', 'bedava pc oyunu'],
  },
};

// Varsayılan meta açıklamaları
export const DEFAULT_META = {
  title: 'Kuralı Ne? — Oyun Kuralları, Rehberler, Araçlar & Haberler',
  description:
    'Okey, Batak, Pişti ve geleneksel oyun kuralları; PC/konsol rehberleri; 101 yazboz, okey sayacı; bedava oyun kampanyaları ve oyun haberleri. Hepsi Kuralı Ne?\'de.',
  keywords: [
    'kuralı ne',
    'oyun kuralları',
    'geleneksel türk oyunları',
    'okey kuralı ne',
    'batak kuralları',
    'pc oyun rehberi',
    'oyun haberleri',
    'ücretsiz oyun',
    '101 okey yazboz',
    'okey sayacı',
    'kağıt oyunları',
    'masa oyunları',
    'konsol oyunları',
    'mobil oyun rehberi',
  ].join(', '),
};

// Sayfa bazlı SEO şablonları
export const PAGE_SEO = {
  home: {
    title: 'Kuralı Ne? — Okey\'den Dijitale Oyun Rehberi Platformu',
    description:
      'Geleneksel oyun kuralları, PC/konsol rehberleri, oyun araçları, bedava kampanyalar ve güncel haberler. Okey, Batak, Pişti ve 50+ rehber — tek platform.',
    keywords:
      'kuralı ne, oyun kuralları, geleneksel oyunlar, pc oyun rehberi, oyun haberleri, ücretsiz oyun, okey sayacı, 101 yazboz, oyun araçları',
  },
  allGames: {
    title: 'Tüm Oyun Rehberleri — Geleneksel & Dijital Arşiv',
    description:
      'Kağıt ve masa oyunlarından PC, konsol ve mobil rehberlere kadar tüm oyun arşivi. Kurallar, ipuçları, videolar ve karşılaştırmalar.',
    keywords:
      'tüm oyunlar, oyun arşivi, oyun rehberleri, geleneksel oyunlar, pc oyunları, konsol oyunları, mobil oyunlar, kutu oyunları',
  },
  tools: {
    title: 'Oyun Araçları — Yazboz, Sayaç, Takım Oluşturucu',
    description:
      '101 okey yazboz, okey puan sayacı, batak yazboz, takım oluşturucu, zar at ve skor tablosu. Oyun geceleri için ücretsiz dijital araçlar.',
    keywords:
      '101 okey yazboz, okey sayacı, batak yazboz, takım oluşturucu, halısaha takım, skor tablosu, online zar, oyun araçları',
  },
  freeGames: {
    title: 'Bedava Oyunlar — Steam, Epic, GOG Kampanyaları',
    description:
      'Steam, Epic Games ve GOG\'daki güncel ücretsiz oyun kampanyaları. Bedava PC oyunlarını anlık takip et, kaçırma.',
    keywords:
      'ücretsiz oyun, bedava oyun, steam ücretsiz, epic games bedava, gog giveaway, pc oyun kampanyası, free game',
  },
  about: {
    title: 'Hakkımızda — Kuralı Ne? Oyun Platformu',
    description:
      'Kuralı Ne?, geleneksel oyun mirasını dijital çağa taşıyan kapsamlı bir oyun platformudur: kurallar, rehberler, araçlar, haberler ve bedava oyunlar.',
    keywords:
      'hakkımızda, kuralı ne, oyun platformu, geleneksel oyunlar, oyun rehberi, dijital oyun rehberi',
  },
  contact: {
    title: 'İletişim - Bize Ulaşın',
    description: 'Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçin.',
    keywords: 'iletişim, bize ulaşın, destek, geri bildirim',
  },
  auth: {
    title: 'Giriş Yap / Kayıt Ol',
    description: 'Kuralı Ne? hesabınıza giriş yapın veya yeni bir hesap oluşturun. Yorum yapın, oyunları favorileyin.',
    keywords: 'giriş yap, kayıt ol, hesap oluştur, üyelik',
  },
  profile: {
    title: 'Profilim',
    description: 'Kullanıcı profil sayfası. Hesap bilgilerinizi yönetin.',
    keywords: 'profil, hesap, kullanıcı bilgileri',
  },
  terms: {
    title: 'Kullanım Koşulları - Kuralı Ne?',
    description: 'Kuralı Ne? web sitesinin kullanım koşulları. Platform kuralları, kullanıcı sorumlulukları ve fikri mülkiyet hakları.',
    keywords: 'kullanım koşulları, şartlar, koşullar, nasıl oynanır',
  },
  privacy: {
    title: 'Gizlilik Politikası - Kuralı Ne?',
    description: 'Kuralı Ne? gizlilik politikası. Kişisel verilerin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.',
    keywords: 'gizlilik politikası, kvkk, kişisel veriler, veri koruma',
  },
  cookie: {
    title: 'Çerez Politikası - Kuralı Ne?',
    description: 'Kuralı Ne? çerez politikası. Sitede kullanılan çerezler, türleri ve tercihleriniz hakkında bilgi.',
    keywords: 'çerez politikası, cookie, kvkk, gizlilik',
  },
  reklamVerin: {
    title: 'Reklam Verin - Kuralı Ne?',
    description: 'Kuralı Ne? sitesinde reklam verin. Oyunsever hedef kitlenize ulaşın. Banner, sponsorlu içerik ve özel paketler.',
    keywords: 'reklam verin, reklam, sponsorluk, banner reklam, oyun reklam',
  },
  news: {
    title: 'Oyun Haberleri — Çıkış Tarihleri, Fiyatlar & İndirimler',
    description:
      'GTA, AAA oyunlar, konsol ve PC dünyasından güncel haberler. Çıkış tarihleri, fiyatlar, indirimler ve patch notları.',
    keywords:
      'oyun haberleri, oyun çıkış tarihi, oyun fiyatları, steam indirim, ps5 haber, gta 6, oyun güncellemesi, epic games haber',
  },
};

// Kategori bazlı SEO şablonları
export const CATEGORY_SEO = {
  'Kağıt Oyunları': {
    title: 'Kağıt Oyunları - Kuralı Ne?',
    description: 'Batak, Pişti, King, Papaz Kaçtı gibi popüler kağıt oyunlarının kuralları ve nasıl oynandığını öğrenin.',
    keywords: 'kağıt oyunları, batak, pişti, king, papaz kaçtı, kart oyunları',
  },
  'Masa Oyunları': {
    title: 'Masa Oyunları - Kuralı Ne?',
    description: 'Okey, Tavla, Satranç, Dama gibi klasik masa oyunlarının kuralları ve stratejileri.',
    keywords: 'masa oyunları, okey, tavla, satranç, dama, mangala',
  },
  'Kutu Oyunları': {
    title: 'Kutu Oyunları - Kuralı Ne?',
    description: 'Monopoly, UNO, Catan, Risk gibi popüler kutu oyunlarının detaylı kuralları ve ipuçları.',
    keywords: 'kutu oyunları, monopoly, uno, catan, risk, jenga, tabu',
  },
  'Dış Mekan': {
    title: 'Dış Mekan Oyunları - Kuralı Ne?',
    description: 'Saklambaç, Körebe, Yakan Top gibi sokak oyunları ve açık alan oyunlarının kuralları.',
    keywords: 'sokak oyunları, dış mekan oyunları, saklambaç, körebe, yakan top, sek sek',
  },
  'İç Mekan': {
    title: 'İç Mekan Oyunları - Kuralı Ne?',
    description: 'Evde oynayabileceğiniz eğlenceli oyunlar. İç mekan oyunlarının kuralları ve ipuçları.',
    keywords: 'iç mekan oyunları, ev oyunları, salon oyunları',
  },
  'Zeka Oyunları': {
    title: 'Zeka Oyunları - Kuralı Ne?',
    description: 'Satranç, Dama, Sudoku gibi zeka geliştiren oyunların kuralları ve stratejileri.',
    keywords: 'zeka oyunları, strateji oyunları, satranç, dama, bulmaca',
  },
  'PC Oyunları': {
    title: 'PC Oyunları - Sistem Gereksinimleri & Rehber',
    description: 'PC oyunlarının nasıl oynanır rehberleri, Steam/Epic indirme linkleri, RAM, ekran kartı ve sistem gereksinimleri.',
    keywords: 'pc oyunları, steam oyunları, sistem gereksinimleri, ekran kartı, ram, oyun indir',
  },
  'Konsol Oyunları': {
    title: 'Konsol Oyunları - PS, Xbox, Switch Rehberi',
    description: 'PlayStation, Xbox ve Nintendo Switch oyun rehberleri, mağaza linkleri ve platform bilgileri.',
    keywords: 'konsol oyunları, ps5 oyunları, xbox oyunları, switch oyunları, playstation',
  },
  'Mobil Oyunlar': {
    title: 'Mobil Oyunlar - Android & iOS Rehberi',
    description: 'Mobil oyun rehberleri, App Store ve Google Play linkleri, oynanış ipuçları ve cihaz gereksinimleri.',
    keywords: 'mobil oyunlar, android oyunları, ios oyunları, app store, google play',
  },
};

// Schema.org yapılandırmaları
export const SCHEMA_TEMPLATES = {
  // Organization schema
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: DEFAULT_META.description,
    foundingDate: SITE_CONFIG.foundingDate,
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONFIG.email,
      contactType: 'customer service',
      availableLanguage: 'Turkish',
    },
    sameAs: [
      // Sosyal medya linkleri buraya eklenebilir
    ],
  },

  // Website schema
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: DEFAULT_META.description,
    inLanguage: SITE_CONFIG.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/oyunlar?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },

  // WebPage base schema
  webPage: (title, description, url) => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: `${SITE_CONFIG.url}${url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    inLanguage: SITE_CONFIG.language,
  }),
};

// ISO-8601 dakikadan PT formatina (orn. 45 -> 'PT45M', 90 -> 'PT1H30M')
function minutesToIso8601(minutes) {
  const m = Number(minutes);
  if (!m || m <= 0 || !Number.isFinite(m)) return 'PT30M';
  const hours = Math.floor(m / 60);
  const remaining = Math.round(m % 60);
  if (hours === 0) return `PT${remaining}M`;
  if (remaining === 0) return `PT${hours}H`;
  return `PT${hours}H${remaining}M`;
}

// Oyun SEO başlık kalıbı — geleneksel vs dijital
export function getGameSeoHeadline(gameName, category) {
  if (!gameName) return 'Oyun Rehberi';
  if (isDigitalGameCategory(category)) {
    return `${gameName} Nasıl Oynanır?`;
  }
  return `${gameName} Kuralı Ne?`;
}

// Oyun için HowTo schema oluşturucu
export function generateGameSchema(game, options = {}) {
  if (!game) return null;

  const isDigital = isDigitalGameCategory(game.category);
  const schema = {
    '@context': 'https://schema.org',
    '@type': isDigital ? 'VideoGame' : 'HowTo',
    name: getGameSeoHeadline(game.name, game.category),
    description: game.description || game.shortDescription,
    image: game.image,
    totalTime: minutesToIso8601(game.playTimeMinutes),
    ...(isDigital
      ? {
          genre: game.category,
          gamePlatform: game.category?.includes('Mobil')
            ? 'Mobile'
            : game.category?.includes('Konsol')
              ? 'Console'
              : 'PC',
        }
      : {
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'TRY',
            value: '0',
          },
          supply: [
            {
              '@type': 'HowToSupply',
              name: game.category || 'Oyun malzemeleri',
            },
          ],
          tool: [
            {
              '@type': 'HowToTool',
              name: game.players || 'Oyuncular',
            },
          ],
          step: (game.rules || []).map((rule, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: `Adım ${index + 1}`,
            text: rule,
            url: `${SITE_CONFIG.url}/oyun/${game.slug}#adim-${index + 1}`,
          })),
        }),
  };

  if (!isDigital && game.tips && game.tips.length > 0) {
    schema.tip = game.tips.map((tip) => ({
      '@type': 'HowToTip',
      text: tip,
    }));
  }

  // AggregateRating (varsa) - rich snippet yildizlari icin
  const rating = options.aggregateRating;
  if (rating && rating.count > 0 && rating.average > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(rating.average).toFixed(2),
      ratingCount: rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

function getVideoEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

// VideoObject schema - YouTube/Vimeo video icin rich snippet
export function generateVideoSchema(game) {
  if (!game?.videoUrl) return null;

  const name = game.videoTitle || `${game.name} Kuralı Ne? - Video Anlatım`;
  const description = game.shortDescription
    ? `${game.name} oyununun nasıl oynandığını adım adım anlatan video. ${game.shortDescription}`
    : `${game.name} oyununun nasıl oynandığını anlatan video.`;
  const embedUrl = getVideoEmbedUrl(game.videoUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl: game.image,
    contentUrl: game.videoUrl,
    embedUrl,
    uploadDate: game.createdAt || game.updatedAt || new Date().toISOString(),
    inLanguage: SITE_CONFIG.language,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
  };
}

// Karsilastirma sayfasi schema - "X vs Y" sayfalari icin
export function generateComparisonPageSchema(gameA, gameB) {
  if (!gameA || !gameB) return null;

  const url = `${SITE_CONFIG.url}/karsilastir/${gameA.slug}-vs-${gameB.slug}`;
  const title = `${gameA.name} vs ${gameB.name} - Hangisi Daha İyi?`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url,
    description: `${gameA.name} ile ${gameB.name} oyunlarının kuralları, oyuncu sayısı, zorluk seviyesi ve oyun süresi karşılaştırması.`,
    inLanguage: SITE_CONFIG.language,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Game',
            name: gameA.name,
            url: `${SITE_CONFIG.url}/oyun/${gameA.slug}`,
            image: gameA.image,
            genre: gameA.category,
            numberOfPlayers: { '@type': 'QuantitativeValue', value: gameA.players },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Game',
            name: gameB.name,
            url: `${SITE_CONFIG.url}/oyun/${gameB.slug}`,
            image: gameB.image,
            genre: gameB.category,
            numberOfPlayers: { '@type': 'QuantitativeValue', value: gameB.players },
          },
        },
      ],
    },
  };
}

// Article schema oluşturucu
export function generateArticleSchema(game) {
  if (!game) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${game.name} Kuralı Ne? Kuralları ve İpuçları`,
    description: game.shortDescription || game.description,
    image: game.image,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    datePublished: game.createdAt,
    dateModified: game.updatedAt || game.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/oyun/${game.slug}`,
    },
    articleSection: game.category,
    keywords: `${game.name}, ${game.category}, nasıl oynanır, kuralları`,
  };
}

// Haber makalesi schema
export function generateNewsArticleSchema(post) {
  if (!post?.title || !post?.slug) return null;

  const image = post.coverImage || SITE_CONFIG.defaultImage;
  const published = post.publishedAt || post.createdAt;
  const modified = post.updatedAt || published;
  const headline = post.title;
  const description =
    post.excerpt || post.seoDescription || truncateTextForSchema(post.content, 160);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    alternativeHeadline: post.subtitle || undefined,
    description,
    image: [image],
    inLanguage: 'tr-TR',
    author: {
      '@type': 'Organization',
      name: post.author || SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    datePublished: published,
    dateModified: modified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/haberler/${post.slug}`,
    },
    url: `${SITE_CONFIG.url}/haberler/${post.slug}`,
    articleSection: post.category,
    keywords: [headline, post.category, ...(post.tags || [])].filter(Boolean).join(', '),
  };

  if (post.wordCount) {
    schema.wordCount = post.wordCount;
  }

  if (post.readTimeMinutes) {
    schema.timeRequired = `PT${post.readTimeMinutes}M`;
  }

  return schema;
}

function truncateTextForSchema(text, max = 160) {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}

// Breadcrumb schema oluşturucu
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${SITE_CONFIG.url}${item.url}` : undefined,
    })),
  };
}

// FAQ schema oluşturucu
export function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ItemList schema (oyun listesi için)
export function generateItemListSchema(games, listName = 'Oyun Listesi') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: games.length,
    itemListElement: games.slice(0, 10).map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Game',
        name: game.name,
        description: game.shortDescription,
        image: game.image,
        url: `${SITE_CONFIG.url}/oyun/${game.slug}`,
        genre: game.category,
        numberOfPlayers: game.players,
      },
    })),
  };
}

// CollectionPage schema (kategori sayfası için)
export function generateCollectionPageSchema(category, games) {
  const categoryInfo = CATEGORY_SEO[category] || {};
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryInfo.title || `${category} - Kuralı Ne?`,
    description: categoryInfo.description || `${category} kategorisindeki tüm oyunlar`,
    url: `${SITE_CONFIG.url}/kategori/${encodeURIComponent(category)}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    mainEntity: generateItemListSchema(games, category),
  };
}

// Canonical URL oluşturucu
export function getCanonicalUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/** Karşılaştırma URL ayırıcısı: /karsilastir/{slugA}-vs-{slugB} */
export const COMPARISON_SEPARATOR = '-vs-';

/** URL segmentinden iki oyun slug'ını çıkarır (slug içinde tire olsa da güvenli). */
export function parseComparisonParam(comparison) {
  if (!comparison || typeof comparison !== 'string') return null;
  const idx = comparison.indexOf(COMPARISON_SEPARATOR);
  if (idx <= 0) return null;
  const slugA = comparison.slice(0, idx);
  const slugB = comparison.slice(idx + COMPARISON_SEPARATOR.length);
  if (!slugA || !slugB) return null;
  return { slugA, slugB };
}

/** Karşılaştırma sayfası yolu (slug sırası korunur — her iki yön de çalışır). */
export function buildComparisonPath(slugA, slugB) {
  if (!slugA || !slugB) return null;
  return `/karsilastir/${slugA}${COMPARISON_SEPARATOR}${slugB}`;
}

// Title oluşturucu
export function generateTitle(pageTitle, includeSiteName = true) {
  if (!pageTitle) return DEFAULT_META.title;
  return includeSiteName ? `${pageTitle} - ${SITE_CONFIG.name}` : pageTitle;
}

// Open Graph image URL oluşturucu
export function getOgImageUrl(customImage) {
  return customImage || SITE_CONFIG.defaultImage;
}

// Arama motoru robots direktifleri
export const ROBOTS_DIRECTIVES = {
  index: 'index, follow',
  noindex: 'noindex, follow',
  nofollow: 'index, nofollow',
  none: 'noindex, nofollow',
  default: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

// Sosyal medya paylaşım URL oluşturucuları
export const SHARE_URLS = {
  twitter: (url, text) => 
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  facebook: (url) => 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  whatsapp: (url, text) => 
    `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  telegram: (url, text) => 
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  linkedin: (url, title) => 
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  pinterest: (url, media, description) => 
    `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(description)}`,
};

export default {
  SITE_CONFIG,
  DEFAULT_META,
  PAGE_SEO,
  CATEGORY_SEO,
  SCHEMA_TEMPLATES,
  generateGameSchema,
  generateVideoSchema,
  generateComparisonPageSchema,
  generateArticleSchema,
  generateNewsArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateItemListSchema,
  generateCollectionPageSchema,
  getCanonicalUrl,
  generateTitle,
  getOgImageUrl,
  ROBOTS_DIRECTIVES,
  SHARE_URLS,
};
