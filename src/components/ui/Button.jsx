import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * Button - tek kaynaklı buton component
 * variants: primary | secondary | ghost | dark | link
 * sizes: sm | md | lg
 */
const VARIANTS = {
  primary:
    'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-warm-glow hover:shadow-warm-glow-lg hover:from-orange-600 hover:to-red-600 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
  secondary:
    'bg-white text-warm-800 border border-warm-200 shadow-soft hover:bg-cream-100 hover:border-warm-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-warm-400 focus-visible:ring-offset-2',
  ghost:
    'bg-transparent text-warm-700 hover:bg-warm-100 focus-visible:ring-2 focus-visible:ring-warm-400 focus-visible:ring-offset-2',
  dark:
    'bg-charcoal-900 text-cream-50 hover:bg-charcoal-800 hover:-translate-y-0.5 shadow-soft-md focus-visible:ring-2 focus-visible:ring-warm-400 focus-visible:ring-offset-2',
  link:
    'bg-transparent text-orange-600 hover:text-orange-700 underline-offset-4 hover:underline px-0',
};

const SIZES = {
  sm: 'text-xs px-3 py-2 gap-1.5 rounded-lg font-semibold',
  md: 'text-sm px-5 py-2.5 gap-2 rounded-xl font-semibold',
  lg: 'text-base px-7 py-3.5 gap-2.5 rounded-xl font-bold',
  xl: 'text-base md:text-lg px-8 py-4 gap-3 rounded-2xl font-bold',
};

const Button = forwardRef(function Button(
  {
    as,
    to,
    href,
    variant = 'primary',
    size = 'md',
    className = '',
    iconLeft: IconLeft,
    iconRight: IconRight,
    fullWidth = false,
    disabled = false,
    loading = false,
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = variant === 'link' ? 'text-sm font-semibold' : SIZES[size] || SIZES.md;
  const widthClass = fullWidth ? 'w-full justify-center' : '';
  const stateClass = disabled || loading ? 'opacity-60 pointer-events-none' : '';

  const classes = `inline-flex items-center justify-center select-none transition-all duration-300 ease-spring ${variantClass} ${sizeClass} ${widthClass} ${stateClass} ${className}`;

  const content = (
    <>
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      ) : (
        IconLeft && <IconLeft size={size === 'sm' ? 14 : 18} aria-hidden="true" />
      )}
      {children && <span>{children}</span>}
      {IconRight && !loading && <IconRight size={size === 'sm' ? 14 : 18} aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  const Component = as || 'button';
  return (
    <Component ref={ref} type={Component === 'button' ? type : undefined} disabled={disabled || loading} className={classes} {...rest}>
      {content}
    </Component>
  );
});

export default Button;
