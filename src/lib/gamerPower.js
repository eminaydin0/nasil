/** GamerPower API — https://www.gamerpower.com/api-read */

const GAMERPOWER_BASE = 'https://www.gamerpower.com/api';

export const GAMERPOWER_FILTERS = {
  all: '',
  pc: 'platform=pc',
  steam: 'platform=steam',
  epic: 'platform=epic-games-store',
  gog: 'platform=gog',
};

export function normalizeGiveaway(raw) {
  if (!raw?.id || !raw?.title) return null;

  const url = raw.open_giveaway_url || raw.open_giveaway || '';
  if (!url) return null;

  return {
    external_id: String(raw.id),
    title: String(raw.title).trim(),
    image: raw.thumbnail || raw.image || null,
    platform: raw.platforms || 'PC',
    worth: raw.worth || 'N/A',
    end_date: raw.end_date || null,
    open_giveaway_url: url,
    giveaway_type: raw.type || 'Game',
    description: raw.description || null,
  };
}

export async function fetchGiveaways(query = '') {
  const qs = query ? `?${query}` : '';
  const res = await fetch(`${GAMERPOWER_BASE}/giveaways${qs}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`GamerPower API hatası: ${res.status}`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('GamerPower beklenmeyen yanıt döndü');
  }

  return data.map(normalizeGiveaway).filter(Boolean);
}

export function formatGiveawayEndDate(endDate) {
  if (!endDate || endDate === 'N/A') return 'Belirtilmemiş';
  const d = new Date(endDate);
  if (Number.isNaN(d.getTime())) return endDate;
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatWorth(worth) {
  if (!worth || worth === 'N/A') return 'Ücretsiz';
  return worth;
}
