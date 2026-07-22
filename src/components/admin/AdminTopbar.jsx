import { Menu, Bell, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ADMIN_NAV_ITEMS } from './AdminSidebar';

function AdminTopbar({ activeTab, onMenuClick, unreadCount = 0 }) {
  const current = ADMIN_NAV_ITEMS.find((i) => i.id === activeTab) || ADMIN_NAV_ITEMS[0];
  const Icon = current.icon;

  return (
    <header className="sticky top-0 z-20 border-b border-warm-200/60 bg-white/85 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Menüyü aç"
            className="rounded-xl border border-warm-200 bg-cream-50 p-2 text-warm-700 shadow-soft transition-colors hover:bg-warm-100 lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div className="hidden h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-warm-glow sm:grid">
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-warm-400">
              <span>Yönetim</span>
              <span aria-hidden className="text-warm-300">/</span>
              <span className="text-orange-600">{current.label}</span>
            </div>
            <h1 className="truncate text-lg font-bold tracking-tight text-charcoal-900 md:text-xl">
              {current.label}
            </h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {unreadCount > 0 && (
            <span
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-warm-200 bg-cream-50 text-warm-700 shadow-soft"
              aria-label={`${unreadCount} bildirim`}
              title={`${unreadCount} bekleyen öğe`}
            >
              <Bell size={18} />
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-soft">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </span>
          )}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-warm-200 bg-cream-50 px-3.5 py-2 text-sm font-semibold text-warm-800 shadow-soft transition-colors hover:bg-warm-100"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">Siteyi Görüntüle</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
