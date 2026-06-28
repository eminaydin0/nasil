/** Haber içeriği yardımcıları */

const WORDS_PER_MINUTE = 200;

export function stripMarkdown(text) {
  if (!text) return '';
  return String(text)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .trim();
}

export function calculateReadTimeMinutes(content) {
  const plain = stripMarkdown(content);
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function extractHeadings(content) {
  if (!content?.trim()) return [];
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('## ') && !line.startsWith('### '))
    .map((line, index) => {
      const text = line.slice(3).trim();
      const id = `section-${index}-${slugifyHeading(text)}`;
      return { id, text, level: 2 };
    });
}

function slugifyHeading(text) {
  return text
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function formatNewsDate(dateStr, style = 'long') {
  if (!dateStr) return '';
  const opts =
    style === 'short'
      ? { day: 'numeric', month: 'short', year: 'numeric' }
      : { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('tr-TR', opts);
}

export const NEWS_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop';

export const NEWS_CATEGORIES = [
  'Oyun Dünyası',
  'Konsol & PC',
  'Mobil',
  'Fiyat & İndirim',
  'Çıkış Tarihi',
  'E-Spor',
];
