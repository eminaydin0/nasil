/**
 * Title ve description tek kaynak.
 * Helmet, api/prerender.js, scripts/prerender-meta.js ve sitemap burayı kullanır.
 * .ts değil: bu dosyayı Vite derlemeden Node (prerender, sitemap, test) doğrudan import eder.
 */
import { isDigitalGameCategory } from '../constants/digitalGames.js';

export const BRAND = 'Kuralı Ne';
export const TITLE_LIMIT = 60;
export const DESC_MIN = 140;
export const DESC_MAX = 160;

const BRAND_TAIL = ` | ${BRAND}`;

export const TOOL_NAMES = {
  '101-yazboz': '101 Okey Yazboz',
  'okey-sayaci': 'Okey Puan Sayacı',
  'batak-yazboz': 'Batak & King Yazboz',
  'takim-olusturucu': 'Takım Oluşturucu',
  'halisaha-takim-olusturucu': 'Halı Saha Takım Oluşturucu',
  'karar-carki': 'Karar Çarkı',
  'kura-cek': 'Kura Çekme',
  'zar-at': 'Zar At',
  'skor-tablosu': 'Skor Tablosu',
};

function clean(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function hasBrand(title) {
  const lower = clean(title).toLocaleLowerCase('tr-TR');
  return lower.includes('kuralı ne') || lower.includes('kurali ne');
}

/** Markası yazılmış başlığa dokunmaz. Yazılmamışsa `| Kuralı Ne` ekler. */
export function withBrand(title, fallback = BRAND) {
  const value = clean(title);
  if (!value) return fallback;
  if (hasBrand(value)) return value;
  return `${value}${BRAND_TAIL}`;
}

function pickStep(steps) {
  for (const step of steps) {
    if (step && step.length <= TITLE_LIMIT) return step;
  }
  return steps[steps.length - 1] || BRAND;
}

function shrinkName(name, suffix) {
  const budget = TITLE_LIMIT - suffix.length;
  const label = clean(name);
  if (label.length <= budget) return `${label}${suffix}`;
  const cut = label.slice(0, Math.max(1, budget - 1)).trim();
  return `${cut}…${suffix}`;
}

/** Son ünlüye göre mı / mi / mu / mü. */
export function questionParticle(phrase) {
  const vowels = clean(phrase).toLocaleLowerCase('tr-TR').match(/[aeıioöuü]/g);
  const last = vowels ? vowels[vowels.length - 1] : 'e';
  if (last === 'a' || last === 'ı') return 'mı';
  if (last === 'o' || last === 'u') return 'mu';
  if (last === 'ö' || last === 'ü') return 'mü';
  return 'mi';
}

export function gameTitle(game) {
  const name = clean(game?.name);
  if (!name) return `Oyun Rehberi${BRAND_TAIL}`;
  const digital = isDigitalGameCategory(game?.category);
  if (digital) {
    return pickStep([
      `${name} Rehberi: Nasıl Oynanır, İpuçları${BRAND_TAIL}`,
      `${name} Rehberi: Nasıl Oynanır${BRAND_TAIL}`,
      `${name} Rehberi${BRAND_TAIL}`,
      shrinkName(name, ` Rehberi${BRAND_TAIL}`),
    ]);
  }
  return pickStep([
    `${name} Nasıl Oynanır? Kuralları ve Puanlama${BRAND_TAIL}`,
    `${name} Nasıl Oynanır?${BRAND_TAIL}`,
    shrinkName(name, ` Nasıl Oynanır?${BRAND_TAIL}`),
  ]);
}

export function comparisonTitle(gameA, gameB) {
  const a = clean(gameA?.name);
  const b = clean(gameB?.name);
  if (!a || !b) return `Oyun Karşılaştırma${BRAND_TAIL}`;
  const left = `${a} ${questionParticle(a)}`;
  const right = `${b} ${questionParticle(b)}`;
  const question = `${left} ${right}?`;
  return pickStep([
    `${question} Farkları ve Hangisi Daha İyi${BRAND_TAIL}`,
    `${question} Hangisi Daha İyi${BRAND_TAIL}`,
    `${question}${BRAND_TAIL}`,
    shrinkName(question, BRAND_TAIL),
  ]);
}

export function categoryTitle(categoryName) {
  const name = clean(categoryName);
  if (!name) return `Oyun Kategorileri${BRAND_TAIL}`;
  return pickStep([
    `${name} Kuralları ve Rehberleri${BRAND_TAIL}`,
    `${name} Kuralları${BRAND_TAIL}`,
    shrinkName(name, ` Kuralları${BRAND_TAIL}`),
  ]);
}

const TOOL_TITLES = {
  '101-yazboz': '101 Okey Yazboz Online - Ücretsiz Skor Tablosu',
  'okey-sayaci': 'Okey Puan Sayacı Online - Ücretsiz Ceza Takibi',
  'batak-yazboz': 'Batak & King Yazboz Online - Ücretsiz Skor',
  'takim-olusturucu': 'Takım Oluşturucu Online - Ücretsiz Dağıtım',
  'halisaha-takim-olusturucu': 'Halı Saha Takım Oluşturucu - Ücretsiz Diziliş',
  'karar-carki': 'Karar Çarkı Online - Ücretsiz Şans Çarkı',
  'kura-cek': 'Kura Çekme Online - Ücretsiz İsim Çekilişi',
  'zar-at': 'Zar At Online - Ücretsiz Zar Simülatörü',
  'skor-tablosu': 'Skor Tablosu Online - Ücretsiz Puan Takibi',
};

export function toolTitle(nameOrSlug) {
  const preset = TOOL_TITLES[nameOrSlug];
  if (preset) return pickStep([withBrand(preset), shrinkName(preset, BRAND_TAIL)]);
  const name = clean(TOOL_NAMES[nameOrSlug] || nameOrSlug);
  if (!name) return `Oyun Araçları${BRAND_TAIL}`;
  return pickStep([
    `${name} - Ücretsiz Online${BRAND_TAIL}`,
    `${name}${BRAND_TAIL}`,
    shrinkName(name, BRAND_TAIL),
  ]);
}

export function formatPlayTime(minutes) {
  const value = Number(minutes);
  if (!value || value <= 0 || !Number.isFinite(value)) return '';
  if (value < 60) return `${value} dakika`;
  const hours = Math.floor(value / 60);
  const rest = value % 60;
  return rest ? `${hours} saat ${rest} dk` : `${hours} saat`;
}

function asList(value) {
  if (Array.isArray(value)) return value.map((item) => clean(item)).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return asList(parsed);
    } catch {
      return [clean(value)];
    }
  }
  return [];
}

