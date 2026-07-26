import { Menu, Bell, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ADMIN_NAV_ITEMS } from './AdminSidebar';

function AdminTopbar({ activeTab, onMenuClick, unreadCount = 0 }) {
  const current = ADMIN_NAV_ITEMS.find((i) => i.id === activeTab) || ADMIN_NAV_ITEMS[0];
  const Icon = current.icon;

  return (
    <header className="admin-topbar sticky top-0 z-20 border-b border-warm-200/70 bg-[#fbfaf7]/92 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Menüyü aç"
            className="grid h-10 w-10 place-items-center rounded-xl border border-warm-200/80 bg-white text-warm-700 shadow-soft transition-colors hover:bg-cream-50 hover:text-charcoal-900 lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-10 w-10 place-items-center rounded-xl bg-charcoal-900 text-orange-300 shadow-soft sm:grid">
              <Icon size={17} />
            </div>
            <div className="min-w-0">
              <nav
                aria-label="Konum"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-warm-400"
              >
                <span>Yönetim</span>
                <span className="text-warm-300" aria-hidden>
                  /
                </span>
                <span className="truncate text-orange-600">{current.label}</span>
              </nav>
              <h1 className="truncate text-lg font-extrabold tracking-tight text-charcoal-900 md:text-xl">
                {current.label}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {unreadCount > 0 && (
            <span
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-warm-200/80 bg-white text-warm-700 shadow-soft"
              aria-label={`${unreadCount} bildirim`}
              title={`${unreadCount} bekleyen öğe`}
            >
              <Bell size={17} />
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white ring-2 ring-[#fbfaf7]">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </span>
          )}

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-charcoal-900 px-3.5 text-sm font-semibold text-cream-50 shadow-soft transition-all hover:bg-charcoal-800 hover:-translate-y-0.5"
          >
            <ExternalLink size={15} />
            <span className="hidden sm:inline">Siteyi Aç</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
