/** Kart / kapak görselleri için ortak fallback (logo) */
export const CARD_FALLBACK_IMAGE = '/card-fallback.png';

/**
 * img onError handler — bir kez fallback'e düşer, loop olmaz.
 */
export function handleImageFallback(event, fallback = CARD_FALLBACK_IMAGE) {
  const img = event?.currentTarget || event?.target;
  if (!img || img.dataset.fallbackApplied === '1') return;
  img.dataset.fallbackApplied = '1';
  img.src = fallback;
}
