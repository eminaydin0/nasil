/**
 * Araçlar — warm premium görsel dil (cream / warm / brand gradient)
 */

export const tool = {
  /** Dış kart — cam + hafif degrade */
  card:
    'rounded-3xl border border-warm-200/80 bg-gradient-to-b from-white via-cream-50/80 to-cream-100/40 shadow-soft-lg overflow-hidden flex flex-col backdrop-blur-sm',

  cardPadded:
    'rounded-3xl border border-warm-200/80 bg-gradient-to-b from-white via-cream-50/70 to-white shadow-soft-xl h-full flex flex-col p-6 sm:p-8 relative',

  headerRow: 'relative z-10 flex items-center gap-4 mb-8',
  iconWrap:
    'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-400/20 to-red-500/25 ring-1 ring-orange-500/20 shadow-soft',
  iconClass: 'text-orange-600 w-7 h-7',
  title: 'font-display text-xl font-bold tracking-tight text-charcoal-900',

  label: 'mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-warm-500',

  input:
    'w-full rounded-xl border-2 border-warm-200 bg-cream-50 px-4 py-2.5 text-sm text-charcoal-900 transition-all outline-none placeholder:text-warm-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/15',
  textarea:
    'h-44 w-full resize-none rounded-xl border-2 border-warm-200 bg-cream-50 p-4 text-sm text-charcoal-900 outline-none transition-all placeholder:text-warm-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/15',

  primaryBtn:
    'relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-red-600 py-3.5 font-bold text-white shadow-warm-glow transition-all hover:from-orange-600 hover:to-red-700 hover:shadow-warm-glow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
  secondaryBtn:
    'flex items-center justify-center gap-2 rounded-xl bg-warm-100 px-5 py-3 font-semibold text-warm-800 transition-colors hover:bg-warm-200 active:scale-[0.98]',

  panel:
    'max-h-[min(520px,70vh)] overflow-y-auto rounded-2xl border border-warm-200/70 bg-gradient-to-b from-warm-50/90 to-white p-5 shadow-soft',

  tableInput:
    'w-full rounded-xl border-2 border-warm-200 bg-white p-2.5 text-center text-sm font-bold text-charcoal-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20',

  toggleOn:
    'border-2 border-orange-500 bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-soft-md',
  toggleOff:
    'border-2 border-warm-200 bg-warm-50 text-warm-700 hover:border-warm-300 hover:bg-cream-100',

  range: 'h-2 w-full cursor-pointer appearance-none rounded-full bg-warm-200 accent-orange-600',
};
