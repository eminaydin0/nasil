import { Link, useNavigate, useLocation } from 'react-router-dom';
import { coverSrc } from '../../lib/coverImage';
import {
  Menu,
  X,
  Search,
  User as UserIcon,
  LogOut,
  Settings,
  Heart,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
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
import HeaderNavMenu from './HeaderNavMenu';
import MobileNavMenu from './MobileNavMenu';

function GameSearchDropdown({ games, searchTerm, searchResultsUrl, onNavigate, night = false }) {
  if (!searchTerm) return null;

  return (
    <div
      className={`header-search-pop absolute top-[calc(100%+6px)] z-[120] w-full overflow-hidden rounded-xl border p-1 shadow-soft-xl ${
        night ? 'border-white/10 bg-[#141210]' : 'border-warm-200/80 bg-white'
      }`}
    >
      {games.length > 0 ? (
        games.map((game) => (
          <Link
            key={game.id}
            to={`/oyun/${game.slug}`}
            className={`flex items-center gap-3 rounded-lg p-2.5 transition-colors ${
              night ? 'hover:bg-white/[0.06]' : 'hover:bg-cream-50'
            }`}
            onClick={onNavigate}
          >
            <img
              src={coverSrc(game, 96)}
              alt={`${game.name} nasıl oynanır`}
              width="36"
              height="36"
              loading="lazy"
              className={`h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ${
                night ? 'ring-white/10' : 'ring-warm-200/60'
              }`}
              onError={(e) => {
                if (e.target.dataset.fallbackApplied === '1') return;
                e.target.dataset.fallbackApplied = '1';
                e.target.src = '/card-fallback.png';
              }}
            />
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-semibold ${night ? 'text-white' : 'text-warm-900'}`}>
                {game.name}
              </p>
              <p className={`truncate text-xs ${night ? 'text-white/50' : 'text-warm-500'}`}>
                {game.shortDescription}
              </p>
            </div>
          </Link>
        ))
      ) : (
        <p className={`px-3 py-2.5 text-xs ${night ? 'text-white/50' : 'text-warm-500'}`}>
          Eşleşen oyun bulunamadı
        </p>
      )}
      {searchResultsUrl && (
        <Link
          to={searchResultsUrl}
          className={`mt-0.5 block rounded-b-lg border-t px-3 py-2.5 text-center text-xs font-semibold ${
            night
              ? 'border-white/10 text-orange-300 hover:bg-white/[0.04]'
              : 'border-warm-100 text-orange-600 hover:bg-orange-50'
          }`}
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
  const headerRef = useRef(null);
  const searchRef = useRef(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const night = true;
  const confirm = useConfirm();

  const syncHeaderMetrics = useCallback(() => {
    const el = headerRef.current;
    if (!el) return;
    document.documentElement.style.setProperty('--app-header-offset', `${el.offsetHeight}px`);
  }, []);

  useEffect(() => {
    if (!searchFocused || games.length > 0) return;
    loadGames();
  }, [searchFocused, games.length]);

  useEffect(() => {
    syncHeaderMetrics();
    const el = headerRef.current;
    if (!el) return undefined;

    const ro = new ResizeObserver(syncHeaderMetrics);
    ro.observe(el);
    window.addEventListener('resize', syncHeaderMetrics);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncHeaderMetrics);
    };
  }, [syncHeaderMetrics]);

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
      setMobileMenuOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.dataset.mobileNavOpen = 'true';
    } else {
      delete document.body.dataset.mobileNavOpen;
    }
    return () => {
      delete document.body.dataset.mobileNavOpen;
    };
  }, [mobileMenuOpen]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <>
      <header
        ref={headerRef}
        className={`safe-area-top safe-area-x sticky top-0 z-50 border-b font-sans backdrop-blur-lg ${
          night
            ? 'header--night border-white/[0.06] bg-[#0c0b09]/90 shadow-none'
            : 'border-warm-200/80 bg-white/92 shadow-[0_1px_0_rgba(28,25,23,0.04),0_4px_24px_-4px_rgba(28,25,23,0.06)]'
        }${mobileMenuOpen ? ' header--mobile-menu-open' : ''}`}
      >
        <div className="container mx-auto flex h-[4.25rem] items-center gap-3 px-3 sm:px-4">
          <Link
            to="/"
            className="group flex shrink-0 items-center"
            aria-label="Kuralı Ne? - Ana Sayfa"
          >
            <img
              src="/logo.webp"
              alt="Kuralı Ne?"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:h-11 md:h-12"
              loading="eager"
              decoding="async"
              fetchPriority="low"
              width="288"
              height="96"
            />
          </Link>

          <HeaderNavMenu pathname={pathname} />

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="relative hidden lg:block" ref={searchRef}>
              <Search
                className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
                  night ? 'text-white/40' : 'text-warm-400'
                }`}
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
                className={`w-40 rounded-full border py-2 pl-9 pr-3 text-sm transition-all focus:w-48 focus:outline-none focus:ring-2 xl:w-44 xl:focus:w-52 ${
                  night
                    ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-white/35 focus:border-orange-400/70 focus:bg-white/[0.07] focus:ring-orange-500/20'
                    : 'border-warm-200/80 bg-cream-50 text-warm-900 placeholder:text-warm-400 focus:border-orange-300 focus:bg-white focus:ring-orange-100'
                }`}
                aria-label="Oyun ara"
              />
              {searchFocused && (
                <GameSearchDropdown
                  games={filteredGames}
                  searchTerm={searchTerm}
                  searchResultsUrl={searchResultsUrl}
                  onNavigate={clearSearch}
                  night={night}
                />
              )}
            </div>

            <div className="hidden items-center gap-1.5 lg:flex">
              {user ? (
                <>
                  <NotificationBell tone={night ? 'night' : 'light'} />
                  <Dropdown
                    align="right"
                    width="w-60"
                    trigger={({ open, toggle }) => (
                      <button
                        type="button"
                        onClick={toggle}
                        className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition-all ${
                          night
                            ? open
                              ? 'border-orange-400/40 bg-orange-500/15'
                              : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
                            : open
                              ? 'border-orange-200 bg-orange-50/80'
                              : 'border-warm-200/80 bg-cream-50 hover:border-warm-300 hover:bg-white'
                        }`}
                        aria-label="Profil menüsü"
                        aria-expanded={open}
                      >
                        <Avatar src={avatarUrl} name={displayName} size="sm" />
                        <span
                          className={`hidden max-w-[5.5rem] truncate text-xs font-semibold xl:inline ${
                            night ? 'text-white/90' : 'text-warm-800'
                          }`}
                        >
                          {displayName}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${night ? 'text-white/45' : 'text-warm-400'} ${open ? 'rotate-180' : ''}`}
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

            <div className="flex items-center gap-1 lg:hidden">
              {user && <NotificationBell tone={night ? 'night' : 'light'} />}
              <button
                type="button"
                onClick={() => (mobileMenuOpen ? setMobileMenuOpen(false) : openMobileMenu())}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  mobileMenuOpen
                    ? night
                      ? 'border-orange-400/40 bg-orange-500/15 text-orange-200'
                      : 'border-orange-200 bg-orange-50 text-orange-700'
                    : night
                      ? 'border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]'
                      : 'border-warm-200/80 bg-cream-50 text-warm-700 hover:bg-white'
                }`}
                aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div aria-hidden className="header-spacer" style={{ height: 'var(--app-header-offset)' }} />
      )}

      <MobileNavMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
        search={
          <div className="relative" ref={searchRef}>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-warm-400"
              size={18}
              aria-hidden
            />
            <input
              type="search"
              placeholder="Oyun ara…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              className="mobile-nav-search-input"
              aria-label="Oyun ara"
            />
            {searchFocused && (
              <GameSearchDropdown
                games={filteredGames}
                searchTerm={searchTerm}
                searchResultsUrl={searchResultsUrl}
                night={night}
                onNavigate={() => {
                  clearSearch();
                  setMobileMenuOpen(false);
                }}
              />
            )}
          </div>
        }
        footer={
          user ? (
            <Link
              to="/profil"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-user-card"
            >
              <Avatar src={avatarUrl} name={displayName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-warm-900">{displayName}</p>
                <p className="truncate text-xs text-warm-500">Profilim ve ayarlar</p>
              </div>
              <ChevronRight size={18} className="shrink-0 text-warm-400" aria-hidden />
            </Link>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-auth-btn"
            >
              Giriş Yap / Kayıt Ol
            </Link>
          )
        }
      />
    </>
  );
}

export default Header;
