/**
 * Google Analytics 4 (GA4) — çerez onayı sonrası yüklenir.
 * Measurement ID: VITE_GA_MEASUREMENT_ID (örn. G-XXXXXXXXXX)
 */

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || '';
const GA_ID_PATTERN = /^G-[A-Z0-9]+$/i;

let scriptRequested = false;
let configDone = false;
let warnedInvalidId = false;

export const isGoogleAnalyticsConfigured = () =>
  Boolean(MEASUREMENT_ID) && GA_ID_PATTERN.test(MEASUREMENT_ID);

function warnInvalidMeasurementId() {
  if (warnedInvalidId || !MEASUREMENT_ID || typeof window === 'undefined') return;
  if (GA_ID_PATTERN.test(MEASUREMENT_ID)) return;
  warnedInvalidId = true;
  console.warn(
    '[Analytics] VITE_GA_MEASUREMENT_ID geçersiz. GA4 Measurement ID "G-XXXXXXXXXX" formatında olmalı. ' +
      'API key veya Gemini key buraya yazılmaz.'
  );
}

export const isGoogleAnalyticsReady = () =>
  typeof window !== 'undefined' && configDone && typeof window.gtag === 'function';

function ensureGtagStub() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

/** Consent Mode — script yüklenmeden önce varsayılan: reddedildi */
export function setGoogleAnalyticsConsentGranted() {
  if (!isGoogleAnalyticsConfigured()) return;
  ensureGtagStub();
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
  });
}

export function setGoogleAnalyticsConsentDenied() {
  if (typeof window === 'undefined') return;
  ensureGtagStub();
  window.gtag('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

/** Çerez onayı verildikten sonra bir kez çağrılır */
export function initGoogleAnalytics() {
  warnInvalidMeasurementId();
  if (!isGoogleAnalyticsConfigured() || scriptRequested || typeof window === 'undefined') return;
  scriptRequested = true;

  ensureGtagStub();

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.onload = () => {
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      send_page_view: false,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    configDone = true;
    setGoogleAnalyticsConsentGranted();
  };
  document.head.appendChild(script);
}

export function trackGooglePageView(pagePath, pageTitle = document.title) {
  if (!isGoogleAnalyticsReady()) return;
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: `${window.location.origin}${pagePath}`,
  });
}

export function trackGoogleEvent(eventName, params = {}) {
  if (!isGoogleAnalyticsReady()) return;
  window.gtag('event', eventName, params);
}

/** Supabase event_type → GA4 önerilen / özel event eşlemesi */
export function mirrorSupabaseEventToGoogle(eventType, eventData = {}, gameId = null) {
  if (!isGoogleAnalyticsReady()) return;

  switch (eventType) {
    case 'page_view':
      trackGooglePageView(eventData.page || window.location.pathname);
      break;
    case 'game_view':
      trackGoogleEvent('view_item', {
        item_id: gameId ? String(gameId) : undefined,
        item_name: eventData.game_name,
        content_type: 'game',
      });
      break;
    case 'search':
      trackGoogleEvent('search', {
        search_term: eventData.search_term,
      });
      break;
    case 'share_click':
      trackGoogleEvent('share', {
        method: eventData.platform,
        content_type: 'game',
        item_id: gameId ? String(gameId) : undefined,
        item_name: eventData.game_name,
      });
      break;
    case 'comment_submit':
      trackGoogleEvent('comment_submit', {
        item_id: gameId ? String(gameId) : undefined,
        item_name: eventData.game_name,
        rating: eventData.rating ?? undefined,
      });
      break;
    case 'news_view':
      trackGoogleEvent('view_item', {
        item_id: gameId ? String(gameId) : undefined,
        item_name: eventData.news_title,
        content_type: 'news',
        item_category: eventData.category,
      });
      break;
    case 'news_reaction':
    case 'news_comment':
      trackGoogleEvent(eventType, {
        item_id: gameId ? String(gameId) : undefined,
        item_name: eventData.news_title,
        emoji: eventData.emoji,
      });
      break;
    default:
      trackGoogleEvent(eventType, {
        ...eventData,
        game_id: gameId ?? undefined,
      });
      break;
  }
}

export const getGoogleAnalyticsMeasurementId = () => MEASUREMENT_ID;
