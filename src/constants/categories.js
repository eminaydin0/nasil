import { TreePine, Home, Dice6, Spade, Package, Brain, Gamepad2, Monitor, Smartphone } from 'lucide-react';

/**
 * Kategori Tanımları - Tek Kaynak (Single Source of Truth)
 *
 * Mantıksal sıralama:
 * 1. Oyun malzemesine göre: Kağıt → Masa → Kutu → Zeka
 * 2. Mekana göre: Dış Mekan → İç Mekan
 */
export const CATEGORIES = [
  {
    id: 'kagit',
    name: 'Kağıt Oyunları',
    description: 'İskambil kağıtlarıyla oynanan klasik ve modern kart oyunları. Okey, Batak, Pişti ve daha fazlası.',
    icon: Spade,
    color: 'red',
    bgColor: 'bg-red-50',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'masa',
    name: 'Masa Oyunları',
    description: 'Masa başında arkadaşlarınızla veya ailenizle oynayabileceğiniz strateji ve şans oyunları. Tavla, Dama ve daha fazlası.',
    icon: Dice6,
    color: 'purple',
    bgColor: 'bg-purple-50',
    image: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'kutu',
    name: 'Kutu Oyunları',
    description: 'Zar, piyon ve kartlarla oynanan eğlenceli kutu oyunları. Kutu içinden çıkan her şey burada.',
    icon: Package,
    color: 'orange',
    bgColor: 'bg-orange-50',
    image: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'zeka',
    name: 'Zeka Oyunları',
    description: 'Zihninizi zorlayacak, düşünme becerilerinizi geliştirecek strateji oyunları. Satranç, Mangala ve daha fazlası.',
    icon: Brain,
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'dis',
    name: 'Dış Mekan',
    description: 'Açık havada, parkta veya bahçede oynayabileceğiniz en eğlenceli oyunlar. Saklambaç, Yakan Top ve daha fazlası.',
    icon: TreePine,
    color: 'green',
    bgColor: 'bg-green-50',
    image: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'ic',
    name: 'İç Mekan',
    description: 'Evde, sınıfta veya kapalı alanlarda oynanabilecek keyifli oyunlar. Sıcak ortamlarda oynanacak oyunlar burada.',
    icon: Home,
    color: 'blue',
    bgColor: 'bg-blue-50',
    image: 'https://images.unsplash.com/photo-1560420025-9a327c4418d4?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 'pc',
    name: 'PC Oyunları',
    description: 'Steam, Epic ve PC platformlarındaki oyunlar. Sistem gereksinimleri, dosya boyutu ve indirme linkleri.',
    icon: Monitor,
    color: 'cyan',
    bgColor: 'bg-cyan-50',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'konsol',
    name: 'Konsol Oyunları',
    description: 'PlayStation, Xbox ve Nintendo oyunları. Platform bilgisi ve mağaza linkleri.',
    icon: Gamepad2,
    color: 'fuchsia',
    bgColor: 'bg-fuchsia-50',
    image: 'https://images.unsplash.com/photo-1486401899862-0fca89898f85?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'mobil',
    name: 'Mobil Oyunlar',
    description: 'Android ve iOS oyunları. App Store / Google Play linkleri ve cihaz gereksinimleri.',
    icon: Smartphone,
    color: 'teal',
    bgColor: 'bg-teal-50',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop',
  },
];

/** Kategori adları listesi - sıralı */
export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

/** Renk → İkon eşlemesi (DB kategorileri için) */
export const COLOR_TO_ICON = {
  red: Spade,
  orange: Package,
  purple: Dice6,
  blue: Home,
  green: TreePine,
  indigo: Brain,
  gray: Gamepad2,
  cyan: Monitor,
  teal: Smartphone,
  fuchsia: Gamepad2,
};

/** Renk → bgColor sınıfı */
const COLOR_TO_BG = {
  red: 'bg-red-50',
  orange: 'bg-orange-50',
  purple: 'bg-purple-50',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  indigo: 'bg-indigo-50',
  gray: 'bg-gray-50',
  cyan: 'bg-cyan-50',
  teal: 'bg-teal-50',
  fuchsia: 'bg-fuchsia-50',
};

/** İsim → config map (geriye uyumluluk için) */
export const categoryConfig = Object.fromEntries(
  CATEGORIES.map((c) => [
    c.name,
    { icon: c.icon, color: c.color, bgColor: c.bgColor, image: c.image },
  ])
);

/** Varsayılan config - bilinmeyen kategoriler için */
const defaultConfig = {
  icon: Gamepad2,
  color: 'gray',
  bgColor: 'bg-gray-50',
  image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop',
};

/**
 * Kategori config'i al (CategoryCard, CategoryPage için)
 * @param {string} categoryName
 * @param {Array} dbCategories - Opsiyonel: DB'den gelen kategoriler
 */
