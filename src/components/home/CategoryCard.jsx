import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * CategoryCard - renk + ikon karakter sistemi
 * Unsplash ağır görsellerinden vazgeçildi; hızlı, tutarlı ve sıcak.
 * Her kategori için renk teması:
 *   bg: koyu yumuşak gradient zemin
 *   accent: vurgu rengi (kategoriye özel)
 *   icon: ikon glyph rengi
 */
const COLOR_THEMES = {
  red: {
    bg: 'from-rose-50 to-rose-100',
    accent: 'from-rose-500 to-red-600',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600',
    border: 'border-rose-200/60',
    glow: 'group-hover:shadow-rose-200/60',
    text: 'group-hover:text-rose-700',
  },
  orange: {
    bg: 'from-orange-50 to-amber-100',
    accent: 'from-orange-500 to-red-500',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-600',
    border: 'border-orange-200/60',
    glow: 'group-hover:shadow-orange-200/60',
    text: 'group-hover:text-orange-700',
  },
  purple: {
    bg: 'from-violet-50 to-purple-100',
    accent: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
    border: 'border-violet-200/60',
    glow: 'group-hover:shadow-violet-200/60',
    text: 'group-hover:text-violet-700',
  },
  blue: {
    bg: 'from-sky-50 to-blue-100',
    accent: 'from-sky-500 to-blue-600',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-600',
    border: 'border-sky-200/60',
    glow: 'group-hover:shadow-sky-200/60',
    text: 'group-hover:text-sky-700',
  },
  green: {
    bg: 'from-emerald-50 to-teal-100',
    accent: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-200/60',
    glow: 'group-hover:shadow-emerald-200/60',
    text: 'group-hover:text-emerald-700',
  },
  indigo: {
    bg: 'from-indigo-50 to-blue-100',
    accent: 'from-indigo-500 to-blue-600',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-600',
    border: 'border-indigo-200/60',
    glow: 'group-hover:shadow-indigo-200/60',
    text: 'group-hover:text-indigo-700',
  },
  cyan: {
    bg: 'from-cyan-50 to-sky-100',
    accent: 'from-cyan-500 to-sky-600',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-600',
    border: 'border-cyan-200/60',
    glow: 'group-hover:shadow-cyan-200/60',
    text: 'group-hover:text-cyan-700',
  },
  teal: {
    bg: 'from-teal-50 to-emerald-100',
    accent: 'from-teal-500 to-emerald-600',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-600',
    border: 'border-teal-200/60',
    glow: 'group-hover:shadow-teal-200/60',
    text: 'group-hover:text-teal-700',
  },
  fuchsia: {
    bg: 'from-fuchsia-50 to-pink-100',
    accent: 'from-fuchsia-500 to-pink-600',
    iconBg: 'bg-fuchsia-500/10',
    iconColor: 'text-fuchsia-600',
    border: 'border-fuchsia-200/60',
    glow: 'group-hover:shadow-fuchsia-200/60',
    text: 'group-hover:text-fuchsia-700',
  },
  gray: {
    bg: 'from-warm-50 to-warm-100',
    accent: 'from-warm-500 to-warm-700',
    iconBg: 'bg-warm-500/10',
    iconColor: 'text-warm-700',
    border: 'border-warm-200/60',
    glow: 'group-hover:shadow-warm-200/60',
    text: 'group-hover:text-warm-800',
  },
};

function CategoryCard({ category, count, icon: IconComponent, color = 'orange', compact = false }) {
  const theme = COLOR_THEMES[color] || COLOR_THEMES.orange;
  const categoryUrl = encodeURIComponent(category);

  return (
    <Link to={`/kategori/${categoryUrl}`} className="group block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-2xl">
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.bg} border ${theme.border} transition-all duration-500 ease-spring shadow-soft hover:shadow-soft-lg ${theme.glow} hover:-translate-y-0.5 ${
          compact ? 'aspect-[4/5] sm:aspect-[4/3]' : 'aspect-[4/3]'
        }`}
      >
        {/* Glyph dekorasyon - büyük yarı saydam ikon (karakter) */}
        <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500 ease-spring">
          {IconComponent && (
            <IconComponent
              className={`${theme.iconColor} w-40 h-40 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 ease-spring`}
              strokeWidth={1.25}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Üst sağ - parlak aksan */}
        <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${theme.accent} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition-opacity duration-500`} />

        {/* İçerik */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-3.5 sm:p-5">
          <div className="self-start">
            <div className={`inline-flex h-9 w-9 items-center justify-center sm:h-11 sm:w-11 ${theme.iconBg} rounded-xl shadow-soft backdrop-blur-sm transition-all duration-500 ease-spring group-hover:scale-105`}>
              {IconComponent && <IconComponent size={compact ? 18 : 20} className={theme.iconColor} aria-hidden="true" />}
            </div>
          </div>

          <div>
            <h3 className={`mb-0.5 text-base font-extrabold leading-tight tracking-tight text-warm-900 transition-colors duration-300 sm:mb-1 sm:text-lg md:text-xl ${theme.text}`}>
              {category}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-warm-600 sm:text-sm">{count} oyun</span>
              <span className="inline-flex h-7 w-7 translate-x-0 items-center justify-center rounded-full bg-white/70 opacity-100 shadow-soft backdrop-blur-sm transition-all duration-300 ease-spring sm:h-8 sm:w-8 sm:opacity-0 sm:translate-x-3 group-hover:sm:opacity-100 group-hover:sm:translate-x-0">
                <ArrowRight size={14} className={theme.iconColor} aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;
