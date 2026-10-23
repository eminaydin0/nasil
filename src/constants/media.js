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
];

export function displayImage(url) {
  if (!url || typeof url !== 'string') return url;
  for (const [needle, local] of LOCAL_BY_NEEDLE) {
    if (url.includes(needle)) return local;
  }
  return url;
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
