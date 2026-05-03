/**
 * Container - tutarlı sayfa genişliği
 * Tüm sayfa bölümlerinde kullanılması beklenen wrapper.
 */
function Container({ size = 'default', className = '', children, ...rest }) {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-7xl',
    lg: 'max-w-[1400px]',
    full: 'max-w-none',
  };
  const max = sizes[size] || sizes.default;

  return (
    <div className={`${max} mx-auto px-4 sm:px-6 lg:px-8 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default Container;
