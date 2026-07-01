import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HEADER_NAV, isHeaderNavActive } from '../../constants/headerNav';

function MobileAccordionSection({ item, pathname, onNavigate }) {
  const active = isHeaderNavActive(pathname, item);
  const hasChildren = item.mega && item.sections?.length > 0;
  const [open, setOpen] = useState(active);

  if (!hasChildren) {
    return (
      <Link
        to={item.href}
        onClick={onNavigate}
        className={`mobile-nav-link ${active ? 'mobile-nav-link--active' : ''} ${item.highlight ? 'mobile-nav-link--highlight' : ''}`}
      >
        <span className="relative inline-flex items-center gap-2">
          {item.label}
          {item.highlight && !active && <span className="header-nav-dot" aria-hidden />}
        </span>
      </Link>
    );
  }

  const Icon = item.icon;

  return (
    <div className="mobile-nav-accordion">
      <button
        type="button"
        className={`mobile-nav-accordion-trigger ${open ? 'mobile-nav-accordion-trigger--open' : ''} ${isHeaderNavActive(pathname, item) ? 'mobile-nav-accordion-trigger--active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-orange-500" aria-hidden />}
          {item.label}
        </span>
        <ChevronDown size={16} className={`mobile-nav-chevron ${open ? 'mobile-nav-chevron--open' : ''}`} aria-hidden />
      </button>

      {open && (
        <div className="mobile-nav-accordion-panel">
          {item.sections.map((section) => (
            <div key={section.title} className="mobile-nav-section">
              <p className="mobile-nav-section-title">{section.title}</p>
              <ul className="space-y-0.5">
                {section.items.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <li key={`${sub.href}-${sub.label}`}>
                      <Link to={sub.href} onClick={onNavigate} className="mobile-nav-sublink">
                        {SubIcon && (
                          <span className="mobile-nav-sublink-icon" aria-hidden>
                            <SubIcon size={14} />
                          </span>
                        )}
                        <span>{sub.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {item.footerLink && (
            <Link to={item.footerLink.href} onClick={onNavigate} className="mobile-nav-view-all">
              {item.footerLink.label}
              <ArrowRight size={14} aria-hidden />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function MobileNavMenu({ open, onClose, top, pathname, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="mobile-nav-backdrop"
        style={{ top }}
        aria-label="Menüyü kapat"
        onClick={onClose}
      />
      <div
        className="mobile-nav-panel"
        style={{ top, maxHeight: `calc(100dvh - ${top}px)` }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobil menü"
      >
        {children}

        <nav className="mobile-nav-groups" aria-label="Site menüsü">
          {HEADER_NAV.map((item) => (
            <MobileAccordionSection
              key={item.id}
              item={item}
              pathname={pathname}
              onNavigate={onClose}
            />
          ))}
        </nav>
      </div>
    </>,
    document.body
  );
}
