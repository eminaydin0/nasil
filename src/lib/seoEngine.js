/**
 * Dinamik SEO Motoru
 * Supabase / admin panelden gelen oyun verisine göre meta, FAQ ve schema üretir.
 */

import {
  SITE_CONFIG,
  CATEGORY_SEO,
  generateGameSchema,
  generateArticleSchema,
  generateNewsArticleSchema,
  generateVideoSchema,
  generateFAQSchema,
  generateCollectionPageSchema,
  generateItemListSchema,
  generateComparisonPageSchema,
} from '../constants/seo';
import { TOOL_PAGE_SEO, generateWebApplicationSchema } from '../constants/seoKeywords';

// ─── Yardımcılar ───────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  've', 'ile', 'için', 'bir', 'bu', 'da', 'de', 'mi', 'mu', 'mı', 'mü',
  'olan', 'olarak', 'gibi', 'kadar', 'sonra', 'önce', 'her', 'tüm', 'oyun',
  'oyuncu', 'oyuncular', 'adım', 'kural', 'kurallar', 'oynanır', 'oynan',
  'the', 'and', 'or', 'to', 'in', 'on', 'at',
]);

export function truncateText(text, max = 160, ellipsis = '…') {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - ellipsis.length);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + ellipsis;
}

function dedupeList(items, keyFn = (x) => x) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item)?.toLocaleLowerCase('tr-TR')?.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeGameInput(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    slug: raw.slug || '',
    name: raw.name || '',
    category: raw.category || '',
    players: raw.players || '',
    difficulty: raw.difficulty || '',
    image: raw.image || '',
    gallery: Array.isArray(raw.gallery) ? raw.gallery : [],
    shortDescription: raw.shortDescription ?? raw.short_description ?? '',
    description: raw.description ?? '',
    rules: (Array.isArray(raw.rules) ? raw.rules : []).filter(Boolean),
    tips: (Array.isArray(raw.tips) ? raw.tips : []).filter(Boolean),
    videoUrl: raw.videoUrl ?? raw.video_url ?? '',
    videoTitle: raw.videoTitle ?? raw.video_title ?? '',
    playTimeMinutes: raw.playTimeMinutes ?? raw.play_time_minutes ?? null,
    faq: Array.isArray(raw.faq) ? raw.faq.filter((f) => f?.question || f?.answer) : [],
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at,
  };
}

export function parsePlayerCount(playersText) {
  if (!playersText) return null;
  const str = String(playersText);
  const range = str.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (range) return { min: +range[1], max: +range[2], label: str.trim() };
  const single = str.match(/(\d+)/);
  if (single) return { min: +single[1], max: +single[1], label: str.trim() };
  return { min: null, max: null, label: str.trim() };
}

