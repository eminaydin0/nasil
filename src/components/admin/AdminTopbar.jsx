import { Menu, Bell, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ADMIN_NAV_ITEMS } from './AdminSidebar';

function AdminTopbar({ activeTab, onMenuClick, unreadCount = 0 }) {
  const current = ADMIN_NAV_ITEMS.find((i) => i.id === activeTab) || ADMIN_NAV_ITEMS[0];
  const Icon = current.icon;

  return (
    <header className="sticky top-0 z-20 border-b border-warm-200/60 bg-cream-50/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Menüyü aç"
            className="rounded-xl border border-warm-200 bg-white p-2 text-warm-700 shadow-soft transition-colors hover:bg-warm-50 lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div className="hidden h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 text-orange-600 sm:grid">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-warm-400">
              <span>Admin</span>
              <span aria-hidden>›</span>
              <span className="text-orange-600">{current.label}</span>
            </div>
            <h1 className="truncate text-lg font-bold text-charcoal-900 md:text-xl">
              {current.label}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-warm-200 bg-white text-warm-700 shadow-soft transition-colors hover:bg-warm-50"
            aria-label="Bildirimler"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-soft">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          <Link
            to="/"
            className="hidden items-center gap-1.5 rounded-xl border border-warm-200 bg-white px-3.5 py-2 text-sm font-semibold text-warm-800 shadow-soft transition-colors hover:bg-warm-50 sm:inline-flex"
          >
            <Eye size={16} />
            <span className="hidden md:inline">Siteyi Görüntüle</span>
            <span className="md:hidden">Site</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
