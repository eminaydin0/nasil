/**
 * SEO Yapılandırma Dosyası
 * Tüm SEO ayarlarını merkezi olarak yönetir
 */

// Site temel bilgileri
export const SITE_CONFIG = {
  name: 'Nasıl Oynanır',
  tagline: 'Geleneksel Türk Oyunları Rehberi',
  url: 'https://nasiloynanir.com',
  defaultImage: 'https://nasiloynanir.com/og-image.jpg',
  locale: 'tr_TR',
  language: 'tr',
  charset: 'UTF-8',
  themeColor: '#f97316',
  twitterHandle: '@nasiloynanir',
  author: 'Nasıl Oynanır',
  publisher: 'Nasıl Oynanır',
  foundingDate: '2024',
  email: 'eminaydinyazilim@gmail.com',
};

// Varsayılan meta açıklamaları
export const DEFAULT_META = {
  title: 'Geleneksel Türk Oyunları - Nasıl Oynanır? Kuralları ve İpuçları',
  description: 'Okey, Batak, Pişti, Saklambaç gibi geleneksel Türk oyunlarının nasıl oynanacağını öğrenin. Detaylı kurallar, ipuçları ve stratejiler. 50+ oyun rehberi!',
  keywords: 'okey nasıl oynanır, batak nasıl oynanır, pişti nasıl oynanır, 101 okey kuralları, batak kuralları, geleneksel oyunlar, türk oyunları, kağıt oyunları, masa oyunları, çocuk oyunları, sokak oyunları',
};

// Sayfa bazlı SEO şablonları
export const PAGE_SEO = {
  home: {
    title: 'Geleneksel Türk Oyunları - Nasıl Oynanır? Kuralları ve İpuçları',
    description: 'Okey, Batak, Pişti, Saklambaç gibi geleneksel Türk oyunlarının nasıl oynanacağını öğrenin. Detaylı kurallar, ipuçları ve stratejiler.',
    keywords: 'geleneksel türk oyunları, nasıl oynanır, oyun kuralları, kart oyunları, masa oyunları, çocuk oyunları',
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
    title: 'Hakkımızda - Nasıl Oynanır',
    description: 'Nasıl Oynanır, geleneksel Türk oyunlarını ve popüler kutu oyunlarını dijital dünyada yaşatmak amacıyla kurulmuş kapsamlı bir oyun rehberidir.',
    keywords: 'hakkımızda, nasıl oynanır, geleneksel oyunlar, türk oyunları',
  },
  contact: {
    title: 'İletişim - Bize Ulaşın',
    description: 'Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçin.',
    keywords: 'iletişim, bize ulaşın, destek, geri bildirim',
  },
  auth: {
    title: 'Giriş Yap / Kayıt Ol',
    description: 'Nasıl Oynanır hesabınıza giriş yapın veya yeni bir hesap oluşturun. Yorum yapın, oyunları favorileyin.',
    keywords: 'giriş yap, kayıt ol, hesap oluştur, üyelik',
  },
  profile: {
    title: 'Profilim',
    description: 'Kullanıcı profil sayfası. Hesap bilgilerinizi yönetin.',
    keywords: 'profil, hesap, kullanıcı bilgileri',
  },
  terms: {
    title: 'Kullanım Koşulları - Nasıl Oynanır',
    description: 'Nasıl Oynanır web sitesinin kullanım koşulları. Platform kuralları, kullanıcı sorumlulukları ve fikri mülkiyet hakları.',
    keywords: 'kullanım koşulları, şartlar, koşullar, nasıl oynanır',
  },
  privacy: {
    title: 'Gizlilik Politikası - Nasıl Oynanır',
    description: 'Nasıl Oynanır gizlilik politikası. Kişisel verilerin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.',
    keywords: 'gizlilik politikası, kvkk, kişisel veriler, veri koruma',
  },
  cookie: {
    title: 'Çerez Politikası - Nasıl Oynanır',
    description: 'Nasıl Oynanır çerez politikası. Sitede kullanılan çerezler, türleri ve tercihleriniz hakkında bilgi.',
    keywords: 'çerez politikası, cookie, kvkk, gizlilik',
  },
  reklamVerin: {
    title: 'Reklam Verin - Nasıl Oynanır',
    description: 'Nasıl Oynanır\'da reklam verin. Oyunsever hedef kitlenize ulaşın. Banner, sponsorlu içerik ve özel paketler.',
    keywords: 'reklam verin, reklam, sponsorluk, banner reklam, oyun reklam',
  },
};

// Kategori bazlı SEO şablonları
export const CATEGORY_SEO = {
  'Kağıt Oyunları': {
    title: 'Kağıt Oyunları - Nasıl Oynanır?',
    description: 'Batak, Pişti, King, Papaz Kaçtı gibi popüler kağıt oyunlarının kuralları ve nasıl oynandığını öğrenin.',
    keywords: 'kağıt oyunları, batak, pişti, king, papaz kaçtı, kart oyunları',
  },
  'Masa Oyunları': {
    title: 'Masa Oyunları - Nasıl Oynanır?',
    description: 'Okey, Tavla, Satranç, Dama gibi klasik masa oyunlarının kuralları ve stratejileri.',
    keywords: 'masa oyunları, okey, tavla, satranç, dama, mangala',
  },
  'Kutu Oyunları': {
    title: 'Kutu Oyunları - Nasıl Oynanır?',
    description: 'Monopoly, UNO, Catan, Risk gibi popüler kutu oyunlarının detaylı kuralları ve ipuçları.',
    keywords: 'kutu oyunları, monopoly, uno, catan, risk, jenga, tabu',
  },
  'Dış Mekan': {
    title: 'Dış Mekan Oyunları - Nasıl Oynanır?',
    description: 'Saklambaç, Körebe, Yakan Top gibi sokak oyunları ve açık alan oyunlarının kuralları.',
    keywords: 'sokak oyunları, dış mekan oyunları, saklambaç, körebe, yakan top, sek sek',
  },
  'İç Mekan': {
    title: 'İç Mekan Oyunları - Nasıl Oynanır?',
    description: 'Evde oynayabileceğiniz eğlenceli oyunlar. İç mekan oyunlarının kuralları ve ipuçları.',
    keywords: 'iç mekan oyunları, ev oyunları, salon oyunları',
  },
  'Zeka Oyunları': {
    title: 'Zeka Oyunları - Nasıl Oynanır?',
    description: 'Satranç, Dama, Sudoku gibi zeka geliştiren oyunların kuralları ve stratejileri.',
    keywords: 'zeka oyunları, strateji oyunları, satranç, dama, bulmaca',
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
    logo: `${SITE_CONFIG.url}/icon-512.svg`,
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

// Oyun için HowTo schema oluşturucu
export function generateGameSchema(game) {
  if (!game) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${game.name} Nasıl Oynanır`,
    description: game.description || game.shortDescription,
    image: game.image,
    totalTime: 'PT30M',
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

  return schema;
}

// Article schema oluşturucu
export function generateArticleSchema(game) {
  if (!game) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${game.name} Nasıl Oynanır? Kuralları ve İpuçları`,
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
        url: `${SITE_CONFIG.url}/icon-512.svg`,
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
    name: categoryInfo.title || `${category} - Nasıl Oynanır?`,
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
  generateArticleSchema,
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
