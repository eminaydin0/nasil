import { slugify } from './slugify.js';

/** Kategori adı → /kategori/{slug} segmenti. */
export function categoryToSlug(name) {
  return slugify(name);
}

export function categoryPath(name) {
  const slug = categoryToSlug(name);
  return slug ? `/kategori/${slug}` : '/oyunlar';
}

/**
 * URL parçası eski ad ("Kağıt Oyunları") ya da yeni slug ("kagit-oyunlari") olabilir.
 * Eşleşen kategori adını döndürür.
 */
export function resolveCategoryName(param, names = []) {
  const decoded = decodeURIComponent(String(param || '')).trim();
  if (!decoded) return null;
  const list = names.filter(Boolean);
  const exact = list.find((name) => name === decoded);
  const bySlug = list.find((name) => categoryToSlug(name) === decoded);
  const byLoose = list.find((name) => categoryToSlug(name) === categoryToSlug(decoded));
  return bySlug || exact || byLoose || null;
}
