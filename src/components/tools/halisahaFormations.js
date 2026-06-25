/** Halı saha diziliş pozisyonları — dikey saha, yukarı rakip kale */

export const HALISAHA_PRESETS = {
  5: [
    {
      id: '2-1-1',
      label: '2-1-1',
      desc: 'Dengeli — 2 defans, 1 orta, 1 forvet',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 28, y: 68, role: 'DF' },
        { x: 72, y: 68, role: 'DF' },
        { x: 50, y: 48, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '1-2-1',
      label: '1-2-1',
      desc: 'Orta ağırlıklı — geniş orta saha, tek forvet',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 50, y: 70, role: 'DF' },
        { x: 30, y: 50, role: 'OS' },
        { x: 70, y: 50, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '1-1-2',
      label: '1-1-2',
      desc: 'Hücum — tek defans, çift forvet',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 50, y: 70, role: 'DF' },
        { x: 50, y: 50, role: 'OS' },
        { x: 32, y: 30, role: 'FV' },
        { x: 68, y: 30, role: 'FV' },
      ],
    },
    {
      id: '3-1-0',
      label: '3-1-0',
      desc: 'Defansif — 3 defans, kompakt orta saha',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 22, y: 68, role: 'DF' },
        { x: 50, y: 68, role: 'DF' },
        { x: 78, y: 68, role: 'DF' },
        { x: 50, y: 45, role: 'OS' },
      ],
    },
  ],
  6: [
    {
      id: '2-2-1',
      label: '2-2-1',
      desc: 'Dengeli — klasik halı saha dizilişi',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 25, y: 70, role: 'DF' },
        { x: 75, y: 70, role: 'DF' },
        { x: 35, y: 50, role: 'OS' },
        { x: 65, y: 50, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '2-1-2',
      label: '2-1-2',
      desc: 'Hücum — çift forvet, tek orta saha',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 28, y: 70, role: 'DF' },
        { x: 72, y: 70, role: 'DF' },
        { x: 50, y: 50, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '1-2-2',
      label: '1-2-2',
      desc: 'Ofansif — geniş orta, çift forvet',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 50, y: 72, role: 'DF' },
        { x: 32, y: 52, role: 'OS' },
        { x: 68, y: 52, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '3-1-1',
      label: '3-1-1',
      desc: 'Defansif — üçlü savunma hattı',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 20, y: 70, role: 'DF' },
        { x: 50, y: 70, role: 'DF' },
        { x: 80, y: 70, role: 'DF' },
        { x: 50, y: 48, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '1-3-1',
      label: '1-3-1',
      desc: 'Orta saha baskısı — geniş üçlü orta',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 50, y: 72, role: 'DF' },
        { x: 22, y: 52, role: 'OS' },
        { x: 50, y: 52, role: 'OS' },
        { x: 78, y: 52, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
  ],
  7: [
    {
      id: '3-2-1',
      label: '3-2-1',
      desc: 'Dengeli — sağlam defans, çift orta',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 18, y: 72, role: 'DF' },
        { x: 50, y: 72, role: 'DF' },
        { x: 82, y: 72, role: 'DF' },
        { x: 32, y: 48, role: 'OS' },
        { x: 68, y: 48, role: 'OS' },
        { x: 50, y: 26, role: 'FV' },
      ],
    },
    {
      id: '2-3-1',
      label: '2-3-1',
      desc: 'Orta kontrol — üçlü orta saha',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 28, y: 72, role: 'DF' },
        { x: 72, y: 72, role: 'DF' },
        { x: 22, y: 50, role: 'OS' },
        { x: 50, y: 50, role: 'OS' },
        { x: 78, y: 50, role: 'OS' },
        { x: 50, y: 26, role: 'FV' },
      ],
    },
    {
      id: '2-2-2',
      label: '2-2-2',
      desc: 'Simetrik — çift hat her bölgede',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 28, y: 72, role: 'DF' },
        { x: 72, y: 72, role: 'DF' },
        { x: 32, y: 50, role: 'OS' },
        { x: 68, y: 50, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '3-1-2',
      label: '3-1-2',
      desc: 'Hücum — çift forvet, tek pivot',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 18, y: 72, role: 'DF' },
        { x: 50, y: 72, role: 'DF' },
        { x: 82, y: 72, role: 'DF' },
        { x: 50, y: 50, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '2-1-3',
      label: '2-1-3',
      desc: 'All-out attack — üçlü forvet hattı',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 28, y: 72, role: 'DF' },
        { x: 72, y: 72, role: 'DF' },
        { x: 50, y: 52, role: 'OS' },
        { x: 22, y: 28, role: 'FV' },
        { x: 50, y: 24, role: 'FV' },
        { x: 78, y: 28, role: 'FV' },
      ],
    },
  ],
  8: [
    {
      id: '3-3-1',
      label: '3-3-1',
      desc: 'Dengeli — klasik sekizli saha dizilişi',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 18, y: 74, role: 'DF' },
        { x: 50, y: 74, role: 'DF' },
        { x: 82, y: 74, role: 'DF' },
        { x: 22, y: 52, role: 'OS' },
        { x: 50, y: 52, role: 'OS' },
        { x: 78, y: 52, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '3-2-2',
      label: '3-2-2',
      desc: 'Ofansif — çift forvet, sağlam defans',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 18, y: 74, role: 'DF' },
        { x: 50, y: 74, role: 'DF' },
        { x: 82, y: 74, role: 'DF' },
        { x: 35, y: 52, role: 'OS' },
        { x: 65, y: 52, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '2-3-2',
      label: '2-3-2',
      desc: 'Orta kontrol — geniş orta saha, çift forvet',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 28, y: 74, role: 'DF' },
        { x: 72, y: 74, role: 'DF' },
        { x: 22, y: 52, role: 'OS' },
        { x: 50, y: 52, role: 'OS' },
        { x: 78, y: 52, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '2-2-3',
      label: '2-2-3',
      desc: 'Hücum — üçlü forvet hattı',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 28, y: 74, role: 'DF' },
        { x: 72, y: 74, role: 'DF' },
        { x: 35, y: 54, role: 'OS' },
        { x: 65, y: 54, role: 'OS' },
        { x: 22, y: 28, role: 'FV' },
        { x: 50, y: 24, role: 'FV' },
        { x: 78, y: 28, role: 'FV' },
      ],
    },
    {
      id: '4-2-1',
      label: '4-2-1',
      desc: 'Defansif — dörtlü savunma, kompakt orta',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 15, y: 74, role: 'DF' },
        { x: 38, y: 74, role: 'DF' },
        { x: 62, y: 74, role: 'DF' },
        { x: 85, y: 74, role: 'DF' },
        { x: 35, y: 50, role: 'OS' },
        { x: 65, y: 50, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '3-1-3',
      label: '3-1-3',
      desc: 'All-out attack — tek pivot, üçlü forvet',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 18, y: 74, role: 'DF' },
        { x: 50, y: 74, role: 'DF' },
        { x: 82, y: 74, role: 'DF' },
        { x: 50, y: 54, role: 'OS' },
        { x: 22, y: 28, role: 'FV' },
        { x: 50, y: 24, role: 'FV' },
        { x: 78, y: 28, role: 'FV' },
      ],
    },
  ],
  9: [
    {
      id: '3-3-2',
      label: '3-3-2',
      desc: 'Dengeli — dokuzlu saha klasik diziliş',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 22, y: 76, role: 'DF' },
        { x: 50, y: 76, role: 'DF' },
        { x: 78, y: 76, role: 'DF' },
        { x: 22, y: 54, role: 'OS' },
        { x: 50, y: 54, role: 'OS' },
        { x: 78, y: 54, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '3-2-3',
      label: '3-2-3',
      desc: 'Hücum — üçlü forvet hattı',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 22, y: 76, role: 'DF' },
        { x: 50, y: 76, role: 'DF' },
        { x: 78, y: 76, role: 'DF' },
        { x: 35, y: 54, role: 'OS' },
        { x: 65, y: 54, role: 'OS' },
        { x: 22, y: 28, role: 'FV' },
        { x: 50, y: 26, role: 'FV' },
        { x: 78, y: 28, role: 'FV' },
      ],
    },
    {
      id: '2-3-3',
      label: '2-3-3',
      desc: 'Ofansif — geniş orta, üç forvet',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 35, y: 76, role: 'DF' },
        { x: 65, y: 76, role: 'DF' },
        { x: 22, y: 54, role: 'OS' },
        { x: 50, y: 54, role: 'OS' },
        { x: 78, y: 54, role: 'OS' },
        { x: 22, y: 28, role: 'FV' },
        { x: 50, y: 26, role: 'FV' },
        { x: 78, y: 28, role: 'FV' },
      ],
    },
    {
      id: '4-3-1',
      label: '4-3-1',
      desc: 'Defansif — dörtlü savunma',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 15, y: 76, role: 'DF' },
        { x: 38, y: 76, role: 'DF' },
        { x: 62, y: 76, role: 'DF' },
        { x: 85, y: 76, role: 'DF' },
        { x: 22, y: 54, role: 'OS' },
        { x: 50, y: 54, role: 'OS' },
        { x: 78, y: 54, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '3-4-1',
      label: '3-4-1',
      desc: 'Orta baskı — geniş dörtlü orta',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 22, y: 76, role: 'DF' },
        { x: 50, y: 76, role: 'DF' },
        { x: 78, y: 76, role: 'DF' },
        { x: 15, y: 54, role: 'OS' },
        { x: 38, y: 54, role: 'OS' },
        { x: 62, y: 54, role: 'OS' },
        { x: 85, y: 54, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '4-2-2',
      label: '4-2-2',
      desc: 'Kompakt — çift pivot, çift forvet',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 15, y: 76, role: 'DF' },
        { x: 38, y: 76, role: 'DF' },
        { x: 62, y: 76, role: 'DF' },
        { x: 85, y: 76, role: 'DF' },
        { x: 35, y: 54, role: 'OS' },
        { x: 65, y: 54, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
  ],
  10: [
    {
      id: '3-4-2',
      label: '3-4-2',
      desc: 'Dengeli — onlu saha klasik diziliş',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 22, y: 76, role: 'DF' },
        { x: 50, y: 76, role: 'DF' },
        { x: 78, y: 76, role: 'DF' },
        { x: 15, y: 54, role: 'OS' },
        { x: 38, y: 54, role: 'OS' },
        { x: 62, y: 54, role: 'OS' },
        { x: 85, y: 54, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '4-3-2',
      label: '4-3-2',
      desc: 'Sağlam defans — üçlü orta, çift forvet',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 15, y: 76, role: 'DF' },
        { x: 38, y: 76, role: 'DF' },
        { x: 62, y: 76, role: 'DF' },
        { x: 85, y: 76, role: 'DF' },
        { x: 22, y: 54, role: 'OS' },
        { x: 50, y: 54, role: 'OS' },
        { x: 78, y: 54, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '3-3-3',
      label: '3-3-3',
      desc: 'Simetrik — her hatta üç oyuncu',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 22, y: 76, role: 'DF' },
        { x: 50, y: 76, role: 'DF' },
        { x: 78, y: 76, role: 'DF' },
        { x: 22, y: 54, role: 'OS' },
        { x: 50, y: 54, role: 'OS' },
        { x: 78, y: 54, role: 'OS' },
        { x: 22, y: 28, role: 'FV' },
        { x: 50, y: 26, role: 'FV' },
        { x: 78, y: 28, role: 'FV' },
      ],
    },
    {
      id: '4-4-1',
      label: '4-4-1',
      desc: 'Defansif — kompakt blok, tek forvet',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 15, y: 76, role: 'DF' },
        { x: 38, y: 76, role: 'DF' },
        { x: 62, y: 76, role: 'DF' },
        { x: 85, y: 76, role: 'DF' },
        { x: 15, y: 54, role: 'OS' },
        { x: 38, y: 54, role: 'OS' },
        { x: 62, y: 54, role: 'OS' },
        { x: 85, y: 54, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '2-4-3',
      label: '2-4-3',
      desc: 'All-out attack — geniş orta, üç forvet',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 35, y: 76, role: 'DF' },
        { x: 65, y: 76, role: 'DF' },
        { x: 15, y: 54, role: 'OS' },
        { x: 38, y: 54, role: 'OS' },
        { x: 62, y: 54, role: 'OS' },
        { x: 85, y: 54, role: 'OS' },
        { x: 22, y: 28, role: 'FV' },
        { x: 50, y: 26, role: 'FV' },
        { x: 78, y: 28, role: 'FV' },
      ],
    },
  ],
  11: [
    {
      id: '4-4-2',
      label: '4-4-2',
      desc: 'Klasik — dengeli on birli saha',
      slots: [
        { x: 50, y: 92, role: 'KL' },
        { x: 15, y: 78, role: 'DF' },
        { x: 38, y: 78, role: 'DF' },
        { x: 62, y: 78, role: 'DF' },
        { x: 85, y: 78, role: 'DF' },
        { x: 15, y: 56, role: 'OS' },
        { x: 38, y: 56, role: 'OS' },
        { x: 62, y: 56, role: 'OS' },
        { x: 85, y: 56, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '4-3-3',
      label: '4-3-3',
      desc: 'Modern — geniş forvet hattı',
      slots: [
        { x: 50, y: 92, role: 'KL' },
        { x: 15, y: 78, role: 'DF' },
        { x: 38, y: 78, role: 'DF' },
        { x: 62, y: 78, role: 'DF' },
        { x: 85, y: 78, role: 'DF' },
        { x: 22, y: 56, role: 'OS' },
        { x: 50, y: 56, role: 'OS' },
        { x: 78, y: 56, role: 'OS' },
        { x: 22, y: 28, role: 'FV' },
        { x: 50, y: 26, role: 'FV' },
        { x: 78, y: 28, role: 'FV' },
      ],
    },
    {
      id: '3-5-2',
      label: '3-5-2',
      desc: 'Orta kontrol — beşli orta saha',
      slots: [
        { x: 50, y: 92, role: 'KL' },
        { x: 22, y: 78, role: 'DF' },
        { x: 50, y: 78, role: 'DF' },
        { x: 78, y: 78, role: 'DF' },
        { x: 12, y: 56, role: 'OS' },
        { x: 32, y: 56, role: 'OS' },
        { x: 50, y: 56, role: 'OS' },
        { x: 68, y: 56, role: 'OS' },
        { x: 88, y: 56, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '4-2-3-1',
      label: '4-2-3-1',
      desc: 'Tek forvet — çift pivot, üç on numara',
      slots: [
        { x: 50, y: 92, role: 'KL' },
        { x: 15, y: 78, role: 'DF' },
        { x: 38, y: 78, role: 'DF' },
        { x: 62, y: 78, role: 'DF' },
        { x: 85, y: 78, role: 'DF' },
        { x: 35, y: 62, role: 'OS' },
        { x: 65, y: 62, role: 'OS' },
        { x: 22, y: 42, role: 'OS' },
        { x: 50, y: 40, role: 'OS' },
        { x: 78, y: 42, role: 'OS' },
        { x: 50, y: 26, role: 'FV' },
      ],
    },
    {
      id: '3-4-3',
      label: '3-4-3',
      desc: 'Hücum — kanatlarla baskı',
      slots: [
        { x: 50, y: 92, role: 'KL' },
        { x: 22, y: 78, role: 'DF' },
        { x: 50, y: 78, role: 'DF' },
        { x: 78, y: 78, role: 'DF' },
        { x: 15, y: 56, role: 'OS' },
        { x: 38, y: 56, role: 'OS' },
        { x: 62, y: 56, role: 'OS' },
        { x: 85, y: 56, role: 'OS' },
        { x: 22, y: 28, role: 'FV' },
        { x: 50, y: 26, role: 'FV' },
        { x: 78, y: 28, role: 'FV' },
      ],
    },
    {
      id: '5-3-2',
      label: '5-3-2',
      desc: 'Defansif — beşli savunma hattı',
      slots: [
        { x: 50, y: 92, role: 'KL' },
        { x: 12, y: 78, role: 'DF' },
        { x: 30, y: 78, role: 'DF' },
        { x: 50, y: 78, role: 'DF' },
        { x: 70, y: 78, role: 'DF' },
        { x: 88, y: 78, role: 'DF' },
        { x: 22, y: 54, role: 'OS' },
        { x: 50, y: 54, role: 'OS' },
        { x: 78, y: 54, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
  ],
};

export const HALISAHA_FORMATS = [5, 6, 7, 8, 9, 10, 11];
export const HALISAHA_TACTICS = Object.fromEntries(
  Object.entries(HALISAHA_PRESETS).map(([format, presets]) => [
    format,
    { label: presets[0].label, desc: presets[0].desc },
  ])
);

/** @deprecated — varsayılan preset slotları */
export const HALISAHA_FORMATIONS = Object.fromEntries(
  Object.entries(HALISAHA_PRESETS).map(([format, presets]) => [format, presets[0].slots])
);

export function getPresets(format) {
  return HALISAHA_PRESETS[format] || [];
}

export function getDefaultPresetId(format) {
  return getPresets(format)[0]?.id ?? '';
}

export function getPreset(format, presetId) {
  const presets = getPresets(format);
  return presets.find((p) => p.id === presetId) || presets[0];
}

export function colorToTextContrast(hex) {
  if (!hex) return '#000';
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#1c1917' : '#fff';
}

/** Kaleci forması — takım renginden ayrı */
export const GOALKEEPER_COLOR = '#facc15';

export function getPlayerJerseyColor(player, teamColor) {
  return player.role === 'KL' ? GOALKEEPER_COLOR : teamColor;
}

export function clampPitchPosition(x, y) {
  return {
    x: Math.min(92, Math.max(8, x)),
    y: Math.min(94, Math.max(8, y)),
  };
}

export function applyPresetToPlayers(players, slots) {
  return players.map((player, i) => {
    const slot = slots[i];
    if (!slot) return player;
    return {
      ...player,
      x: slot.x,
      y: slot.y,
      role: slot.role,
      isCaptain: player.isCaptain ?? false,
    };
  });
}

export function createDefaultTeamPlayers(format, teamKey, presetId) {
  const preset = getPreset(format, presetId);
  return preset.slots.map((slot, i) => ({
    id: `${teamKey}-${format}-${i}`,
    name: '',
    x: slot.x,
    y: slot.y,
    role: slot.role,
    isCaptain: false,
  }));
}

export function buildDefaultTeams(format, colorA, colorB, presetId) {
  const id = presetId ?? getDefaultPresetId(format);
  return [
    { label: 'Takım A', color: colorA, players: createDefaultTeamPlayers(format, 'A', id) },
    { label: 'Takım B', color: colorB, players: createDefaultTeamPlayers(format, 'B', id) },
  ];
}
