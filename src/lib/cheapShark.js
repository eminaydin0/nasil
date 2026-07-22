/** CheapShark API — https://apidocs.cheapshark.com (ücretsiz, anahtar gerekmez, CORS açık) */

const CHEAPSHARK_BASE = 'https://www.cheapshark.com/api/1.0';
const CHEAPSHARK_HOST = 'https://www.cheapshark.com';

/** Öne çıkan mağazalar — filtre çipleri için (storeID CheapShark'a göre) */
export const DEAL_STORES = [
  { id: '', label: 'Tümü' },
  { id: '1', label: 'Steam' },
  { id: '25', label: 'Epic Games' },
  { id: '7', label: 'GOG' },
  { id: '11', label: 'Humble' },
  { id: '8', label: 'Origin' },
];

let storeMapCache = null;

/** storeID → { name, logo } eşlemesi (bir kez çekilir, önbelleğe alınır) */
export async function fetchStoreMap() {
  if (storeMapCache) return storeMapCache;
  try {
    const res = await fetch(`${CHEAPSHARK_BASE}/stores`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`CheapShark stores ${res.status}`);
    const data = await res.json();
    const map = {};
    for (const store of data) {
      map[store.storeID] = {
        name: store.storeName,
        logo: store.images?.logo ? `${CHEAPSHARK_HOST}${store.images.logo}` : null,
      };
    }
    storeMapCache = map;
    return map;
  } catch {
    return {};
  }
}

function dealImage(raw) {
  if (raw.steamAppID) {
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${raw.steamAppID}/header.jpg`;
  }
  return raw.thumb || null;
}

export function normalizeDeal(raw, storeMap = {}) {
  if (!raw?.dealID || !raw?.title) return null;

  const store = storeMap[raw.storeID] || {};
  const steamAppID = raw.steamAppID || null;

  // Steam oyunları doğrudan mağazaya; diğerleri CheapShark redirect üzerinden.
  // (CheapShark /redirect zaman zaman Cloudflare doğrulaması gösterebiliyor.)
  const url = steamAppID
    ? `https://store.steampowered.com/app/${steamAppID}/`
    : `${CHEAPSHARK_HOST}/redirect?dealID=${raw.dealID}`;

  return {
    id: raw.dealID,
    gameId: raw.gameID,
    title: String(raw.title).trim(),
    image: dealImage(raw),
    thumb: raw.thumb || null,
    steamAppID,
    salePrice: Number(raw.salePrice),
    normalPrice: Number(raw.normalPrice),
    savings: Math.round(Number(raw.savings) || 0),
    storeId: raw.storeID,
    storeName: store.name || 'Mağaza',
    storeLogo: store.logo || null,
    steamRatingPercent: raw.steamRatingPercent ? Number(raw.steamRatingPercent) : null,
    steamRatingText: raw.steamRatingText || null,
    metacritic: raw.metacriticScore && raw.metacriticScore !== '0' ? Number(raw.metacriticScore) : null,
    dealRating: raw.dealRating ? Number(raw.dealRating) : null,
    url,
  };
}

/**
 * İndirimleri çeker.
 * @param {object} opts
 * @param {string} opts.storeID  CheapShark mağaza ID (boş = tümü)
 * @param {number} opts.upperPrice  üst fiyat sınırı (USD)
 * @param {number} opts.pageSize
 * @param {string} opts.sortBy  "Deal Rating" | "Savings" | "Price" | "Metacritic"
 */
export async function fetchDeals({
  storeID = '',
  upperPrice = 50,
  pageSize = 48,
  sortBy = 'Deal Rating',
} = {}) {
  const params = new URLSearchParams({
    pageSize: String(pageSize),
    sortBy,
    upperPrice: String(upperPrice),
    onSale: '1',
  });
  if (storeID) params.set('storeID', storeID);

  const [res, storeMap] = await Promise.all([
    fetch(`${CHEAPSHARK_BASE}/deals?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    }),
    fetchStoreMap(),
  ]);

  if (!res.ok) throw new Error(`CheapShark API hatası: ${res.status}`);

  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('CheapShark beklenmeyen yanıt döndü');

  return data.map((raw) => normalizeDeal(raw, storeMap)).filter(Boolean);
}

export function formatUsd(value) {
  if (value == null || Number.isNaN(value)) return '';
  return `$${value.toFixed(2)}`;
}
