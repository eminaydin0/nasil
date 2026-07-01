import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  User as UserIcon,
  LogOut,
  Settings,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  useConfirm,
} from '../ui';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/', label: 'Ana Sayfa', exact: true },
  { to: '/oyunlar', label: 'Oyunlar', exact: false },
  { to: '/haberler', label: 'Haberler', exact: false },
  { to: '/ucretsiz-oyunlar', label: 'Bedava', exact: true, highlight: true },
  { to: '/araclar', label: 'Araçlar', exact: false },
  { to: '/hakkimizda', label: 'Hakkımızda', exact: true },
  { to: '/iletisim', label: 'İletişim', exact: true },
];

function useNavActive(pathname) {
  return (to, exact) => {
    if (exact) return pathname === to;
    if (to === '/oyunlar') {
      return (
        pathname === '/oyunlar' ||
        pathname.startsWith('/oyun/') ||
        pathname.startsWith('/kategori/')
      );
    }
    if (to === '/haberler') {
      return pathname === '/haberler' || pathname.startsWith('/haberler/');
    }
    if (to === '/ucretsiz-oyunlar') {
      return pathname === '/ucretsiz-oyunlar';
    }
    if (to === '/araclar') {
      return pathname === '/araclar' || pathname.startsWith('/araclar/');
    }
    return pathname.startsWith(to);
  };
}