function formatPlayTime(minutes) {
  const m = Number(minutes);
  if (!m || m <= 0) return null;
  if (m < 60) return `${m} dakika`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} saat ${r} dk` : `${h} saat`;
}

// ─── Kategori & isim bazlı zenginleştirme ─────────────────────────────────

const CATEGORY_KEYWORD_MAP = {
  'Kağıt Oyunları': ['kağıt oyunu', 'kart oyunu', 'iskambil', 'deste'],
  'Masa Oyunları': ['masa oyunu', 'masada oynanan', 'tahta oyunu'],
  'Kutu Oyunları': ['kutu oyunu', 'board game', 'aile oyunu'],
  'Dış Mekan': ['sokak oyunu', 'dış mekan', 'açık alan', 'çocuk oyunu'],
  'İç Mekan': ['iç mekan', 'ev oyunu', 'salon oyunu'],
  'Zeka Oyunları': ['zeka oyunu', 'strateji', 'bulmaca'],
};

const NAME_PATTERN_BOOSTS = [
  { test: /101|yüz.?bir/i, keywords: ['101 okey', '101 kuralları', '101 ceza puanı', 'yüz bir okey'] },
  { test: /okey/i, keywords: ['okey taşı', 'düşmeli okey', 'okey kuralları', 'okey nasıl oynanır'] },
  { test: /batak|king|ihale/i, keywords: ['ihaleli batak', 'eşli batak', 'king oyunu', 'batak kuralları'] },
  { test: /pişti|pisti/i, keywords: ['pişti kuralları', 'pişti nasıl oynanır', 'iskambil pişti'] },
  { test: /tavla/i, keywords: ['tavla kuralları', 'tavla nasıl oynanır', 'backgammon'] },
  { test: /saklambaç|saklanbac/i, keywords: ['saklambaç nasıl oynanır', 'çocuk oyunu saklambaç'] },
  { test: /körebe|yakan.?top|sek/i, keywords: ['sokak oyunu', 'çocuk oyunları'] },
  { test: /monopoly|tabu|uno|catan|risk|jenga/i, keywords: ['kutu oyunu', 'aile oyunu', 'parti oyunu'] },
  { test: /satranç|dama|mangala/i, keywords: ['strateji oyunu', 'klasik masa oyunu'] },
];

function getNamePatternKeywords(name) {
  if (!name) return [];
  return NAME_PATTERN_BOOSTS.filter(({ test }) => test.test(name)).flatMap((p) => p.keywords);
}

function getCategoryKeywords(category) {
  return CATEGORY_KEYWORD_MAP[category] || [];
}

function extractRuleKeywords(rules, limit = 6) {
  const words = [];
  for (const rule of (rules || []).slice(0, 5)) {
    const tokens = String(rule)
      .toLocaleLowerCase('tr-TR')
      .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
    words.push(...tokens.slice(0, 3));
  }
  return [...new Set(words)].slice(0, limit);
}

// ─── Oyun SEO Meta ─────────────────────────────────────────────────────────

export function buildGameTitle(game) {
  const g = normalizeGameInput(game);
  if (!g?.name) return 'Oyun Kuralları';
  return `${g.name} Kuralı Ne?`;
}

export function buildGameDescription(game) {
  const g = normalizeGameInput(game);
  if (!g) return '';

  const parts = [];
  const intro = g.shortDescription || truncateText(g.description, 100);
  parts.push(`${g.name} kuralı ne?`);
  if (intro) parts.push(intro);

  const metaBits = [];
  if (g.players) metaBits.push(g.players);
  if (g.difficulty) metaBits.push(`${g.difficulty} seviye`);
  const time = formatPlayTime(g.playTimeMinutes);
  if (time) metaBits.push(`~${time}`);
  if (metaBits.length) parts.push(metaBits.join(' · '));

  const contentBits = [];
  if (g.rules?.length) contentBits.push(`${g.rules.length} adımlık kurallar`);
  if (g.tips?.length) contentBits.push(`${g.tips.length} ipucu`);
  if (g.videoUrl) contentBits.push('video anlatım');
  if (g.faq?.length) contentBits.push(`${g.faq.length} SSS`);
  if (contentBits.length) parts.push(contentBits.join(', ') + '.');

  if (!contentBits.length) parts.push('Adım adım kurallar, stratejiler ve püf noktaları.');

  return truncateText(parts.join(' '), 160);
}

export function buildGameKeywords(game) {
  const g = normalizeGameInput(game);
  if (!g) return '';

  const name = g.name;
  const keywords = [
    `${name} kuralı ne`,
    `${name} nasıl oynanır`,
    `${name} kuralları`,
    `${name} ipuçları`,
    `${name} stratejileri`,
    `${name} oyunu`,
    `${name.toLocaleLowerCase('tr-TR')} kuralları`,
    g.category,
    g.category ? `${g.category.toLocaleLowerCase('tr-TR')} kuralları` : null,
    g.difficulty ? `${g.difficulty} ${g.category || 'oyun'}`.toLocaleLowerCase('tr-TR') : null,
    g.players,
    ...getCategoryKeywords(g.category),
    ...getNamePatternKeywords(name),
    ...extractRuleKeywords(g.rules).map((w) => `${name} ${w}`),
    'kuralı ne',
    'nasıl oynanır',
    'oyun kuralları',
    'geleneksel türk oyunları',
  ];

  return dedupeList(keywords.filter(Boolean)).slice(0, 25).join(', ');
}

export function buildGameTags(game) {
  const g = normalizeGameInput(game);
  if (!g) return [];
  return dedupeList([
    g.name,
    g.category,
    'oyun kuralları',
    'nasıl oynanır',
    'kuralı ne',
    ...getNamePatternKeywords(g.name).slice(0, 3),
  ]).slice(0, 8);
}

export function buildGameSeoMeta(game, options = {}) {
  const g = normalizeGameInput(game);
  if (!g) return {};

  return {
    title: buildGameTitle(g),
    description: buildGameDescription(g),
    keywords: buildGameKeywords(g),
    tags: buildGameTags(g),
    image: g.image || SITE_CONFIG.defaultImage,
    imageAlt: `${g.name} oyun kuralları — ${g.category || 'Kuralı Ne?'}`,
    url: `/oyun/${g.slug}`,
    section: g.category,
    publishedTime: g.createdAt,
    modifiedTime: g.updatedAt || g.createdAt,
  };
}

// ─── Otomatik FAQ (admin FAQ + veri tabanlı) ───────────────────────────────

function generateAutoFaqs(game) {
  const g = normalizeGameInput(game);
  if (!g?.name) return [];

  const faqs = [];
  const players = parsePlayerCount(g.players);

  if (players?.label) {
    faqs.push({
      question: `${g.name} kaç kişiyle oynanır?`,
      answer: players.min === players.max
        ? `${g.name} genellikle ${players.label} oynanır.`
        : `${g.name} ${players.label} arasında oynanabilir.`,
      source: 'auto-players',
    });
  }

  if (g.difficulty) {
    faqs.push({
      question: `${g.name} zor mu, kolay mı?`,
      answer: `${g.name} ${g.difficulty} seviyede kabul edilir. Kuralları öğrendikten sonra pratikle kolaylaşır.`,
      source: 'auto-difficulty',
    });
  }

  const time = formatPlayTime(g.playTimeMinutes);
  if (time) {
    faqs.push({
      question: `${g.name} ne kadar sürer?`,
      answer: `${g.name} ortalama ${time} sürer. Oyuncu sayısı ve deneyime göre süre değişebilir.`,
      source: 'auto-time',
    });
  }

  if (g.rules?.length > 0) {
    faqs.push({
      question: `${g.name} nasıl oynanır?`,
      answer: g.rules.length <= 3
        ? `${g.name} ${g.rules.length} temel adımda oynanır: ${g.rules.map((r, i) => `${i + 1}) ${truncateText(r, 80, '…')}`).join(' ')}`
        : `${g.name} ${g.rules.length} adımda anlatılmıştır. İlk adım: ${truncateText(g.rules[0], 120, '…')} Detaylı kurallar sayfada listelenmiştir.`,
      source: 'auto-rules',
    });
  }

  if (g.category) {
    faqs.push({
      question: `${g.name} hangi tür bir oyundur?`,
      answer: `${g.name}, ${g.category} kategorisinde yer alan bir oyundur.${g.players ? ` ${g.players} oynanır.` : ''}`,
      source: 'auto-category',
    });
  }

  if (g.tips?.length > 0) {
    faqs.push({
      question: `${g.name} oynarken nelere dikkat edilmeli?`,
      answer: `İşte ${g.name} için önemli bir ipucu: ${truncateText(g.tips[0], 200, '…')}${g.tips.length > 1 ? ` Sayfada toplam ${g.tips.length} ipucu bulabilirsiniz.` : ''}`,
      source: 'auto-tips',
    });
  }

  if (g.videoUrl) {
    faqs.push({
      question: `${g.name} video ile anlatılıyor mu?`,
      answer: `Evet. ${g.name} oyununun nasıl oynandığını adım adım gösteren video anlatım bu sayfada mevcuttur.`,
      source: 'auto-video',
    });
  }

  return faqs;
}

export function buildGameFaqs(game) {
  const g = normalizeGameInput(game);
  if (!g) return [];

  const adminFaqs = (g.faq || [])
    .filter((f) => f?.question?.trim() && f?.answer?.trim())
    .map((f) => ({
      question: f.question.trim(),
      answer: f.answer.trim(),
      source: 'admin',
    }));

  const autoFaqs = generateAutoFaqs(g);

  // Admin FAQ öncelikli; aynı soru metnine sahip otomatik FAQ'ları atla
  const adminQuestions = new Set(
    adminFaqs.map((f) => f.question.toLocaleLowerCase('tr-TR'))
  );

  const merged = [
    ...adminFaqs,
    ...autoFaqs.filter(
      (f) => !adminQuestions.has(f.question.toLocaleLowerCase('tr-TR'))
    ),
  ];

  return dedupeList(merged, (f) => f.question).slice(0, 12);
}

// ─── Schema üretimi ────────────────────────────────────────────────────────

function generateGameEntitySchema(game, options = {}) {
  const g = normalizeGameInput(game);
  if (!g) return null;

  const players = parsePlayerCount(g.players);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: g.name,
    description: g.shortDescription || truncateText(g.description, 300),
    image: g.image,
    url: `${SITE_CONFIG.url}/oyun/${g.slug}`,
    genre: g.category,
    inLanguage: 'tr',
    gamePlatform: 'Tabletop',
    applicationCategory: 'Game',
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  if (players?.label) {
    schema.numberOfPlayers = {
      '@type': 'QuantitativeValue',
      value: players.label,
      ...(players.min != null && { minValue: players.min }),
      ...(players.max != null && { maxValue: players.max }),
    };
  }

  if (g.playTimeMinutes) {
    schema.timeRequired = `PT${Number(g.playTimeMinutes)}M`;
  }

  if (g.difficulty) {
    schema.audience = {
      '@type': 'PeopleAudience',
      suggestedMinAge: g.difficulty === 'Kolay' ? 6 : g.difficulty === 'Orta' ? 10 : 14,
    };
  }

  const rating = options.aggregateRating;
  if (rating?.count > 0 && rating?.average > 0) {
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

function generateSpeakableSchema(game) {
  const g = normalizeGameInput(game);
  if (!g?.shortDescription && !g?.description) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: buildGameTitle(g),
    url: `${SITE_CONFIG.url}/oyun/${g.slug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.game-description', '.game-rules', 'h1'],
    },
  };
}

