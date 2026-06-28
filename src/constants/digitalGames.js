/** PC / Konsol / Mobil dijital oyun kategorileri */

export const DIGITAL_GAME_CATEGORIES = [
  'PC Oyunları',
  'Konsol Oyunları',
  'Mobil Oyunlar',
];

export const DIGITAL_PLATFORMS = [
  'PC (Windows)',
  'PC (Mac)',
  'PC (Linux)',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X|S',
  'Xbox One',
  'Nintendo Switch',
  'Android',
  'iOS',
];

export const DOWNLOAD_STORES = [
  'Steam',
  'Epic Games',
  'GOG',
  'Microsoft Store',
  'PlayStation Store',
  'Xbox Store',
  'Nintendo eShop',
  'Google Play',
  'App Store',
  'Resmi site',
  'Diğer',
];

const EMPTY_TIER = {
  os: '',
  cpu: '',
  ram: '',
  gpu: '',
  storage: '',
  notes: '',
};

/** @typedef {{ label: string, url: string }} DigitalDownload */

export function emptyDownload() {
  return { label: '', url: '' };
}

export function emptyDigitalInfo() {
  return {
    platforms: [],
    downloads: [],
    fileSize: '',
    requirements: {
      minimum: { ...EMPTY_TIER },
      recommended: { ...EMPTY_TIER },
    },
  };
}

export function isDigitalGameCategory(category) {
  if (!category) return false;
  return DIGITAL_GAME_CATEGORIES.some(
    (c) => c.toLocaleLowerCase('tr-TR') === String(category).toLocaleLowerCase('tr-TR')
  );
}

function normalizeTier(tier) {
  return {
    os: tier?.os || '',
    cpu: tier?.cpu || '',
    ram: tier?.ram || '',
    gpu: tier?.gpu || '',
    storage: tier?.storage || '',
    notes: tier?.notes || '',
  };
}

function normalizeDownloads(raw) {
  if (Array.isArray(raw?.downloads)) {
    return raw.downloads
      .map((item) => ({
        label: String(item?.label || item?.store || '').trim(),
        url: String(item?.url || item?.downloadUrl || '').trim(),
      }))
      .filter((item) => item.label || item.url);
  }

  const legacyUrl = String(raw?.downloadUrl || raw?.download_url || '').trim();
  const legacyLabel = String(raw?.downloadLabel || raw?.download_label || '').trim();
  if (legacyUrl) {
    return [{ label: legacyLabel || 'Resmi site', url: legacyUrl }];
  }

  return [];
}

export function normalizeDigitalInfo(raw) {
  if (!raw || typeof raw !== 'object') return emptyDigitalInfo();

  return {
    platforms: Array.isArray(raw.platforms) ? raw.platforms.filter(Boolean) : [],
    downloads: normalizeDownloads(raw),
    fileSize: raw.fileSize || raw.file_size || '',
    requirements: {
      minimum: normalizeTier(raw.requirements?.minimum),
      recommended: normalizeTier(raw.requirements?.recommended),
    },
  };
}

export function hasDigitalInfoContent(info) {
  const d = normalizeDigitalInfo(info);
  if (d.downloads.some((item) => item.url?.trim()) || d.fileSize || d.platforms.length) {
    return true;
  }
  const tiers = [d.requirements.minimum, d.requirements.recommended];
  return tiers.some((t) => Object.values(t).some((v) => String(v).trim()));
}

export function cleanDigitalInfoForSave(info) {
  const d = normalizeDigitalInfo(info);
  if (!hasDigitalInfoContent(d)) return null;

  return {
    platforms: d.platforms,
    downloads: d.downloads
      .filter((item) => item.url?.trim())
      .map((item) => ({
        label: item.label?.trim() || 'İndir',
        url: item.url.trim(),
      })),
    fileSize: d.fileSize,
    requirements: d.requirements,
  };
}

/** Aktif indirme kaynakları (URL dolu olanlar) */
export function getActiveDownloads(info) {
  return normalizeDigitalInfo(info).downloads.filter((item) => item.url?.trim());
}
