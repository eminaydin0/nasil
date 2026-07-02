import {
  Dices,
  Trophy,
  PencilLine,
  Users,
  Grid3X3,
  CircleDot,
  Shuffle,
} from 'lucide-react';

export const TOOL_CATEGORY_LABELS = {
  scoreboard: 'Yazboz & Sayaç',
  team: 'Takım Kurma',
  utility: 'Yardımcı Araçlar',
};

export const SITE_TOOLS = [
  {
    id: '101-yazboz',
    title: '101 Okey Yazboz',
    description: 'Yüzbir oyunu için ceza puanları, el geçmişi ve otomatik toplamlar.',
    icon: Grid3X3,
    link: '/araclar/101-yazboz',
    badge: 'Yeni',
    color: 'orange',
    category: 'scoreboard',
  },
  {
    id: 'okey-sayaci',
    title: 'Okey Puan Sayacı',
    description: 'Düşmeli okeyde ceza puanlarını kaybetmeyin. Normal ve okey çift bitiş seçenekleri.',
    icon: Trophy,
    link: '/araclar/okey-sayaci',
    color: 'red',
    category: 'scoreboard',
  },
  {
    id: 'batak-yazboz',
    title: 'Batak & King Yazboz',
    description: 'İhaleli batak veya king için tur bazlı yazboz. Toplamlar otomatik hesaplanır.',
    icon: PencilLine,
    link: '/araclar/batak-yazboz',
    color: 'amber',
    category: 'scoreboard',
  },
  {
    id: 'takim-olusturucu',
    title: 'Takım Oluşturucu',
    description: 'İsimleri yazın — takımlar adil şekilde rastgele dağılsın.',
    icon: Users,
    link: '/araclar/takim-olusturucu',
    color: 'rose',
    category: 'team',
  },
  {
    id: 'halisaha-takim-olusturucu',
    title: 'Halısaha Takım Oluşturucu',
    description: '5v5–11v11 hazır taktiklerle diziliş kurun, PNG indirin.',
    icon: Users,
    link: '/araclar/halisaha-takim-olusturucu',
    badge: 'Popüler',
    color: 'emerald',
    category: 'team',
    featured: true,
  },
  {
    id: 'karar-carki',
    title: 'Karar Çarkı',
    description: 'Seçenekleri yaz, çevir — kura ve karar için renkli şans çarkı.',
    icon: CircleDot,
    link: '/araclar/karar-carki',
    badge: 'Yeni',
    color: 'violet',
    category: 'utility',
  },
  {
    id: 'kura-cek',
    title: 'Kura Çekme',
    description: 'İsimleri ekle, kutudan rastgele kazananı seç.',
    icon: Shuffle,
    link: '/araclar/kura-cek',
    badge: 'Yeni',
    color: 'fuchsia',
    category: 'utility',
  },
  {
    id: 'zar-at',
    title: 'Zar At',
    description: 'Tek veya çift zar, animasyonlu atışlar ve sonuç geçmişi.',
    icon: Dices,
    link: '/araclar/zar-at',
    color: 'sky',
    category: 'utility',
  },
  {
    id: 'skor-tablosu',
    title: 'Basit Skor Tablosu',
    description: 'Her oyuna uyumlu nötr tablo; isimleri düzenleyin, sıralama güncellensin.',
    icon: Trophy,
    link: '/araclar/skor-tablosu',
    color: 'indigo',
    category: 'utility',
  },
];

export const TOOL_FEATURES = [
  { label: 'Tamamen ücretsiz' },
  { label: 'Kayıt gerektirmez' },
  { label: 'Mobil uyumlu' },
  { label: 'Anında açılır' },
];

export const TOOL_HIGHLIGHTS = [
  { label: '9 araç', sub: 'Masa başı ihtiyaçları' },
  { label: 'Ücretsiz', sub: 'Reklamsız kullanım' },
  { label: 'Mobil', sub: 'Telefonda da rahat' },
  { label: 'Hızlı', sub: 'Kurulum yok' },
];

export function groupToolsByCategory(tools = SITE_TOOLS) {
  const order = ['scoreboard', 'team', 'utility'];
  return order
    .map((key) => ({
      key,
      label: TOOL_CATEGORY_LABELS[key],
      items: tools.filter((t) => t.category === key),
    }))
    .filter((g) => g.items.length > 0);
}

export function getFeaturedTool(tools = SITE_TOOLS) {
  return tools.find((t) => t.featured) || null;
}

export function getHomeTools(tools = SITE_TOOLS) {
  const ids = [
    'halisaha-takim-olusturucu',
    'karar-carki',
    'kura-cek',
    '101-yazboz',
    'okey-sayaci',
    'zar-at',
  ];
  return ids.map((id) => tools.find((t) => t.id === id)).filter(Boolean);
}

export function getRelatedTools(currentLink, limit = 4) {
  return SITE_TOOLS.filter((t) => t.link !== currentLink).slice(0, limit);
}
