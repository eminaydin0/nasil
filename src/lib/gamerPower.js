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

/** "PC, Steam, Epic Games Store" → kısa etiket listesi */
export function parseGiveawayPlatforms(platformStr) {
  if (!platformStr?.trim()) return ['PC'];
  return platformStr
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 4);
}

/** Bitiş için kısa geri sayım metni */
export function formatGiveawayCountdown(endDate) {
  if (!endDate || endDate === 'N/A') {
    return { label: 'Süre belirtilmemiş', urgent: false };
  }

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return { label: 'Süre belirtilmemiş', urgent: false };
  }

  const diffMs = end.getTime() - Date.now();
  if (diffMs <= 0) {
    return { label: 'Süresi dolmuş olabilir', urgent: true };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days >= 2) {
    return { label: `${days} gün kaldı`, urgent: false };
  }
  if (days === 1) {
    return { label: 'Yarın bitiyor', urgent: true };
  }
  if (hours >= 1) {
    return { label: `${hours} saat kaldı`, urgent: true };
  }

  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  return { label: `${minutes} dk kaldı`, urgent: true };
}
