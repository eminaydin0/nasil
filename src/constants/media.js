/** Unsplash / Pexels stok adresi — oyuna özel kapak yerine geçmemeli. */
export function isStockImageUrl(url) {
  return /images\.unsplash\.com|images\.pexels\.com/i.test(String(url || ''));
}

/** Kart / kapak görselleri için ortak fallback (logo) */
export const CARD_FALLBACK_IMAGE = '/card-fallback.png';

/** Ölçümde önbelleksiz veya çok büyük kalan görseller. Aynı içerik, kendi alan adımız. */
const LOCAL_BY_NEEDLE = [
  ['Sessiz-Sinema.jpg', '/media/sessiz-sinema.webp'],
  ['El-K', '/media/el-kizartmaca.webp'],
  ['PS30TH_16x9_WALLPAPER', '/media/konsol.webp'],
  ['categories-pc-oyunlari-1785103202949', '/media/pc-oyunlari.webp'],
  ['games-gta-v-1784014199342', '/media/gta-v.webp'],
  ['games-control-resonant-1790259596079', '/media/control-resonant.webp'],
  ['games-saklamba-1783924302127', '/media/saklambac.webp'],
  ['games-monopoly-1767198706585', '/media/cards/monopoly.webp'],
  ['games-counter-strike-2-1784209069007', '/media/cards/counter-strike-2.webp'],
  ['games-genshin-impact-1786694389490', '/media/cards/genshin-impact.webp'],
  ['e-li-batak-1786694116311', '/media/cards/eşli-batak.webp'],
  ['peri-an-okey-1784904552294', '/media/cards/perişan-okey.webp'],
  ['jenga-1786694176726', '/media/cards/jenga.webp'],
  ['k-rebe-1783924537839', '/media/cards/körebe.webp'],
  ['be-ta-1784901418924', '/media/cards/beş-taş.webp'],
  ['games-emin-1784901546403', '/media/cards/emin.webp'],
  ['minecraft-1790324861802', '/media/cards/minecraft.webp'],
  ['mendil-kapmaca-1784901237289', '/media/cards/mendil-kapmaca.webp'],
  ['d-z-okey-1784750299216', '/media/cards/düz-okey.webp'],
  ['istop-1783924814320', '/media/cards/istop.webp'],
  ['yakan-top-1783924998660', '/media/cards/yakan-top.webp'],
  ['games-uzun-e-ek-1784904400478', '/media/cards/uzun-eşek.webp'],
  ['webp-6c867212ecca5721ee306b1237ed8b97', '/media/mobil.webp'],
];

export function displayImage(url) {
  if (!url || typeof url !== 'string') return url;
  for (const [needle, local] of LOCAL_BY_NEEDLE) {
    if (url.includes(needle)) return local;
  }
  return url;
}

/** Kartın görünen boyutu ~200–400px. Uzak adresleri buna göre ister. */
export function cardImage(url, maxWidth = 640) {
  const mapped = displayImage(url);
  if (!mapped || mapped.startsWith('/')) return mapped;
  try {
    const parsed = new URL(mapped);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'images.unsplash.com') {
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('w', String(maxWidth));
      parsed.searchParams.set('q', '70');
      parsed.searchParams.delete('h');
      return parsed.toString();
    }
    if (host === 'images.pexels.com') {
      parsed.searchParams.set('auto', 'compress');
      parsed.searchParams.set('cs', 'tinysrgb');
      parsed.searchParams.set('dpr', '1');
      parsed.searchParams.set('w', String(maxWidth));
      parsed.searchParams.delete('h');
      return parsed.toString();
    }
    if (host === 'i.pinimg.com') {
      parsed.pathname = parsed.pathname.replace(/\/(?:originals|\d+x)\//, '/474x/');
      return parsed.toString();
    }
    if (host === 'i.ytimg.com' && parsed.pathname.includes('maxresdefault')) {
      parsed.pathname = parsed.pathname.replace('maxresdefault', 'sddefault');
      return parsed.toString();
    }
    return mapped;
  } catch {
    return mapped;
  }
}

/**
 * img onError handler — bir kez fallback'e düşer, loop olmaz.
 */
export function handleImageFallback(event, fallback = CARD_FALLBACK_IMAGE) {
  const img = event?.currentTarget || event?.target;
  if (!img || img.dataset.fallbackApplied === '1') return;
  img.dataset.fallbackApplied = '1';
  img.src = fallback;
}
