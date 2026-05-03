import { useEffect, useRef, useState } from 'react';

/**
 * Dropdown - kontrolsüz menu (outside click + escape ile kapanır)
 * Kullanim:
 * <Dropdown
 *   trigger={({ open, toggle }) => <button onClick={toggle}>...</button>}
 *   align="right"
 * >
 *   {({ close }) => (
 *     <DropdownItem onClick={() => { handle(); close(); }}>...</DropdownItem>
 *   )}
 * </Dropdown>
 */
function Dropdown({
  trigger,
  align = 'right',
  width = 'w-56',
  className = '',
  children,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const toggle = () => setOpen((o) => !o);

  const alignClass = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {trigger({ open, toggle, close })}
      {open && (
        <div
          role="menu"
          className={`absolute ${alignClass} top-full z-50 mt-2 ${width} origin-top-${
            align === 'left' ? 'left' : 'right'
          } animate-fade-up overflow-hidden rounded-2xl border border-warm-200/60 bg-white p-1.5 shadow-soft-xl ring-1 ring-charcoal-900/5`}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  icon: Icon,
  label,
  onClick,
  href,
  to,
  as: Component,
  variant = 'default',
  rightSlot,
  className = '',
  children,
  ...rest
}) {
  const variantClass =
    variant === 'danger'
      ? 'text-rose-600 hover:bg-rose-50'
      : variant === 'brand'
        ? 'text-orange-700 hover:bg-orange-50'
        : 'text-warm-800 hover:bg-warm-100';

  const base = `flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${variantClass} ${className}`;

  const content = (
    <>
      {Icon && <Icon size={16} className="shrink-0" />}
      <span className="flex-1 text-left">{children || label}</span>
      {rightSlot}
    </>
  );

  if (Component) {
    return (
      <Component className={base} onClick={onClick} {...rest}>
        {content}
      </Component>
    );
  }

  if (to || href) {
    return (
      <a className={base} href={href || to} onClick={onClick} role="menuitem" {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={base} onClick={onClick} role="menuitem" {...rest}>
      {content}
    </button>
  );
}

export function DropdownSeparator({ className = '' }) {
  return <div className={`my-1 h-px bg-warm-200/70 ${className}`} />;
}

export function DropdownLabel({ children, className = '' }) {
  return (
    <div
      className={`px-3 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-warm-400 ${className}`}
    >
      {children}
    </div>
  );
}

export default Dropdown;
