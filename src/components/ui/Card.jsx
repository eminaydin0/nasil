/**
 * Card - tek kaynaklı kart primitive
 * variants: default | elevated | flat | warm | dark | glass
 */
const VARIANTS = {
  default: 'bg-white border border-warm-200/70 shadow-soft hover:shadow-soft-lg',
  elevated: 'bg-white border border-warm-100 shadow-soft-md hover:shadow-soft-xl',
  flat: 'bg-white border border-warm-100',
  warm: 'bg-cream-100 border border-cream-300/70 shadow-soft',
  dark: 'bg-charcoal-900 border border-charcoal-800 text-cream-50 shadow-soft-lg',
  glass: 'bg-white/80 backdrop-blur-md border border-white/40 shadow-soft',
};

function Card({
  variant = 'default',
  hoverable = false,
  padded = false,
  className = '',
  children,
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.default;
  const hover = hoverable ? 'transition-all duration-500 ease-spring hover:-translate-y-0.5' : 'transition-shadow duration-300';
  const pad = padded ? 'p-5 md:p-6' : '';

  return (
    <div className={`rounded-2xl overflow-hidden ${v} ${hover} ${pad} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default Card;
