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

function GameSearchDropdown({ games, searchTerm, searchResultsUrl, onNavigate }) {
  if (!searchTerm) return null;

  return (
    <div className="absolute top-[calc(100%+6px)] z-[120] w-full overflow-hidden rounded-xl border border-warm-200/80 bg-white p-1 shadow-soft-xl">
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
          className="mt-0.5 block rounded-b-lg border-t border-warm-100 px-3 py-2.5 text-center text-xs font-semibold text-orange-600 hover:bg-orange-50"
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
  const [menuTop, setMenuTop] = useState(68);
  const [games, setGames] = useState([]);
  const headerRef = useRef(null);
  const searchRef = useRef(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const confirm = useConfirm();

  const syncHeaderMetrics = useCallback(() => {
    const el = headerRef.current;
    if (!el) return;
    document.documentElement.style.setProperty('--app-header-offset', `${el.offsetHeight}px`);
    if (mobileMenuOpen) {
      setMenuTop(el.getBoundingClientRect().bottom);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    loadGames();
  }, []);

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

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const onScrollOrResize = () => {
      if (headerRef.current) {
        setMenuTop(headerRef.current.getBoundingClientRect().bottom);
      }
    };
    onScrollOrResize();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [mobileMenuOpen]);

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
    if (headerRef.current) {
      setMenuTop(headerRef.current.getBoundingClientRect().bottom);
    }
    setMobileMenuOpen(true);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <>
      <header
        ref={headerRef}
        className="safe-area-top safe-area-x sticky top-0 z-50 border-b border-warm-200/80 bg-white/92 font-sans shadow-[0_1px_0_rgba(28,25,23,0.04),0_4px_24px_-4px_rgba(28,25,23,0.06)] backdrop-blur-lg"
      >
        <div className="container mx-auto flex h-[4.25rem] items-center gap-3 px-3 sm:px-4">
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

          <HeaderNavMenu pathname={pathname} />

          <div className="ml-auto flex shrink-0 items-center gap-2">
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
                className="w-40 rounded-full border border-warm-200/80 bg-cream-50 py-2 pl-9 pr-3 text-sm text-warm-900 placeholder:text-warm-400 transition-all focus:w-48 focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 xl:w-44 xl:focus:w-52"
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

            <div className="flex items-center gap-1 lg:hidden">
              {user && <NotificationBell />}
              <button
                type="button"
                onClick={() => (mobileMenuOpen ? setMobileMenuOpen(false) : openMobileMenu())}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-warm-200/80 bg-cream-50 text-warm-700 transition-colors hover:bg-white"
                aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNavMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        top={menuTop}
        pathname={pathname}
      >
        <div className="relative border-b border-warm-100 px-4 py-3" ref={searchRef}>
          <Search
            className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-warm-400"
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

        <div className="border-b border-warm-100 px-4 py-3">
          {user ? (
            <Link
              to="/profil"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-cream-50 px-3 py-2.5"
            >
              <Avatar src={avatarUrl} name={displayName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-warm-900">{displayName}</p>
                <p className="truncate text-xs text-warm-500">Profilim</p>
              </div>
            </Link>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl bg-orange-600 py-2.5 text-center text-sm font-semibold text-white"
            >
              Giriş Yap / Kayıt Ol
            </Link>
          )}
        </div>
      </MobileNavMenu>
    </>
  );
}

export default Header;
