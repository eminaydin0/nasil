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

function CategoryCard({ category, count, icon: IconComponent, color = 'orange' }) {
  const theme = COLOR_THEMES[color] || COLOR_THEMES.orange;
  const categoryUrl = encodeURIComponent(category);

  return (
    <Link to={`/kategori/${categoryUrl}`} className="group block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-2xl">
      <div
        className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br ${theme.bg} border ${theme.border} transition-all duration-500 ease-spring shadow-soft hover:shadow-soft-lg ${theme.glow} hover:-translate-y-0.5`}
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
        <div className="absolute inset-0 z-10 p-5 flex flex-col justify-between">
          {/* İkon kapsülü */}
          <div className="self-start">
            <div className={`inline-flex items-center justify-center w-11 h-11 ${theme.iconBg} backdrop-blur-sm rounded-xl shadow-soft transition-all duration-500 ease-spring group-hover:scale-105`}>
              {IconComponent && <IconComponent size={20} className={theme.iconColor} aria-hidden="true" />}
            </div>
          </div>

          {/* Başlık + sayı */}
          <div>
            <h3 className={`text-lg md:text-xl font-extrabold text-warm-900 mb-1 leading-tight tracking-tight transition-colors duration-300 ${theme.text}`}>
              {category}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-600 font-medium">{count} oyun</span>
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm shadow-soft opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-spring`}>
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
