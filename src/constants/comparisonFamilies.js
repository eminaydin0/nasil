import { slugify } from '../utils/slugify.js';

/**
 * Karşılaştırma sayfası yalnızca aynı oyun ailesindeyse indexlenir.
 * Aynı kategorideki alakasız çiftler (Elden Ring vs Valorant) sitemap'e girmez.
 */
export function comparisonFamily(game) {
  const text = slugify(`${game?.name || ''} ${game?.slug || ''}`).replace(/-/g, ' ');

  if (/okey/.test(text)) return 'okey';
  if (/batak/.test(text)) return 'batak';
  if (/pisti|canak|papaz/.test(text)) return 'iskambil';
  if (/satranc|dama/.test(text)) return 'satranc-dama';
  if (/tavla/.test(text)) return 'tavla';
  if (/monopoly/.test(text)) return 'monopoly';
  if (/\buno\b/.test(text)) return 'uno';
  if (/jenga/.test(text)) return 'jenga';
  if (/tabu/.test(text)) return 'tabu';
  if (/saklambac|korebe|istop|yakan-top|yakan top|mendil/.test(text)) return 'sokak';
  return null;
}

export function isSameFamily(gameA, gameB) {
  if (!gameA?.slug || !gameB?.slug || gameA.slug === gameB.slug) return false;
  const familyA = comparisonFamily(gameA);
  const familyB = comparisonFamily(gameB);
  return Boolean(familyA && familyA === familyB);
}
