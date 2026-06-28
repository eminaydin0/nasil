import { Link } from 'react-router-dom';
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
  ChevronRight,
} from 'lucide-react';

const LOGO_URL = '/logo.svg';

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
      { id: 'comments', label: 'Yorumlar', icon: MessageCircle },
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
  onTabChange,
  isOpen = false,
  onClose,
  onLogout,
  badges = {},
  gameCount = 0,
}) {
  return (
    <>
      {/* Mobil overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-charcoal-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-warm-200/60 bg-cream-50 shadow-soft-xl transition-transform duration-300 ease-spring lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between gap-3 border-b border-warm-200/60 px-5 py-5">
          <Link to="/" className="group flex items-center gap-2.5" onClick={onClose}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-warm-glow transition-transform duration-300 group-hover:rotate-3">
              <img src={LOGO_URL} alt="" className="h-6 w-6 brightness-0 invert" />
            </span>
            <div className="leading-tight">
              <div className="text-[15px] font-bold text-charcoal-900">Kuralı Ne?</div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-warm-500">Admin Paneli</div>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="rounded-lg p-2 text-warm-500 transition-colors hover:bg-warm-100 hover:text-warm-700 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-warm-400">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const badge = badges[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onTabChange(item.id);
                        onClose?.();
                      }}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-warm-glow'
                          : 'text-warm-700 hover:bg-warm-100 hover:text-charcoal-900'
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 ${isActive ? '' : 'text-warm-500 group-hover:text-orange-600'}`}
                      />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.id === 'games' && gameCount > 0 && (
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-warm-200 text-warm-700'
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
                      {isActive && <ChevronRight size={14} className="opacity-80" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-warm-200/60 p-3">
          <Link
            to="/"
            onClick={onClose}
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-warm-700 transition-colors hover:bg-warm-100 hover:text-charcoal-900"
          >
            <Home size={18} className="text-warm-500" />
            Siteyi Görüntüle
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