function sentences(text) {
  return clean(text)
    .split(/(?<=[.!?])\s+/)
    .map((part) => clean(part))
    .filter(Boolean);
}

function endSentence(text) {
  const value = clean(text);
  if (!value) return '';
  if (/[.!?…]$/.test(value)) return value;
  return `${value}.`;
}

function playerSentence(players) {
  const value = clean(players);
  if (!value) return '';
  if (/kişi|oyuncu|kişilik/i.test(value)) return `${value} ile oynanır`;
  if (/^\d+\s*\+?$/.test(value) || /^\d+\s*-\s*\d+$/.test(value)) return `${value} kişi ile oynanır`;
  return `${value} ile oynanır`;
}

function mentionsPlayers(text, players) {
  if (!players) return true;
  const lower = text.toLocaleLowerCase('tr-TR');
  const needle = players.toLocaleLowerCase('tr-TR');
  if (lower.includes(needle)) return true;
  const num = players.match(/\d+/);
  return Boolean(num && lower.includes(num[0]) && /kişi|oyuncu|kişilik/.test(lower));
}

export function clampDescription(text, min = DESC_MIN, max = DESC_MAX) {
  const value = clean(text);
  if (value.length <= max) return value;
  const slice = value.slice(0, max + 1);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = (lastSpace >= min ? slice.slice(0, lastSpace) : value.slice(0, max)).trim();
  return cut.replace(/[\s,;:–—-]+$/, '');
}

function normalizeGame(game) {
  return {
    name: clean(game?.name),
    category: clean(game?.category),
    players: clean(game?.players),
    difficulty: clean(game?.difficulty),
    playTimeMinutes: game?.playTimeMinutes ?? game?.play_time_minutes ?? null,
    shortDescription: clean(game?.shortDescription ?? game?.short_description),
    description: clean(game?.description),
    rules: asList(game?.rules),
  };
}

/**
 * 140-160 karakter. İlk cümle oyunun kendi kural özeti;
 * oyuncu sayısı ve süre metinde yoksa eklenir. Uydurma dolgu yok.
 */
