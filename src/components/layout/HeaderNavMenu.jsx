import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HEADER_NAV, isHeaderNavActive } from '../../constants/headerNav';

function NavDropdownLink({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <Link to={item.href} onClick={onNavigate} className="header-nav-dropdown-link header-nav-dropdown-link--compact">
      {Icon && (
        <span className="header-nav-dropdown-icon" aria-hidden>
          <Icon size={16} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="header-nav-dropdown-label">{item.label}</span>
          {item.badge && (
            <span className="rounded-full bg-orange-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {item.badge}
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}

function NavMegaPanel({ item, onClose }) {
  return (
    <div className="header-nav-mega" role="menu">
      <div className="header-nav-mega-inner">
        <div className={`header-nav-mega-grid ${item.id === 'araclar' ? 'header-nav-mega-grid--tools' : ''}`}>
          {item.sections.map((section) => (
            <div key={section.title} className="header-nav-mega-col">
              <p className="header-nav-mega-title">{section.title}</p>
              <ul className="space-y-0.5">
                {section.items.map((sub) => (
                  <li key={`${sub.href}-${sub.label}`}>
                    <NavDropdownLink item={sub} onNavigate={onClose} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {item.footerLink && (
          <Link to={item.footerLink.href} onClick={onClose} className="header-nav-mega-footer">
            {item.footerLink.label}
            <ArrowRight size={14} aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}

function HeaderNavItem({ item, pathname, isOpen, onToggle }) {
  const active = isHeaderNavActive(pathname, item);
  const hasMenu = item.mega;

  if (!hasMenu) {
    return (
      <Link
        to={item.href}
        className={`header-nav-trigger ${active ? 'header-nav-trigger--active' : ''} ${item.highlight ? 'header-nav-trigger--highlight' : ''}`}
      >
        {item.label}
        {item.highlight && !active && (
          <span className="header-nav-dot" aria-hidden />
        )}
      </Link>
    );
  }

  return (
    <div className="header-nav-item">
      <button
        type="button"
        className={`header-nav-trigger ${active ? 'header-nav-trigger--active' : ''} ${isOpen ? 'header-nav-trigger--open' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={onToggle}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`header-nav-chevron ${isOpen ? 'header-nav-chevron--open' : ''}`}
          aria-hidden
        />
      </button>
    </div>
  );
}

export default function HeaderNavMenu({ pathname }) {
  const [openId, setOpenId] = useState(null);
  const wrapRef = useRef(null);
  const openItem = HEADER_NAV.find((n) => n.id === openId);

  useEffect(() => {
    setOpenId(null);
  }, [pathname]);

  useEffect(() => {
    if (!openId) return undefined;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpenId(null);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [openId]);

  const close = () => setOpenId(null);
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <nav ref={wrapRef} className="header-nav-menu hidden lg:flex" aria-label="Ana menü">
      <div className="header-nav-pill">
        {HEADER_NAV.map((item) => (
          <HeaderNavItem
            key={item.id}
            item={item}
            pathname={pathname}
            isOpen={openId === item.id}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </div>

      {openId && (
        <button type="button" className="header-nav-backdrop" aria-label="Menüyü kapat" onClick={close} />
      )}

      {openItem?.mega && openId && <NavMegaPanel item={openItem} onClose={close} />}
    </nav>
  );
}
