/** Eski (harf düşmüş) haber slug → kanonik slug. 301 ve sitemap bunu kullanır. */
export const NEWS_SLUG_REDIRECTS = {
  'playstation-plus-abonelerini-sevindirecek-yeni-kampanya-baslad':
    'playstation-plus-abonelerini-sevindirecek-yeni-kampanya-basladi',
  'steamde-hafta-sonu-indirimi-baslad-yuzlerce-oyunda-buyuk-frsatlar':
    'steamde-hafta-sonu-indirimi-basladi-yuzlerce-oyunda-buyuk-firsatlar',
  'gears-of-war-e-dayin-pc-sistem-gereksinimleri-ackland':
    'gears-of-war-e-dayin-pc-sistem-gereksinimleri-aciklandi',
  'gta-6cikistarihi-bellioldu': 'gta-6-cikis-tarihi-belli-oldu',
};

const CANONICAL_TO_STORED = Object.fromEntries(
  Object.entries(NEWS_SLUG_REDIRECTS).map(([stored, canonical]) => [canonical, stored])
);

export function canonicalNewsSlug(slug) {
  const value = String(slug || '').trim();
  return NEWS_SLUG_REDIRECTS[value] || value;
}

/** Veritabanında hâlâ eski slug duruyorsa yeni adresten ona düşer. */
export function storedNewsSlug(slug) {
  const value = String(slug || '').trim();
  return CANONICAL_TO_STORED[value] || value;
}