export function buildGameStructuredData(game, options = {}) {
  const g = normalizeGameInput(game);
  if (!g) return [];

  const faqs = buildGameFaqs(g);
  const aggregateRating = options.aggregateRating?.count > 0
    ? options.aggregateRating
    : null;

  return [
    generateGameSchema(g, { aggregateRating }),
    generateArticleSchema(g),
    generateVideoSchema(g),
    faqs.length > 0 ? generateFAQSchema(faqs) : null,
    generateGameEntitySchema(g, { aggregateRating }),
    generateSpeakableSchema(g),
  ].filter(Boolean);
}

// ─── Kategori SEO (yüklenen oyun listesine göre) ───────────────────────────

export function buildCategorySeoMeta(categoryName, games = [], options = {}) {
  const staticData = CATEGORY_SEO[categoryName] || {};
  const list = games.filter((g) => g?.name);
  const count = list.length;
  const topNames = list.slice(0, 5).map((g) => g.name);
  const customDesc = options.description;

  let title = staticData.title || `${categoryName} Oyunları - Kuralı Ne?`;
  if (count > 0 && !staticData.title) {
    title = `${categoryName} Oyunları (${count}) - Kuralı Ne?`;
  }

  let description = staticData.description || customDesc || '';
  if (count > 0) {
    const namesSnippet = topNames.join(', ');
    const dynamicPart = count <= 5
      ? `${namesSnippet} — ${count} oyunun kuralları ve ipuçları tek sayfada.`
      : `${namesSnippet}${count > 5 ? ` ve ${count - 5} oyun daha` : ''}. Toplam ${count} ${categoryName.toLowerCase()} rehberi.`;
    description = staticData.description
      ? `${staticData.description} ${count} oyun: ${namesSnippet}.`
      : dynamicPart;
  }

  const keywords = dedupeList([
    categoryName,
    `${categoryName.toLowerCase()} oyunları`,
    `${categoryName.toLowerCase()} kuralları`,
    `${categoryName.toLowerCase()} nasıl oynanır`,
    ...getCategoryKeywords(categoryName),
    ...topNames.flatMap((n) => [`${n} kuralı ne`, `${n} kuralları`]),
    'kuralı ne',
    'oyun kuralları',
    'geleneksel türk oyunları',
  ]).slice(0, 20).join(', ');

  return {
    title,
    description: truncateText(description, 160),
    keywords,
    url: `/kategori/${encodeURIComponent(categoryName)}`,
  };
}