function GameSearchDropdown({ games, searchTerm, searchResultsUrl, onNavigate }) {
  if (!searchTerm) return null;

  return (
    <div className="absolute top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-xl border border-warm-200/80 bg-white p-1 shadow-soft-xl">
      {games.length > 0 ? (
        games.map((game) => (
          <Link
            key={game.id}
            to={`/oyun/${game.slug}`}
            className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-cream-50"
            onClick={onNavigate}
          >
            <img
              src={game.image}
              alt={game.name}
              loading="lazy"
              className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-warm-200/60"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-warm-900">{game.name}</p>
              <p className="truncate text-xs text-warm-500">{game.shortDescription}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="px-3 py-2.5 text-xs text-warm-500">Eşleşen oyun bulunamadı</p>
      )}
      {searchResultsUrl && (
        <Link
          to={searchResultsUrl}
          className="mt-0.5 block border-t border-warm-100 px-3 py-2.5 text-center text-xs font-semibold text-orange-600 hover:bg-orange-50 rounded-b-lg"
          onClick={onNavigate}
        >
          Tüm sonuçları gör
        </Link>
      )}
    </div>
  );
}

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [games, setGames] = useState([]);
  const searchRef = useRef(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const confirm = useConfirm();
  const isActive = useNavActive(pathname);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('id, slug, name, category, short_description, image');

      if (error) throw error;

      setGames(
        (data || []).map((game) => ({
          id: game.id,
          slug: game.slug,
          name: game.name,
          category: game.category,
          shortDescription: game.short_description,
          image: game.image,
        }))
      );
    } catch (error) {
      console.error('Error loading games:', error);
      setGames([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchFocused(false);
    setSearchTerm('');
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const filteredGames = games
    .filter(
      (game) =>
        searchTerm &&
        (game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (game.shortDescription &&
            game.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .slice(0, 5);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/oyunlar?search=${encodeURIComponent(searchTerm.trim())}`);
      clearSearch();
    }
  };

  const clearSearch = () => {
    setSearchFocused(false);
    setSearchTerm('');
  };

  const searchResultsUrl = searchTerm.trim()
    ? `/oyunlar?search=${encodeURIComponent(searchTerm.trim())}`
    : null;

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Çıkış yap',
      description: 'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      type: 'warning',
      confirmText: 'Çıkış Yap',
      cancelText: 'Vazgeç',
    });
    if (!ok) return;
    try {
      await signOut();
      toast.success('Başarıyla çıkış yaptınız');
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';
  const avatarUrl = user?.user_metadata?.avatar_url;

  const desktopNavClass = (to, exact, highlight) => {
    const active = isActive(to, exact);
    return [
      'relative px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap',
      active
        ? 'text-orange-700 bg-orange-50'
        : highlight
          ? 'text-orange-700 hover:text-orange-800 hover:bg-orange-50/80'
          : 'text-warm-600 hover:text-warm-900 hover:bg-warm-50',
    ].join(' ');
  };

  const mobileNavClass = (to, exact, highlight) => {
    const active = isActive(to, exact);
    return [
      'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
      active ? 'bg-orange-50 text-orange-700' : highlight ? 'text-orange-700 hover:bg-orange-50/60' : 'text-warm-700 hover:bg-cream-100',
    ].join(' ');
  };

  return (
    <header className="safe-area-top safe-area-x sticky top-0 z-50 border-b border-warm-200/80 bg-white/90 font-sans shadow-[0_1px_0_rgba(28,25,23,0.04),0_4px_24px_-4px_rgba(28,25,23,0.06)] backdrop-blur-lg">
      <nav className="container mx-auto px-4" aria-label="Ana menü">
        <div className="flex h-[4.25rem] items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Kuralı Ne? - Ana Sayfa"
          >
            <img
              src="/logo.svg"
              alt="Kuralı Ne?"
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] md:h-12"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width="48"
              height="48"
            />
            <span className="hidden text-sm font-extrabold tracking-tight text-warm-900 sm:block">
              Kuralı Ne?
            </span>
          </Link>

          {/* Desktop nav — pill */}
          <div className="hidden flex-1 justify-center lg:flex">
            <div className="inline-flex items-center gap-0.5 rounded-xl border border-warm-200/70 bg-cream-50/80 p-1">
              {navItems.map(({ to, label, exact, highlight }) => (
                <Link key={to} to={to} className={desktopNavClass(to, exact, highlight)}>
                  {label}
                  {highlight && !isActive(to, exact) && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" aria-hidden />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search — desktop */}
            <div className="relative hidden md:block" ref={searchRef}>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
                size={15}
                aria-hidden
              />
              <input
                type="search"
                placeholder="Oyun ara…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                className="w-44 rounded-full border border-warm-200/80 bg-cream-50 py-2 pl-9 pr-3 text-sm text-warm-900 placeholder:text-warm-400 transition-all focus:w-52 focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 xl:w-48 xl:focus:w-56"
                aria-label="Oyun ara"
              />
              {searchFocused && (
                <GameSearchDropdown
                  games={filteredGames}
                  searchTerm={searchTerm}
                  searchResultsUrl={searchResultsUrl}
                  onNavigate={clearSearch}
                />
              )}
            </div>

            <div className="hidden items-center gap-1.5 md:flex">
              {user ? (
                <>
                  <NotificationBell />
                  <Dropdown
                    align="right"
                    width="w-60"
                    trigger={({ open, toggle }) => (
                      <button
                        type="button"
                        onClick={toggle}
                        className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition-all ${
                          open
                            ? 'border-orange-200 bg-orange-50/80'
                            : 'border-warm-200/80 bg-cream-50 hover:border-warm-300 hover:bg-white'
                        }`}
                        aria-label="Profil menüsü"
                        aria-expanded={open}
                      >
                        <Avatar src={avatarUrl} name={displayName} size="sm" />
                        <span className="hidden max-w-[5.5rem] truncate text-xs font-semibold text-warm-800 xl:inline">
                          {displayName}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`text-warm-400 transition-transform ${open ? 'rotate-180' : ''}`}
                          aria-hidden
                        />
                      </button>
                    )}
                  >
                    {({ close }) => (
                      <>
                        <div className="mb-1 flex items-center gap-2.5 rounded-lg bg-cream-50 px-2.5 py-2">
                          <Avatar src={avatarUrl} name={displayName} size="md" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-warm-900">{displayName}</p>
                            <p className="truncate text-[11px] text-warm-500">{user.email}</p>
                          </div>
                        </div>
                        <DropdownSeparator />
                        <DropdownLabel>Hesap</DropdownLabel>
                        <DropdownItem as={Link} to="/profil" icon={UserIcon} onClick={close}>
                          Profilim
                        </DropdownItem>
                        <DropdownItem as={Link} to="/profil#favoriler" icon={Heart} onClick={close}>
                          Favorilerim
                        </DropdownItem>
                        <DropdownItem as={Link} to="/profil#hesap" icon={Settings} onClick={close}>
                          Ayarlar
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem
                          icon={LogOut}
                          variant="danger"
                          onClick={() => {
                            close();
                            handleLogout();
                          }}
                        >
                          Çıkış Yap
                        </DropdownItem>
                      </>
                    )}
                  </Dropdown>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
                >
                  Giriş Yap
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <div className="flex items-center gap-1 md:hidden">
              {user && <NotificationBell />}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-warm-200/80 bg-cream-50 text-warm-700 transition-colors hover:bg-white"
                aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-[var(--app-header-offset)] z-40 bg-charcoal-900/20 backdrop-blur-[2px] md:hidden"
            aria-label="Menüyü kapat"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="safe-area-x fixed inset-x-0 top-[var(--app-header-offset)] z-50 max-h-[calc(100dvh-var(--app-header-offset))] overflow-y-auto border-b border-warm-200/80 bg-white px-4 py-4 shadow-soft-xl md:hidden">
            <div className="relative mb-4" ref={searchRef}>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
                size={16}
                aria-hidden
              />
              <input
                type="search"
                placeholder="Oyun ara…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                className="w-full rounded-xl border border-warm-200/80 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-warm-900 placeholder:text-warm-400 focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100"
                aria-label="Oyun ara"
              />
              {searchFocused && (
                <GameSearchDropdown
                  games={filteredGames}
                  searchTerm={searchTerm}
                  searchResultsUrl={searchResultsUrl}
                  onNavigate={() => {
                    clearSearch();
                    setMobileMenuOpen(false);
                  }}
                />
              )}
            </div>

            <div className="space-y-0.5">
              {navItems.map(({ to, label, exact, highlight }) => (
                <Link
                  key={to}
                  to={to}
                  className={mobileNavClass(to, exact, highlight)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{label}</span>
                  {highlight && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-orange-700">
                      Yeni
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-warm-100 pt-4">
              {user ? (
                <div className="space-y-1">
                  <Link
                    to="/profil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl bg-cream-50 px-3 py-3"
                  >
                    <Avatar src={avatarUrl} name={displayName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-warm-900">{displayName}</p>
                      <p className="truncate text-xs text-warm-500">Profilim</p>
                    </div>
                  </Link>
                  <Link
                    to="/profil#favoriler"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-warm-700 hover:bg-cream-50"
                  >
                    <Heart size={16} className="text-orange-500" aria-hidden />
                    Favorilerim
                  </Link>
                  <Link
                    to="/profil#hesap"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-warm-700 hover:bg-cream-50"
                  >
                    <Settings size={16} className="text-warm-500" aria-hidden />
                    Ayarlar
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut size={16} aria-hidden />
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-orange-600 py-3 text-center text-sm font-semibold text-white hover:bg-orange-700"
                >
                  Giriş Yap / Kayıt Ol
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
