import { SITE_CONFIG } from '../constants/seo';

const DEFAULT_SITE_URL = SITE_CONFIG.url.replace(/\/$/, '');

/**
 * Canlı site kök URL — auth e-posta linkleri, paylaşım vb.
 * Öncelik: VITE_SITE_URL → prod'da SITE_CONFIG → dev'de window.origin
 */
export function getSiteUrl() {
  const envUrl = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, '');
  if (envUrl) return envUrl;

  if (import.meta.env.PROD) return DEFAULT_SITE_URL;

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return DEFAULT_SITE_URL;
}

/** Supabase auth e-postalarındaki yönlendirme (dashboard Site URL yerine). */
export function getAuthRedirectUrl(path = '/auth') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}
