/**
 * Ortak araç arayüzü — site turuncu vurgusu, tutarlı kart ve form stilleri.
 */

export const tool = {
  /** Dış kart (GameTableContainer ile aynı dil) */
  card: 'bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden flex flex-col',

  /** Başlıksız tam yükseklik kart (Takım / Halısaha vb.) */
  cardPadded: 'bg-white rounded-2xl shadow-sm border border-orange-100 h-full flex flex-col p-6',

  /** Üst başlık satırı: ikon + başlık */
  headerRow: 'flex items-center gap-3 mb-6',
  iconWrap: 'p-3 bg-orange-50 rounded-xl shrink-0',
  iconClass: 'text-orange-600 w-6 h-6',
  title: 'text-xl font-bold text-gray-900',

  label: 'block text-sm font-medium text-gray-700 mb-2',

  input:
    'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/25 focus:border-orange-400 outline-none transition-shadow',
  textarea:
    'w-full h-40 p-3 text-sm border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-400 outline-none',

  primaryBtn:
    'w-full py-3 bg-orange-600 text-white rounded-xl font-bold shadow-sm shadow-orange-900/10 hover:bg-orange-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60',
  secondaryBtn:
    'py-3 px-4 bg-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2',

  /** İçerik paneli (sağ sütun, boş durum alanı) */
  panel: 'bg-gray-50 rounded-xl p-4 border border-orange-50 overflow-y-auto',

  /** Tablo hücresi sayı girişi */
  tableInput:
    'w-full p-2 text-center border border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 bg-white',

  /** Seçili / seçili değil toggle */
  toggleOn: 'border-orange-500 bg-orange-50 text-orange-800',
  toggleOff: 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300',

  /** Range slider */
  range: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600',
};
