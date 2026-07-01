import {
  Gamepad2,
  Newspaper,
  Gift,
  Wrench,
  Spade,
  Dice6,
  Package,
  Brain,
  TreePine,
  Home,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { CATEGORIES } from './categories';
import { SITE_TOOLS, groupToolsByCategory } from './tools';

const CATEGORY_ICONS = {
  'Kağıt Oyunları': Spade,
  'Masa Oyunları': Dice6,
  'Kutu Oyunları': Package,
  'Zeka Oyunları': Brain,
  'Dış Mekan': TreePine,
  'İç Mekan': Home,
  'PC Oyunları': Monitor,
  'Konsol Oyunları': Gamepad2,
  'Mobil Oyunlar': Smartphone,
};

function categoryHref(name) {
  return `/kategori/${encodeURIComponent(name)}`;
}

function buildGamesSections() {
  const traditional = CATEGORIES.filter((c) =>
    ['kagit', 'masa', 'kutu', 'zeka', 'dis', 'ic'].includes(c.id)
  );
  const digital = CATEGORIES.filter((c) => ['pc', 'konsol', 'mobil'].includes(c.id));

  return [
    {
      title: 'Geleneksel',
      items: traditional.map((c) => ({
        label: c.name,
        href: categoryHref(c.name),
        icon: CATEGORY_ICONS[c.name] || Gamepad2,
      })),
    },
    {
      title: 'Dijital',
      items: digital.map((c) => ({
        label: c.name,
        href: categoryHref(c.name),
        icon: CATEGORY_ICONS[c.name] || Monitor,
      })),
    },
  ];
}

function buildToolsSections() {
  return groupToolsByCategory(SITE_TOOLS).map((group) => ({
    title: group.label,
    items: group.items.map((tool) => ({
      label: tool.title,
      href: tool.link,
      badge: tool.badge,
      icon: tool.icon || Wrench,
    })),
  }));
}

/** Sadece mega menü gerekenler dropdown; diğerleri direkt link */
export const HEADER_NAV = [
  {
    id: 'oyunlar',
    label: 'Oyunlar',
    href: '/oyunlar',
    icon: Gamepad2,
    mega: true,
    footerLink: { label: 'Tüm oyunları gör', href: '/oyunlar' },
    sections: buildGamesSections(),
  },
  {
    id: 'haberler',
    label: 'Haberler',
    href: '/haberler',
    icon: Newspaper,
  },
  {
    id: 'bedava',
    label: 'Bedava Oyunlar',
    href: '/ucretsiz-oyunlar',
    icon: Gift,
    highlight: true,
  },
  {
    id: 'araclar',
    label: 'Araçlar',
    href: '/araclar',
    icon: Wrench,
    mega: true,
    footerLink: { label: 'Tüm araçlar', href: '/araclar' },
    sections: buildToolsSections(),
  },
  {
    id: 'hakkimizda',
    label: 'Hakkımızda',
    href: '/hakkimizda',
  },
  {
    id: 'iletisim',
    label: 'İletişim',
    href: '/iletisim',
  },
];

export function isHeaderNavActive(pathname, item) {
  switch (item.id) {
    case 'oyunlar':
      return (
        pathname === '/oyunlar' ||
        pathname.startsWith('/oyun/') ||
        pathname.startsWith('/kategori/')
      );
    case 'haberler':
      return pathname === '/haberler' || pathname.startsWith('/haberler/');
    case 'bedava':
      return pathname === '/ucretsiz-oyunlar';
    case 'araclar':
      return pathname === '/araclar' || pathname.startsWith('/araclar/');
    case 'hakkimizda':
      return pathname === '/hakkimizda';
    case 'iletisim':
      return pathname === '/iletisim';
    default:
      return pathname === item.href;
  }
}
