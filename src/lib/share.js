import { SITE_CONFIG } from '../constants/seo';

const DEFAULT_SITE = SITE_CONFIG.name || 'Kuralı Ne?';

/** Paylaşım metni — WhatsApp / Telegram için okunaklı blok */
export function buildShareMessage({ title, description, url, siteName = DEFAULT_SITE }) {
  const lines = [];

  if (title?.trim()) {
    lines.push(`*${title.trim()}*`);
  }

  const excerpt = description?.trim();
  if (excerpt) {
    lines.push(excerpt.length > 220 ? `${excerpt.slice(0, 217)}…` : excerpt);
  }

  if (url?.trim()) {
    lines.push(`🔗 ${url.trim()}`);
  }

  lines.push(`— ${siteName}`);

  return lines.join('\n\n');
}

export function resolveShareUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_CONFIG.url;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_CONFIG.url}${path}`;
}

export function buildShareLinks({ title, description, url, hashtags = [] }) {
  const fullUrl = resolveShareUrl(url);
  const message = buildShareMessage({ title, description, url: fullUrl });
  const tweetText = hashtags.length
    ? `${title}${description ? ` — ${description.slice(0, 100)}` : ''}`
    : title;

  const hashtagParam = hashtags.filter(Boolean).join(',');

  return {
    url: fullUrl,
    message,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(tweetText)}${hashtagParam ? `&hashtags=${encodeURIComponent(hashtagParam)}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
  };
}

export function openShareWindow(href, { width = 640, height = 520 } = {}) {
  if (!href) return;
  const left = Math.max(0, (window.screen.width - width) / 2);
  const top = Math.max(0, (window.screen.height - height) / 2);
  window.open(
    href,
    '_blank',
    `noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`
  );
}

export async function copyShareLink(url) {
  const fullUrl = resolveShareUrl(url);
  await navigator.clipboard.writeText(fullUrl);
  return fullUrl;
}

export async function nativeShareContent({ title, description, url }) {
  const fullUrl = resolveShareUrl(url);
  if (!navigator.share) return false;

  await navigator.share({
    title: title || DEFAULT_SITE,
    text: description || title,
    url: fullUrl,
  });
  return true;
}

export const SHARE_PLATFORMS = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'x', label: 'X' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'linkedin', label: 'LinkedIn' },
];
