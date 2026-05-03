import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-4xl',
};

/**
 * Modal - portal tabanli, animasyonlu, escape ile kapanan dialog
 * props:
 *  open: boolean
 *  onClose: () => void
 *  title, description, icon (opsiyonel header)
 *  size: sm | md | lg | xl | 2xl
 *  closeOnOverlay: default true
 *  hideCloseButton: default false
 *  footer: ReactNode (opsiyonel)
 */
function Modal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  iconTone = 'orange',
  size = 'md',
  closeOnOverlay = true,
  hideCloseButton = false,
  footer,
  children,
  className = '',
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => dialogRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const sizeClass = SIZES[size] || SIZES.md;

  const iconBgClass =
    iconTone === 'rose'
      ? 'bg-rose-100 text-rose-600'
      : iconTone === 'amber'
        ? 'bg-amber-100 text-amber-600'
        : iconTone === 'emerald'
          ? 'bg-emerald-100 text-emerald-600'
          : iconTone === 'blue'
            ? 'bg-blue-100 text-blue-600'
            : 'bg-orange-100 text-orange-600';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-4 font-sans">
      <div
        className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm animate-fade-in"
        onClick={() => closeOnOverlay && onClose?.()}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        ref={dialogRef}
        tabIndex={-1}
        className={`relative w-full ${sizeClass} animate-fade-up overflow-hidden rounded-2xl bg-white shadow-soft-xl ring-1 ring-warm-200/60 outline-none ${className}`}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between gap-3 border-b border-warm-200/60 bg-cream-50/60 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              {Icon && (
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconBgClass}`}>
                  <Icon size={20} />
                </span>
              )}
              <div className="min-w-0">
                {title && (
                  <h2
                    id="modal-title"
                    className="truncate text-base font-bold tracking-tight text-charcoal-900 sm:text-lg"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-0.5 text-xs text-warm-500 sm:text-sm">{description}</p>
                )}
              </div>
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={() => onClose?.()}
                aria-label="Kapat"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-warm-500 transition-colors hover:bg-warm-100 hover:text-charcoal-900"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="px-5 py-4 sm:px-6 sm:py-5">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-warm-200/60 bg-cream-50/60 px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
