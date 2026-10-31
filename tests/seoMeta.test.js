import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BRAND,
  DESC_MAX,
  DESC_MIN,
  TITLE_LIMIT,
  TOOL_NAMES,
  categoryTitle,
  comparisonDescription,
  comparisonTitle,
  gameDescription,
  gameTitle,
  questionParticle,
  toolDescription,
  toolTitle,
} from '../src/lib/seoMeta.js';
import { generateComparisonPairs, isPublishableGame } from '../src/constants/sitemapRoutes.js';
import { buildCategorySeoMeta } from '../src/lib/seoEngine.js';
import { TOOL_PAGE_SEO } from '../src/constants/seoKeywords.js';
import { TOOL_LANDING } from '../src/constants/toolLandingCopy.js';
import { supabase } from '../scripts/supabase-build.js';

function assertTitle(title, label) {
  assert.ok(title.length <= TITLE_LIMIT, `${label} ${title.length}: ${title}`);
  assert.ok(title.endsWith(`| ${BRAND}`), `${label} markasız: ${title}`);
}

function assertDescription(description, label) {
  assert.ok(
    description.length >= DESC_MIN && description.length <= DESC_MAX,
    `${label} ${description.length}: ${description}`
  );
}

test('masa oyunu tam şablonu kullanır', () => {
  const title = gameTitle({ name: '101 Okey', category: 'Masa Oyunları' });
  assert.equal(title, '101 Okey Nasıl Oynanır? Kuralları ve Puanlama | Kuralı Ne');
  assertTitle(title, '101');
});

test('dijital oyun rehber şablonunu kullanır', () => {
  const title = gameTitle({ name: 'Valorant', category: 'PC Oyunları' });
  assert.equal(title, 'Valorant Rehberi: Nasıl Oynanır, İpuçları | Kuralı Ne');
  assertTitle(title, 'Valorant');
});

test('uzun dijital ad kademeli kısalır, marka kalır', () => {
  const title = gameTitle({
    name: 'The Legend of Zelda: Tears of the Kingdom',
    category: 'Konsol Oyunları',
  });
  assertTitle(title, 'Zelda');
  assert.equal(title.includes('İpuçları'), false);
});

test('soru eki ünlü uyumuna bakar', () => {
  assert.equal(questionParticle('101 Okey'), 'mi');
  assert.equal(questionParticle('Batak'), 'mı');
  assert.equal(questionParticle('Satranç'), 'mı');
  assert.equal(questionParticle('Pişti'), 'mi');
  assert.equal(questionParticle('UNO'), 'mu');
});

