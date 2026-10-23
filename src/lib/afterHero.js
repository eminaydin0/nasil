import { LCP_HERO_IMAGE } from '../constants/lcpHero';

let pending = null;

/** Kapak görseli inene kadar istatistik ve alt bölüm isteklerini bekletir. */
export function afterHeroImage() {
  if (pending) return pending;
  pending = new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const timer = window.setTimeout(finish, 2200);
    const img = new Image();
    img.onload = () => {
      window.clearTimeout(timer);
      finish();
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      finish();
    };
    img.src = LCP_HERO_IMAGE;
    if (img.complete && img.naturalWidth) {
      window.clearTimeout(timer);
      finish();
    }
  });
  return pending;
}