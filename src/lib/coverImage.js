import { cardImage, displayImage } from '../constants/media.js';

const SITE = 'https://kuraline.xyz';

export function isUnsplashUrl(url) {
  return /images\.unsplash\.com/i.test(String(url || ''));
}

export function isSharedPexelsUrl(url) {
  return /pexels-photo-1871508/i.test(String(url || ''));
}

/** public/images/games altına konmuş ama dosyası olmayan kapaklar. */
export function isBundledGameImage(url) {
  return /\/images\/games\//i.test(String(url || ''));
}

export function needsGeneratedCover(url) {
  const value = String(url || '').trim();
  if (!value) return true;
  return isUnsplashUrl(value) || isSharedPexelsUrl(value) || isBundledGameImage(value);
}

export function needsWebpReupload(url) {
  return /\.(jfif|avif)(?:$|\?|#)/i.test(String(url || ''));
}

export function generatedCoverPath(game) {
  const params = new URLSearchParams();
  params.set('name', String(game?.name || 'Oyun').trim() || 'Oyun');
  if (game?.category) params.set('category', String(game.category));
  if (game?.players) params.set('players', String(game.players));
  const minutes = game?.playTimeMinutes ?? game?.play_time_minutes;
  if (minutes) params.set('minutes', String(minutes));
  return `/api/og?${params.toString()}`;
}

/** Kart ve sayfa görseli. Özel kapak durur; stok ve eksik dosya üretilen kapağa düşer. */
export function coverSrc(game, maxWidth = 1200) {
  const mapped = displayImage(game?.image);
  if (mapped && !needsGeneratedCover(mapped)) return cardImage(mapped, maxWidth);
  return generatedCoverPath(game || {});
}

export function absoluteCover(game) {
  const src = coverSrc(game);
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE}${src.startsWith('/') ? src : `/${src}`}`;
}
