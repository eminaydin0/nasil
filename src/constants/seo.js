/**
 * SEO Yapılandırma Dosyası
 * Tüm SEO ayarlarını merkezi olarak yönetir
 */

// Site temel bilgileri
export const SITE_CONFIG = {
  name: 'Kuralı Ne?',
  tagline: 'Geleneksel Türk Oyunları Rehberi',
  url: 'https://kuraline.xyz',
  defaultImage: 'https://kuraline.xyz/og-image.jpg',
  locale: 'tr_TR',
  language: 'tr',
  charset: 'UTF-8',
  themeColor: '#f97316',
  twitterHandle: '@kuraline',
  author: 'Kuralı Ne?',
  publisher: 'Kuralı Ne?',
  foundingDate: '2024',
  email: 'eminaydinyazilim@gmail.com',
};

// Varsayılan meta açıklamaları
export const DEFAULT_META = {
  title: 'Geleneksel Türk Oyunları - Kuralı Ne? Kuralları, İpuçları ve Stratejileri',
  description: 'Okey, Batak, Pişti, Saklambaç gibi geleneksel Türk oyunlarının kuralı ne? Detaylı kurallar, ipuçları ve stratejiler. 50+ oyun rehberi!',
  keywords: 'okey kuralı ne, batak kuralı ne, pişti kuralı ne, 101 okey kuralları, batak kuralları, geleneksel oyunlar, türk oyunları, kağıt oyunları, masa oyunları, çocuk oyunları, sokak oyunları',
};

// Sayfa bazlı SEO şablonları
export const PAGE_SEO = {
  home: {
    title: 'Kuralı Ne? - Geleneksel Türk Oyunları Rehberi',
    description: 'Okey, Batak, Pişti, Saklambaç gibi geleneksel Türk oyunlarının kuralı ne? Detaylı kurallar, ipuçları ve stratejiler tek bir yerde.',
    keywords: 'kuralı ne, oyun kuralları, geleneksel türk oyunları, kart oyunları, masa oyunları, çocuk oyunları',
  },
  allGames: {
    title: 'Tüm Oyunlar - Oyun Arşivi',
    description: 'Tüm geleneksel Türk oyunları ve popüler kutu oyunları tek bir yerde. Kart oyunları, masa oyunları, sokak oyunları ve daha fazlası.',
    keywords: 'tüm oyunlar, oyun listesi, oyun arşivi, kart oyunları, masa oyunları, kutu oyunları',
  },
  tools: {
    title: 'Oyun Araçları - Skor Tablosu ve Yardımcı Araçlar',
    description: 'Okey sayacı, Batak yazboz, takım oluşturucu ve daha fazla oyun aracı. Oyunlarınızı daha kolay takip edin.',
    keywords: 'okey sayacı, batak yazboz, 101 okey hesaplama, takım oluşturucu, skor tablosu, oyun araçları',
  },
  about: {
    title: 'Hakkımızda - Kuralı Ne?',
    description: 'Kuralı Ne?, geleneksel Türk oyunlarını ve popüler kutu oyunlarını dijital dünyada yaşatmak amacıyla kurulmuş kapsamlı bir oyun rehberidir.',
    keywords: 'hakkımızda, nasıl oynanır, geleneksel oyunlar, türk oyunları',
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
    title: 'Oyun Haberleri - Çıkış Tarihleri ve Güncellemeler',
    description: 'GTA, konsol ve PC oyunları hakkında güncel haberler. Çıkış tarihleri, fiyatlar, indirimler ve oyun dünyasından son gelişmeler.',
    keywords: 'oyun haberleri, oyun çıkış tarihi, oyun fiyatları, gta 6, konsol oyunları, pc oyun haberleri',
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
    logo: `${SITE_CONFIG.url}/logo.svg`,
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

// Oyun için HowTo schema oluşturucu
export function generateGameSchema(game, options = {}) {
  if (!game) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${game.name} Kuralı Ne?`,
    description: game.description || game.shortDescription,
    image: game.image,
    totalTime: minutesToIso8601(game.playTimeMinutes),
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
  };

  // İpuçları varsa tip section ekle
  if (game.tips && game.tips.length > 0) {
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
        url: `${SITE_CONFIG.url}/logo.svg`,
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
        url: `${SITE_CONFIG.url}/logo.svg`,
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
        url: `${SITE_CONFIG.url}/logo.svg`,
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