export function buildCategoryStructuredData(categoryName, games = []) {
  if (!games.length) return null;
  return [
    generateCollectionPageSchema(categoryName, games),
    generateItemListSchema(games, `${categoryName} Oyunları`),
  ];
}

// ─── Karşılaştırma SEO ─────────────────────────────────────────────────────

const DIFFICULTY_RANK = { Kolay: 1, Orta: 2, Zor: 3 };

export function buildComparisonSeoMeta(gameA, gameB) {
  const a = normalizeGameInput(gameA);
  const b = normalizeGameInput(gameB);
  if (!a || !b) return {};

  const title = `${a.name} vs ${b.name} - Hangisi Daha İyi?`;
  const parts = [`${a.name} ile ${b.name} karşılaştırması:`];

  if (a.players || b.players) parts.push(`oyuncu (${a.players || '?'} / ${b.players || '?'})`);
  if (a.difficulty || b.difficulty) parts.push(`zorluk (${a.difficulty || '?'} / ${b.difficulty || '?'})`);
  const timeA = formatPlayTime(a.playTimeMinutes);
  const timeB = formatPlayTime(b.playTimeMinutes);
  if (timeA || timeB) parts.push(`süre (${timeA || '?'} / ${timeB || '?'})`);
  if (a.rules?.length || b.rules?.length) {
    parts.push(`${a.rules?.length || 0} vs ${b.rules?.length || 0} kural`);
  }

  parts.push('Hangisi size uygun? Detaylı yan yana rehber.');

  const keywords = dedupeList([
    `${a.name} vs ${b.name}`,
    `${a.name} ${b.name} karşılaştırma`,
    `${a.name} mı ${b.name} mi`,
    `${a.name} mı yoksa ${b.name} mi`,
    `${a.name} farkları`,
    `${b.name} farkları`,
    `${a.name} ${b.name} fark`,
    a.category,
    b.category,
    'oyun karşılaştırma',
    'hangisi daha iyi',
  ]).join(', ');

  return {
    title,
    description: truncateText(parts.join(' '), 160),
    keywords,
    url: `/karsilastir/${a.slug}-vs-${b.slug}`,
    image: a.image || b.image,
  };
}