test('karşılaştırma, kategori ve araç başlıkları 60 karakteri geçmez', () => {
  const pairs = [
    [{ name: '101 Okey' }, { name: '51 Okey' }],
    [{ name: 'Gömmeli Batak' }, { name: 'İhalesiz Batak' }],
    [{ name: 'Satranç' }, { name: 'Dama' }],
  ];
  for (const [a, b] of pairs) {
    assertTitle(comparisonTitle(a, b), `${a.name} ${b.name}`);
  }
  assertTitle(categoryTitle('Kağıt Oyunları'), 'kategori');
  assertTitle(categoryTitle('İç Mekan / Dış Mekan'), 'uzun kategori');
  for (const [slug, name] of Object.entries(TOOL_NAMES)) {
    assertTitle(toolTitle(slug), name);
    assert.match(toolTitle(slug), new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.equal(
    toolTitle('101-yazboz'),
    '101 Okey Yazboz Online - Ücretsiz Skor Tablosu | Kuralı Ne'
  );
});

test('araç kullanım metni 200-300 kelime', () => {
  for (const [slug, data] of Object.entries(TOOL_LANDING)) {
    const words = [...data.paragraphs, ...data.steps].join(' ').split(/\s+/).filter(Boolean);
    assert.ok(
      words.length >= 200 && words.length <= 300,
      `${slug} ${words.length} kelime`
    );
    assert.ok(data.faqs?.length >= 3, `${slug} SSS eksik`);
    assert.ok(data.related?.some((item) => item.to.startsWith('/oyun/')), `${slug} oyun rehberi yok`);
  }
});

test('açıklama kural cümlesini ve oyuncu sayısını taşır', () => {
  const description = gameDescription({
    name: 'Bilye',
    category: 'Geleneksel Oyunlar',
    players: '2+ kişi',
    difficulty: 'Kolay',
    shortDescription: 'Nişan alma ve bilye oyunu.',
    rules: ['Çukurun dibine en yakın bilyeyi atan eli alır.'],
    description: 'Her oyuncu aynı sayıda bilyeyle başlar. Çukura düşen bilye el değiştirir.',
  });
  assertDescription(description, 'Bilye');
  assert.match(description, /Nişan alma/);
  assert.match(description, /2\+ kişi/);
});

test('araç açıklamaları 140-160 aralığında', () => {
  for (const [slug, preset] of Object.entries(TOOL_PAGE_SEO)) {
    const description = toolDescription(preset.description);
    assertDescription(description, slug);
  }
});

test('yayındaki oyunlarda başlık ve açıklama çakışmaz', async () => {
  const { data, error } = await supabase
    .from('games')
    .select('slug, name, category, players, difficulty, play_time_minutes, short_description, description, rules');

  if (error || !data?.length) {
    throw new Error(error?.message || 'Oyun listesi alınamadı');
  }

  const games = data.filter(isPublishableGame);
  const titles = new Map();
  const descriptions = new Map();
  const problems = [];

  for (const game of games) {
    const title = gameTitle(game);
    const description = gameDescription(game);
    if (title.length > TITLE_LIMIT || !title.endsWith(`| ${BRAND}`)) {
      problems.push(`başlık: ${game.slug} (${title.length}) ${title}`);
    }
    if (description.length < DESC_MIN || description.length > DESC_MAX) {
      problems.push(`açıklama: ${game.slug} (${description.length}) ${description}`);
    }
    if (titles.has(title)) problems.push(`aynı başlık: ${titles.get(title)} = ${game.slug} → ${title}`);
    else titles.set(title, game.slug);
    if (descriptions.has(description)) {
      problems.push(`aynı açıklama: ${descriptions.get(description)} = ${game.slug}`);
    } else descriptions.set(description, game.slug);
  }

  const pairDescriptions = new Map();
  for (const { gameA, gameB } of generateComparisonPairs(games)) {
    const title = comparisonTitle(gameA, gameB);
    const description = comparisonDescription(gameA, gameB);
    const key = `${gameA.slug}|${gameB.slug}`;
    if (title.length > TITLE_LIMIT || !title.endsWith(`| ${BRAND}`)) {
      problems.push(`karşılaştırma başlık: ${key} (${title.length}) ${title}`);
    }
    if (description.length < DESC_MIN || description.length > DESC_MAX) {
      problems.push(`karşılaştırma açıklama: ${key} (${description.length}) ${description}`);
    }
    if (pairDescriptions.has(description)) {
      problems.push(`aynı karşılaştırma açıklaması: ${pairDescriptions.get(description)} = ${key}`);
    } else pairDescriptions.set(description, key);
  }

  const categoryNames = [...new Set(games.map((game) => game.category).filter(Boolean))];
  const categoryTitles = new Map();
  for (const name of categoryNames) {
    const title = categoryTitle(name);
    const inCategory = games.filter((game) => game.category === name);
    const description = buildCategorySeoMeta(name, inCategory).description;
    if (title.length > TITLE_LIMIT) problems.push(`kategori başlık: ${name} (${title.length})`);
    if (description.length < DESC_MIN || description.length > DESC_MAX) {
      problems.push(`kategori açıklama: ${name} (${description.length}) ${description}`);
    }
    if (categoryTitles.has(title)) problems.push(`aynı kategori başlığı: ${name}`);
    categoryTitles.set(title, name);
  }

  assert.equal(problems.length, 0, problems.join('\n'));
});
