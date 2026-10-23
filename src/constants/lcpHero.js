/** Ana sayfa kapak görseli. Kendi alan adımızdan gelir; Supabase kuyruğunda beklemez. */
export const LCP_HERO_IMAGE = '/lcp-hero-0.webp';

export function heroImageSrc(url) {
  if (url && url.includes('carousel/lcp-hero-0.webp')) return LCP_HERO_IMAGE;
  return url;
}