export function buildComparisonStructuredData(gameA, gameB, options = {}) {
  const schemas = [generateComparisonPageSchema(gameA, gameB)].filter(Boolean);
  const faqs = buildComparisonFaqs(gameA, gameB, options);
  if (faqs.length) schemas.push(generateFAQSchema(faqs));
  return schemas;
}

function buildComparisonFaqs(gameA, gameB) {
  const a = normalizeGameInput(gameA);
  const b = normalizeGameInput(gameB);
  if (!a || !b) return [];

  const faqs = [
    {
      question: `${a.name} mı ${b.name} mi daha kolay?`,
      answer: (() => {
        const rankA = DIFFICULTY_RANK[a.difficulty] || 2;
        const rankB = DIFFICULTY_RANK[b.difficulty] || 2;
        if (rankA < rankB) return `${a.name} (${a.difficulty}) genellikle ${b.name}'den (${b.difficulty}) daha kolay öğrenilir.`;
        if (rankB < rankA) return `${b.name} (${b.difficulty}) genellikle ${a.name}'den (${a.difficulty}) daha kolay öğrenilir.`;
        return `Her iki oyun da ${a.difficulty || b.difficulty || 'benzer'} zorlukta. Kurallar sayfasındaki adım sayısına bakarak karar verebilirsiniz.`;
      })(),
    },
    {
      question: `${a.name} ile ${b.name} arasındaki temel fark nedir?`,
      answer: `${a.name}: ${a.shortDescription || truncateText(a.description, 80)} ${b.name}: ${b.shortDescription || truncateText(b.description, 80)}`,
    },
  ];

  if (a.players || b.players) {
    faqs.push({
      question: `Oyuncu sayısı farkı var mı?`,
      answer: `${a.name} ${a.players || '—'} oynanır, ${b.name} ise ${b.players || '—'}.`,
    });
  }

  return faqs;
}

// ─── Araç sayfaları ────────────────────────────────────────────────────────

