export const TIME_RANGES = [
  { value: '24hours', label: 'Son 24 Saat' },
  { value: '7days', label: 'Son 7 Gün' },
  { value: '30days', label: 'Son 30 Gün' },
  { value: 'all', label: 'Tüm Zamanlar' },
];

export const ANALYTICS_SECTIONS = [
  { id: 'overview', label: 'Genel Bakış' },
  { id: 'daily', label: 'Günlük' },
  { id: 'visitors', label: 'Ziyaretçiler' },
  { id: 'trends', label: 'Trend' },
  { id: 'pages', label: 'Sayfalar' },
  { id: 'games', label: 'Oyunlar' },
  { id: 'searches', label: 'Aramalar' },
  { id: 'insights', label: 'İçgörüler' },
  { id: 'traffic', label: 'Trafik' },
];

export function getTimeRangeLabel(timeRange) {
  switch (timeRange) {
    case '24hours':
      return 'son 24 saat';
    case '7days':
      return 'son 7 gün';
    case '30days':
      return 'son 30 gün';
    case 'all':
      return 'tüm zamanlar';
    default:
      return 'seçili dönem';
  }
}
