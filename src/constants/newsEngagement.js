/** Haber emoji reaksiyon seçenekleri */

export const NEWS_REACTIONS = [
  { emoji: '👍', label: 'Beğen' },
  { emoji: '🔥', label: 'Harika' },
  { emoji: '😂', label: 'Komik' },
  { emoji: '😮', label: 'Şaşırtıcı' },
  { emoji: '❤️', label: 'Bayıldım' },
  { emoji: '🎮', label: 'Oyun' },
];

export const NEWS_COMMENT_MIN_LENGTH = 3;
export const NEWS_COMMENT_MAX_LENGTH = 800;

export function getNewsVisitorKey(userId) {
  if (userId) return `user:${userId}`;
  if (typeof window === 'undefined') return 'guest:unknown';

  let id = localStorage.getItem('news_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('news_visitor_id', id);
  }
  return `guest:${id}`;
}

export function aggregateReactionCounts(rows) {
  const counts = Object.fromEntries(NEWS_REACTIONS.map((r) => [r.emoji, 0]));
  (rows || []).forEach((row) => {
    if (row?.emoji && counts[row.emoji] != null) {
      counts[row.emoji] += 1;
    }
  });
  return counts;
}
