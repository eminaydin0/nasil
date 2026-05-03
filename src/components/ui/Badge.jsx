/**
 * Badge - tek kaynaklı rozet component
 * variants: default | category | difficulty | time | rating | brand | dark | success | info
 */
const VARIANTS = {
  default: 'bg-warm-100 text-warm-700 border border-warm-200',
  category: 'bg-cream-100 text-warm-800 border border-warm-200',
  brand: 'bg-gradient-to-r from-orange-500 to-red-500 text-white border border-transparent shadow-soft',
  dark: 'bg-charcoal-900/90 text-cream-50 border border-charcoal-800/50 backdrop-blur-md',
  rating: 'bg-accent-400 text-charcoal-900 border border-accent-500',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  glass: 'bg-white/90 text-warm-800 border border-white/40 backdrop-blur-md',
};

const SIZES = {
  sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
  md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
  lg: 'text-sm px-3 py-1.5 rounded-lg gap-2',
};

function Badge({ variant = 'default', size = 'md', icon: Icon, className = '', children, ...rest }) {
  const v = VARIANTS[variant] || VARIANTS.default;
  const s = SIZES[size] || SIZES.md;

  return (
    <span className={`inline-flex items-center font-semibold ${v} ${s} ${className}`} {...rest}>
      {Icon && <Icon size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} className="shrink-0" aria-hidden="true" />}
      {children}
    </span>
  );
}

export default Badge;