export function resolveToolSlugFromUrl(url = '') {
  const match = String(url).match(/\/araclar\/([^/?#]+)/);
  return match?.[1] || null;
}

export function buildToolSeoMeta(toolSlugOrUrl, overrides = {}) {
  const slug = toolSlugOrUrl?.includes('/')
    ? resolveToolSlugFromUrl(toolSlugOrUrl)
    : toolSlugOrUrl;
  const preset = slug ? TOOL_PAGE_SEO[slug] : null;

  return {
    title: overrides.seoTitle || preset?.title || overrides.title,
    description: overrides.seoDescription || preset?.description || overrides.description,
    keywords: preset?.keywords,
    url: overrides.seoUrl || (slug ? `/araclar/${slug}` : ''),
  };
}

export function buildToolStructuredData(toolSlugOrUrl, overrides = {}) {
  const meta = buildToolSeoMeta(toolSlugOrUrl, overrides);
  if (!meta.url || !meta.title) return null;
  return generateWebApplicationSchema({
    name: meta.title.replace(/ - .*$/, ''),
    description: meta.description,
    url: meta.url,
  });
}

// ─── Oyun arşivi / arama ───────────────────────────────────────────────────

export function buildAllGamesSeoMeta(games = [], filters = {}) {
  const { searchQuery, category } = filters;
  const count = games.length;

  if (searchQuery) {
    return {
      title: `"${searchQuery}" Arama Sonuçları`,
      description: `"${searchQuery}" araması için ${count} oyun bulundu. Kurallar, ipuçları ve stratejiler Kuralı Ne?'de.`,
      keywords: `${searchQuery}, ${searchQuery} kuralı ne, ${searchQuery} nasıl oynanır, oyun arama`,
      url: `/oyunlar?search=${encodeURIComponent(searchQuery)}`,
    };
  }

  if (category && category !== 'Tümü') {
    return buildCategorySeoMeta(category, games);
  }

  const topNames = games.slice(0, 4).map((g) => g.name).join(', ');
  return {
    title: `Tüm Oyunlar (${count}) - Oyun Arşivi`,
    description: truncateText(
      `${count} geleneksel Türk oyunu ve kutu oyunu rehberi.${topNames ? ` ${topNames} ve daha fazlası.` : ''} Kurallar, ipuçları, videolar.`,
      160
    ),
    keywords: `tüm oyunlar, oyun arşivi, ${count} oyun, geleneksel oyunlar, okey, batak, pişti, kuralı ne`,
    url: '/oyunlar',
  };
}

// ─── Haberler ──────────────────────────────────────────────────────────────

function normalizeNewsInput(post) {
  if (!post) return null;
  return {
    title: post.title,
    slug: post.slug,
    subtitle: post.subtitle,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage || post.cover_image,
    category: post.category,
    tags: post.tags || [],
    author: post.author,
    seoTitle: post.seoTitle || post.seo_title,
    seoDescription: post.seoDescription || post.seo_description,
    readTimeMinutes: post.readTimeMinutes || post.read_time_minutes,
    viewCount: post.viewCount ?? post.view_count,
    publishedAt: post.publishedAt || post.published_at,
    createdAt: post.createdAt || post.created_at,
    updatedAt: post.updatedAt || post.updated_at,
  };
}

export function buildNewsSeoMeta(post) {
  const p = normalizeNewsInput(post);
  if (!p) return {};

  const seoTitle = p.seoTitle?.trim() || p.title;
  const desc =
    p.seoDescription?.trim() || p.excerpt || truncateText(stripNewsMarkdown(p.content), 160);
  const tagStr = (p.tags || []).slice(0, 8).join(', ');

  return {
    title: seoTitle,
    description: desc,
    keywords: [
      seoTitle,
      p.category,
      'oyun haberleri',
      'oyun çıkış tarihi',
      'oyun fiyatları',
      tagStr,
    ]
      .filter(Boolean)
      .join(', '),
    tags: p.tags || [],
    image: p.coverImage || SITE_CONFIG.defaultImage,
    imageAlt: `${seoTitle} — ${p.category || 'Oyun Haberleri'}`,
    url: `/haberler/${p.slug}`,
    section: p.category,
    author: p.author || SITE_CONFIG.name,
    publishedTime: p.publishedAt || p.createdAt,
    modifiedTime: p.updatedAt || p.publishedAt || p.createdAt,
    readTimeMinutes: p.readTimeMinutes,
  };
}

function stripNewsMarkdown(text) {
  if (!text) return '';
  return String(text)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .trim();
}

export function extractNewsFaqsFromContent(content, title) {
  if (!content?.trim()) return [];
  const faqs = [];
  const blocks = content.split(/\n\n+/);

  blocks.forEach((block) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('### ') && trimmed.includes('?')) {
      const question = trimmed.slice(4).trim();
      const idx = blocks.indexOf(block);
      const next = blocks[idx + 1]?.trim();
      if (next && !next.startsWith('#')) {
        faqs.push({ question, answer: truncateText(next, 300) });
      }
    }
  });

  if (faqs.length === 0 && title) {
    faqs.push({
      question: `${title.replace(/\?+$/, '')}?`,
      answer: truncateText(stripNewsMarkdown(content), 280),
    });
  }

  return faqs.slice(0, 5);
}

export function buildNewsStructuredData(post) {
  const p = normalizeNewsInput(post);
  if (!p) return null;

  const faqs = extractNewsFaqsFromContent(p.content, p.title);
  const wordCount = stripNewsMarkdown(p.content).split(/\s+/).filter(Boolean).length;

  const schemas = [
    generateNewsArticleSchema({
      title: p.seoTitle || p.title,
      slug: p.slug,
      subtitle: p.subtitle,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      category: p.category,
      tags: p.tags,
      author: p.author,
      readTimeMinutes: p.readTimeMinutes,
      wordCount,
      publishedAt: p.publishedAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/haberler/${p.slug}`,
      name: p.seoTitle || p.title,
      description: p.seoDescription || p.excerpt,
      url: `${SITE_CONFIG.url}/haberler/${p.slug}`,
      inLanguage: 'tr-TR',
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
    },
  ];

  if (faqs.length >= 2) {
    schemas.push(generateFAQSchema(faqs));
  }

  return schemas.filter(Boolean);
}

export function buildNewsListSeoMeta(posts = [], filters = {}) {
  const { category, searchTerm } = filters;
  const count = posts.length;
  const term = searchTerm?.trim();

  if (term) {
    return {
      title: `"${term}" Haber Arama Sonuçları`,
      description: `"${term}" araması için ${count} haber bulundu. Oyun dünyasından güncel gelişmeler Kuralı Ne?'de.`,
      keywords: `${term}, oyun haberleri, ${term} haber`,
      url: '/haberler',
    };
  }

  if (category && category !== 'Tümü') {
    return {
      title: `${category} Haberleri`,
      description: `${category} kategorisinde ${count} haber. Çıkış tarihleri, fiyatlar ve oyun dünyasından son gelişmeler.`,
      keywords: `${category}, oyun haberleri, oyun çıkış tarihi, oyun fiyatları`,
      url: '/haberler',
    };
  }

  return {
    title: `Oyun Haberleri (${count})`,
    description: truncateText(
      `${count} oyun haberi: çıkış tarihleri, fiyatlar, indirimler ve oyun dünyasından güncel gelişmeler.`,
      160
    ),
    keywords: 'oyun haberleri, oyun çıkış tarihi, oyun fiyatları, gta, konsol oyunları',
    url: '/haberler',
  };
}

// ─── Admin önizleme & kalite skoru ─────────────────────────────────────────

export function analyzeSeoQuality(game) {
  const g = normalizeGameInput(game);
  if (!g) return { score: 0, issues: [], suggestions: [] };

  const issues = [];
  const suggestions = [];
  let score = 100;

  if (!g.name?.trim()) { issues.push('Oyun adı eksik'); score -= 30; }
  if (!g.slug?.trim()) { issues.push('Slug eksik'); score -= 15; }
  if (!g.shortDescription?.trim()) {
    suggestions.push('Kısa açıklama ekleyin — Google snippet\'inde görünür');
    score -= 15;
  } else if (g.shortDescription.length < 40) {
    suggestions.push('Kısa açıklamayı 40–120 karakter arası genişletin');
    score -= 5;
  }
  if (!g.description?.trim()) {
    suggestions.push('Uzun açıklama ekleyin — Article schema için faydalı');
    score -= 10;
  }
  if (!g.image?.trim()) { issues.push('Kapak görseli yok — OG paylaşımı zayıf'); score -= 15; }
  if (!g.rules?.length || g.rules.every((r) => !r?.trim())) {
    issues.push('Kural listesi boş — HowTo schema üretilemez');
    score -= 20;
  }
  if (!g.players?.trim()) { suggestions.push('Oyuncu sayısı ekleyin — otomatik FAQ üretilir'); score -= 5; }
  if (!g.faq?.length) {
    suggestions.push('En az 2–3 SSS ekleyin — featured snippet şansı artar');
    score -= 8;
  }
  if (!g.playTimeMinutes) { suggestions.push('Oyun süresi (dk) — schema ve FAQ zenginleşir'); score -= 3; }
  if (!g.videoUrl) { suggestions.push('Video URL — VideoObject rich result'); score -= 3; }
  if (g.tips?.length < 2) { suggestions.push('En az 2 ipucu ekleyin'); score -= 3; }

  const meta = buildGameSeoMeta(g);
  if (meta.description?.length > 160) {
    suggestions.push(`Meta açıklama ${meta.description.length} karakter — 160 altında tutuldu (otomatik kısaltma)`);
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    grade: score >= 85 ? 'Mükemmel' : score >= 70 ? 'İyi' : score >= 50 ? 'Orta' : 'Zayıf',
    issues,
    suggestions,
    meta,
    faqCount: buildGameFaqs(g).length,
    schemaTypes: buildGameStructuredData(g).map((s) => s['@type']),
  };
}

/** Admin formData → tam SEO önizleme paketi */
export function previewGameSeo(formData) {
  const game = normalizeGameInput(formData);
  const quality = analyzeSeoQuality(game);
  const faqs = buildGameFaqs(game);

  return {
    ...quality,
    faqs: faqs.slice(0, 6),
    totalFaqCount: faqs.length,
    structuredDataPreview: buildGameStructuredData(game).map((schema) => ({
      type: schema['@type'],
      name: schema.name || schema.headline || schema['@type'],
    })),
  };
}

// ─── Ana sayfa ─────────────────────────────────────────────────────────────

export function buildHomeSeoMeta(games = []) {
  const count = games.length;
  const byViews = [...games].sort((a, b) => (b.views || 0) - (a.views || 0));
  const topNames = byViews.slice(0, 5).map((g) => g.name);

  const description = count > 0
    ? truncateText(
        `${count} geleneksel Türk oyunu rehberi: ${topNames.join(', ')}. Kurallar, ipuçları, videolar ve oyun araçları — Kuralı Ne?'de.`,
        160
      )
    : 'Okey, Batak, Pişti, Saklambaç gibi geleneksel Türk oyunlarının kuralı ne? Detaylı kurallar, ipuçları ve stratejiler tek bir yerde.';

  const keywords = dedupeList([
    'kuralı ne',
    'oyun kuralları',
    'geleneksel türk oyunları',
    ...topNames.flatMap((n) => [`${n} kuralı ne`, `${n} kuralları`]),
    `${count} oyun rehberi`,
  ]).slice(0, 15).join(', ');

  return { description, keywords, gameCount: count, topGameNames: topNames };
}

/** Ana sayfa FAQ — yüklü oyunlardan akıllı seçim */
export function buildHomeFaqs(games = []) {
  const findGame = (pattern) => games.find((g) => pattern.test(g.name));
  const faqs = [];

  const okey = findGame(/okey/i);
  const batak = findGame(/batak/i);
  const pisti = findGame(/pişti|pisti/i);

  if (okey) {
    faqs.push({
      question: `${okey.name} nasıl oynanır?`,
      answer: okey.shortDescription
        ? `${okey.shortDescription} Detaylı kurallar: /oyun/${okey.slug}`
        : `${okey.name} kuralları sitemizde adım adım anlatılmıştır.`,
    });
  } else {
    faqs.push({
      question: 'Okey nasıl oynanır?',
      answer: 'Okey, 4 kişiyle oynanan geleneksel bir Türk masa oyunudur. 106 taş ve 2 sahte okey ile oynanır.',
    });
  }

  if (batak) {
    faqs.push({
      question: `${batak.name} kuralları nelerdir?`,
      answer: batak.shortDescription || `${batak.name} kuralları ve ipuçları sitemizde mevcuttur.`,
    });
  }

  if (pisti) {
    faqs.push({
      question: `${pisti.name} kaç kişiyle oynanır?`,
      answer: pisti.players
        ? `${pisti.name} ${pisti.players} oynanır.`
        : `${pisti.name} genellikle 2–4 kişiyle oynanır.`,
    });
  }

  faqs.push({
    question: 'Sitede kaç oyun var?',
    answer: games.length > 0
      ? `Kuralı Ne?'de şu an ${games.length} oyun rehberi bulunuyor. Yeni oyunlar düzenli ekleniyor.`
      : 'Kuralı Ne? geleneksel Türk oyunları ve popüler kutu oyunları için kapsamlı bir rehberdir.',
  });

  return faqs.slice(0, 5);
}

export { normalizeGameInput };
