import { Link, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad2,
  MessageCircle,
  TrendingUp,
  Images,
  Sparkles,
  FolderTree,
  FileText,
  Newspaper,
  Mail,
  Users,
  Home,
  LogOut,
  X,
  Gift,
  Tag,
  Smile,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

const LOGO_URL = '/logo.png';

const NAV_GROUPS = [
  {
    label: 'Genel',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analitik', icon: TrendingUp },
    ],
  },
  {
    label: 'İçerik',
    items: [
      { id: 'games', label: 'Oyunlar', icon: Gamepad2 },
      { id: 'categories', label: 'Kategoriler', icon: FolderTree },
      { id: 'news', label: 'Haberler', icon: Newspaper },
      { id: 'news-engagement', label: 'Haber Yorumları', icon: Smile },
      { id: 'free-games', label: 'Ücretsiz Oyunlar', icon: Gift },
      { id: 'deals', label: 'Oyun İndirimleri', icon: Tag },
      { id: 'comments', label: 'Oyun Yorumları', icon: MessageCircle },
      { id: 'carousel', label: 'Hero Carousel', icon: Images },
      { id: 'gameoftheday', label: 'Günün Oyunu', icon: Sparkles },
      { id: 'content', label: 'Site İçeriği', icon: FileText },
    ],
  },
  {
    label: 'Topluluk',
    items: [
      { id: 'users', label: 'Kullanıcılar', icon: Users },
      { id: 'contact', label: 'İletişim Mesajları', icon: Mail },
    ],
  },
];

export const ADMIN_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function AdminSidebar({
  activeTab,
  isOpen = false,
  onClose,
  onLogout,
  badges = {},
  gameCount = 0,
  collapsed = false,
  onToggleCollapse,
}) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-charcoal-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-40 flex flex-col bg-charcoal-950 text-cream-50 transition-[width,transform] duration-300 ease-spring lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:translate-x-0 ${
          collapsed ? 'admin-sidebar--collapsed lg:w-[4.5rem]' : 'lg:w-[17.5rem]'
        } w-[17.5rem] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute -right-10 bottom-24 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />
        </div>

        {/* Brand */}
        <div
          className={`relative flex items-center border-b border-white/10 py-4 ${
            collapsed ? 'justify-center px-2' : 'justify-between gap-3 px-4'
          }`}
        >
          <Link
            to="/"
            className={`group flex min-w-0 items-center ${collapsed ? '' : 'gap-3'}`}
            onClick={onClose}
            title="Kuralı Ne?"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-charcoal-900 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-[1.03]">
              <img src={LOGO_URL} alt="" className="h-full w-full object-cover" />
            </span>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-bold tracking-tight text-cream-50">
                  Kuralı Ne?
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-400/90">
                  Admin
                </div>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="rounded-lg p-2 text-cream-100/50 transition-colors hover:bg-white/10 hover:text-cream-50 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className={`relative flex-1 space-y-5 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-3'}`}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/35">
                  {group.label}
                </div>
              )}
              {collapsed && (
                <div className="mx-auto mb-2 h-px w-6 bg-white/10" aria-hidden />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const badge = badges[item.id];
                  return (
                    <NavLink
                      key={item.id}
                      to={`/admin-panel/${item.id}`}
                      title={item.label}
                      onClick={() => onClose?.()}
                      className={`group relative flex w-full items-center rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                        collapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_8px_24px_-8px_rgba(249,115,22,0.55)]'
                          : 'text-cream-100/70 hover:bg-white/10 hover:text-cream-50'
                      }`}
                    >
                      {isActive && !collapsed && (
                        <span
                          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-cream-50/90"
                          aria-hidden
                        />
                      )}
                      <Icon
                        size={17}
                        className={`shrink-0 ${
                          isActive ? 'text-white' : 'text-cream-100/40 group-hover:text-orange-300'
                        }`}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate text-left">{item.label}</span>
                          {item.id === 'games' && gameCount > 0 && (
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-white/10 text-cream-100/60'
                              }`}
                            >
                              {gameCount}
                            </span>
                          )}
                          {badge > 0 && (
                            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                              {badge > 99 ? '99+' : badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && badge > 0 && (
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-charcoal-950" />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={`relative space-y-1 border-t border-white/10 p-2 ${collapsed ? '' : 'p-3'}`}>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={collapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
              aria-label={collapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
              className={`hidden w-full items-center rounded-xl text-[13px] font-semibold text-cream-100/55 transition-colors hover:bg-white/10 hover:text-cream-50 lg:flex ${
                collapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2.5'
              }`}
            >
              {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
              {!collapsed && <span>Daralt</span>}
            </button>
          )}
          <Link
            to="/"
            onClick={onClose}
            title="Siteyi Görüntüle"
            className={`flex w-full items-center rounded-xl text-[13px] font-semibold text-cream-100/60 transition-colors hover:bg-white/10 hover:text-cream-50 ${
              collapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2.5'
            }`}
          >
            <Home size={17} className="text-cream-100/40" />
            {!collapsed && 'Siteyi Görüntüle'}
          </Link>
          <button
            type="button"
            onClick={onLogout}
            title="Çıkış Yap"
            className={`flex w-full items-center rounded-xl text-[13px] font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 ${
              collapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2.5'
            }`}
          >
            <LogOut size={17} />
            {!collapsed && 'Çıkış Yap'}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