export function getCategoryConfig(categoryName, dbCategories = null) {
  if (dbCategories?.length > 0) {
    const dbCat = dbCategories.find((c) => c.name === categoryName);
    if (dbCat) {
      const v = resolveCategoryVisual({ name: categoryName, color: dbCat.color });
      return {
        icon: v.icon,
        color: v.color,
        bgColor: COLOR_TO_BG[v.color] || 'bg-gray-50',
        image: dbCat.image || dbCat.image_url || categoryConfig[categoryName]?.image || defaultConfig.image,
      };
    }
  }
  return categoryConfig[categoryName] || defaultConfig;
}

/**
 * Kategori açıklaması al
 * @param {string} categoryName
 * @param {Array} dbCategories - Opsiyonel: DB'den gelen kategoriler
 */
export function getCategoryDescription(categoryName, dbCategories = null) {
  if (dbCategories?.length > 0) {
    const dbCat = dbCategories.find((c) => c.name === categoryName);
    if (dbCat?.description) return dbCat.description;
  }
  const cat = CATEGORIES.find((c) => c.name === categoryName);
  return cat?.description || 'Keyifli vakit geçirebileceğiniz oyunlar.';
}

/**
 * Oyun listesine göre gösterilecek kategorileri döndür (sıralı, sadece oyunu olanlar, sadece aktifler)
 * @param {Array} games - Oyun listesi
 * @param {Array} dbCategories - Opsiyonel: DB'den gelen kategoriler [{name, description, image, color, orderIndex, isActive}]
 */
export function getDisplayCategories(games, dbCategories = null) {
  const gameCategories = new Set(games.map((g) => g.category).filter(Boolean));
  const source = dbCategories && dbCategories.length > 0 ? dbCategories : CATEGORIES;
  const withIcon = (c) => {
    const v = resolveCategoryVisual(c);
    const fallbackImage = CANONICAL_BY_NAME[normalizeCategory(c.name)]?.image;
    return { ...c, icon: v.icon, color: v.color, image: c.image || c.image_url || fallbackImage };
  };
  return source
    .filter((c) => gameCategories.has(c.name) && (c.isActive !== false)) // Sadece aktif kategoriler
    .map(withIcon);
}

/** Türkçe locale ile normalize (büyük/küçük harf farkını kaldır) */
const normalizeCategory = (s) => (s || '').toLowerCase('tr-TR').trim();

/** İsim → kanonik kategori (ikon + renk) — DB kategorilerinde doğru görseli garanti eder */
const CANONICAL_BY_NAME = Object.fromEntries(
  CATEGORIES.map((c) => [normalizeCategory(c.name), c])
);

/**
 * Kategorinin ikon ve rengini çöz.
 * Öncelik: DB'de tanımlı ikon → isimden kanonik eşleşme → renkten ikon → varsayılan.
 * Renk de bilinen kategorilerde kanonik (benzersiz) palete sabitlenir.
 */
export function resolveCategoryVisual(cat = {}) {
  const canon = CANONICAL_BY_NAME[normalizeCategory(cat.name)];
  return {
    icon: cat.icon || canon?.icon || COLOR_TO_ICON[cat.color] || Gamepad2,
    color: canon?.color || cat.color || 'gray',
  };
}

/**
 * Oyun listesine göre kategori + oyun sayısı (sadece aktif kategoriler)
 * @param {Array} games - Oyun listesi
 * @param {Array} dbCategories - Opsiyonel: DB'den gelen kategoriler
 */
export function getCategoriesWithCounts(games, dbCategories = null) {
  // Oyun sayıları - büyük/küçük harf duyarsız (zeka oyunları = Zeka Oyunları)
  const countsByNorm = {};
  games.forEach((g) => {
    if (g.category) {
      const key = normalizeCategory(g.category);
      countsByNorm[key] = (countsByNorm[key] || 0) + 1;
    }
  });
  const getCount = (catName) => countsByNorm[normalizeCategory(catName)] ?? 0;

  const source = dbCategories && dbCategories.length > 0 ? dbCategories : CATEGORIES;
  const withIcon = (c) => {
    const v = resolveCategoryVisual(c);
    const fallbackImage = CANONICAL_BY_NAME[normalizeCategory(c.name)]?.image;
    return {
      ...c,
      icon: v.icon,
      color: v.color,
      image: c.image || c.image_url || fallbackImage || null,
      count: getCount(c.name),
    };
  };
  // Aktif kategorileri göster - 0 oyunlu olsa bile (yeni eklenen kategoriler görünsün)
  return source
    .filter((c) => c.isActive !== false)
    .map((c, i) => withIcon({ ...c, orderIndex: c.orderIndex ?? c.order_index ?? i + 1 }))
    .sort((a, b) => (a.orderIndex || 99) - (b.orderIndex || 99));
}
