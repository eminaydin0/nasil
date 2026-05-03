/**
 * Avatar - profil resmi + initials fallback
 * sizes: xs | sm | md | lg | xl
 */
const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({
  src,
  name = '',
  size = 'md',
  ring = false,
  active = false,
  className = '',
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const ringClass = ring ? 'ring-2 ring-warm-200' : '';
  const activeRingClass = active ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-cream-50' : '';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        loading="lazy"
        className={`${s} shrink-0 rounded-full object-cover ${ringClass} ${activeRingClass} ${className}`}
        {...rest}
      />
    );
  }

  return (
    <span
      aria-label={name || 'avatar'}
      className={`${s} grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 font-bold text-white shadow-soft ${ringClass} ${activeRingClass} ${className}`}
      {...rest}
    >
      {getInitials(name)}
    </span>
  );
}

export default Avatar;
