import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HEADER_NAV, isHeaderNavActive } from '../../constants/headerNav';

function MobileNavBadge({ label = 'Yeni' }) {
  return (
    <span className="mobile-nav-badge" aria-hidden>
      {label}
    </span>
  );
}

function MobileNavRowIcon({ Icon }) {
  if (!Icon) return null;
  return (
    <span className="mobile-nav-row-icon" aria-hidden>
      <Icon size={18} strokeWidth={2.25} />
    </span>
  );
}

function MobileAccordionSection({ item, pathname, onNavigate }) {
  const active = isHeaderNavActive(pathname, item);
  const hasChildren = item.mega && item.sections?.length > 0;
  const [open, setOpen] = useState(active);
  const Icon = item.icon;

  if (!hasChildren) {
    return (
      <Link
        to={item.href}
        onClick={onNavigate}
        className={`mobile-nav-row ${active ? 'mobile-nav-row--active' : ''} ${item.highlight ? 'mobile-nav-row--highlight' : ''}`}
      >
        <MobileNavRowIcon Icon={Icon} />
        <span className="mobile-nav-row-label">{item.label}</span>
        {item.highlight && !active && <MobileNavBadge />}
        <ChevronRight size={16} className="mobile-nav-row-chevron" aria-hidden />
      </Link>
    );
  }

  return (
    <div className={`mobile-nav-accordion ${open ? 'mobile-nav-accordion--open' : ''}`}>
      <button
        type="button"
        className={`mobile-nav-row mobile-nav-row--trigger ${open ? 'mobile-nav-row--expanded' : ''} ${active ? 'mobile-nav-row--active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <MobileNavRowIcon Icon={Icon} />
        <span className="mobile-nav-row-label">{item.label}</span>
        <ChevronDown size={18} className={`mobile-nav-row-chevron mobile-nav-row-chevron--down ${open ? 'mobile-nav-row-chevron--open' : ''}`} aria-hidden />
      </button>

      {open && (
        <div className="mobile-nav-accordion-panel">
          {item.sections.map((section) => (
            <div key={section.title} className="mobile-nav-section">
              <p className="mobile-nav-section-title">{section.title}</p>
              <ul className="mobile-nav-section-list">
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
                        <span className="mobile-nav-sublink-label">{sub.label}</span>
                        {sub.badge && <span className="mobile-nav-sublink-badge">{sub.badge}</span>}
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

function lockBodyScroll() {
  const scrollY = window.scrollY;
  const { style } = document.body;
  const prev = {
    overflow: style.overflow,
    position: style.position,
    top: style.top,
    width: style.width,
    paddingRight: style.paddingRight,
  };

  const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
  style.overflow = 'hidden';
  style.position = 'fixed';
  style.top = `-${scrollY}px`;
  style.width = '100%';
  if (scrollbarGap > 0) {
    style.paddingRight = `${scrollbarGap}px`;
  }

  return () => {
    style.overflow = prev.overflow;
    style.position = prev.position;
    style.top = prev.top;
    style.width = prev.width;
    style.paddingRight = prev.paddingRight;
    window.scrollTo(0, scrollY);
  };
}

export default function MobileNavMenu({ open, onClose, pathname, search, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    return lockBodyScroll();
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
        aria-label="Menüyü kapat"
        onClick={onClose}
      />
      <div
        className="mobile-nav-panel"
        style={{ top: 'var(--app-header-offset)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobil menü"
      >
        {search && <div className="mobile-nav-search">{search}</div>}

        <nav className="mobile-nav-scroll" aria-label="Site menüsü">
          <div className="mobile-nav-groups">
            {HEADER_NAV.map((item) => (
              <MobileAccordionSection
                key={item.id}
                item={item}
                pathname={pathname}
                onNavigate={onClose}
              />
            ))}
          </div>
        </nav>

        {footer && <div className="mobile-nav-footer">{footer}</div>}
      </div>
    </>,
    document.body
  );
}