export function gameDescription(game) {
  const g = normalizeGame(game);
  const bits = [];
  const seen = new Set();

  const push = (raw) => {
    const sentence = endSentence(raw);
    if (!sentence) return;
    const key = sentence.toLocaleLowerCase('tr-TR');
    if (seen.has(key)) return;
    seen.add(key);
    bits.push(sentence);
  };

  const shortBits = sentences(g.shortDescription);
  push(shortBits[0]);
  if (g.players && !mentionsPlayers(bits.join(' '), g.players)) {
    push(playerSentence(g.players));
  }
  const time = formatPlayTime(g.playTimeMinutes);
  if (time && !/dakika|saat|süre/i.test(bits.join(' '))) {
    push(`Süre yaklaşık ${time}`);
  }
  shortBits.slice(1).forEach(push);
  g.rules.forEach((rule) => push(sentences(rule)[0] || rule));
  sentences(g.description).forEach(push);
  if (g.difficulty) push(`Zorluk: ${g.difficulty}`);

  let text = '';
  for (const bit of bits) {
    const next = text ? `${text} ${bit}` : bit;
    if (next.length <= DESC_MAX) {
      text = next;
      if (text.length >= DESC_MIN) break;
      continue;
    }
    if (text.length >= DESC_MIN) break;
    const room = DESC_MAX - (text ? text.length + 1 : 0);
    if (room > 0) {
      const partial = clampDescription(bit, 1, room);
      if (partial) text = text ? `${text} ${partial}` : partial;
    }
    break;
  }
  return clampDescription(text);
}

function clipSentence(text, max) {
  const sentence = endSentence(sentences(text)[0] || text);
  if (!sentence) return '';
  if (sentence.length <= max) return sentence;
  return clampDescription(sentence, 1, max);
}

export function comparisonDescription(gameA, gameB) {
  const a = normalizeGame(gameA);
  const b = normalizeGame(gameB);
  const player = a.players || b.players
    ? `Oyuncu ${a.players || '—'} / ${b.players || '—'}.`
    : '';
  const timeA = formatPlayTime(a.playTimeMinutes);
  const timeB = formatPlayTime(b.playTimeMinutes);
  const time = timeA || timeB ? `Süre ${timeA || '—'} / ${timeB || '—'}.` : '';
  const tail = [player, time].filter(Boolean).join(' ');
  const room = DESC_MAX - (tail ? tail.length + 1 : 0);
  const half = Math.max(36, Math.floor((room - 1) / 2));
  const left = clipSentence(a.shortDescription || a.description, half);
  const right = clipSentence(b.shortDescription || b.description, half);
  let text = [left, right, tail].filter(Boolean).join(' ');

  const extras = [
    sentences(a.description)[1],
    sentences(b.description)[1],
    a.rules[0],
    b.rules[0],
  ];
  for (const extra of extras) {
    if (text.length >= DESC_MIN) break;
    if (!extra) continue;
    const next = `${text} ${endSentence(extra)}`;
    if (next.length <= DESC_MAX) {
      text = next;
      continue;
    }
    const partial = clampDescription(extra, 1, DESC_MAX - text.length - 1);
    if (partial) text = `${text} ${partial}`;
    break;
  }

  return clampDescription(text);
}

export function categoryDescription(categoryName, games = [], seed = '') {
  const name = clean(categoryName);
  const list = (games || []).filter((game) => clean(game?.name));
  const listed = list.slice(0, 4).map((game) => clean(game.name));
  let text = clean(seed);
  if (!text) {
    text = listed.length ? `${name}: ${listed.join(', ')}.` : `${name} kuralları bu sayfada.`;
  }

  for (const game of list) {
    if (text.length >= DESC_MIN && text.length <= DESC_MAX) break;
    const blurb = sentences(
      game.shortDescription || game.short_description || game.description
    )[0];
    if (!blurb || text.includes(blurb.slice(0, 24))) continue;
    const next = `${text} ${endSentence(blurb)}`;
    if (next.length <= DESC_MAX) {
      text = next;
      continue;
    }
    if (text.length < DESC_MIN) {
      const room = DESC_MAX - text.length - 1;
      const partial = clampDescription(blurb, 1, room);
      if (partial) text = `${text} ${partial}`;
    }
    break;
  }

  return clampDescription(text);
}

export function toolDescription(text) {
  let value = clean(text);
  const notes = ['Hesap açmak gerekmez.', 'Tarayıcıda çalışır.'];
  for (const note of notes) {
    if (value.length >= DESC_MIN) break;
    if (value.length + 1 + note.length <= DESC_MAX) value = `${value} ${note}`;
  }
  return clampDescription(value);
}
