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
  { to: '/araclar', label: 'Araçlar', exact: false },
  { to: '/hakkimizda', label: 'Hakkımızda', exact: true },
  { to: '/iletisim', label: 'İletişim', exact: true },
];

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

  const isActive = (to, exact) => {
    if (exact) return pathname === to;
    if (to === '/oyunlar')
      return (
        pathname === '/oyunlar' ||
        pathname.startsWith('/oyun/') ||
        pathname.startsWith('/kategori/')
      );
    if (to === '/araclar') return pathname === '/araclar' || pathname.startsWith('/araclar/');
    return pathname.startsWith(to);
  };

  const navLinkClass = (to, exact) => {
    const active = isActive(to, exact);
    const base =
      'px-3.5 py-2 rounded-xl transition-all text-sm font-semibold tracking-wide';
    return active
      ? `${base} text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-warm-glow`
      : `${base} text-warm-700 hover:bg-warm-100 hover:text-charcoal-900`;
  };

  const mobileNavLinkClass = (to, exact) => {
    const active = isActive(to, exact);
    const base =
      'block px-3.5 py-2.5 text-sm rounded-xl transition-all font-semibold';
    return active
      ? `${base} text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-warm-glow`
      : `${base} text-warm-700 hover:bg-warm-100 hover:text-charcoal-900`;
  };

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('id, slug, name, category, short_description, image');

      if (error) throw error;

      const formattedGames = (data || []).map((game) => ({
        id: game.id,
        slug: game.slug,
        name: game.name,
        category: game.category,
        shortDescription: game.short_description,
        image: game.image,
      }));

      setGames(formattedGames);
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

  // Route degistiginde mobil menuyu kapat
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
      setSearchFocused(false);
      setSearchTerm('');
    }
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

  return (
    <header className="sticky top-0 z-50 border-b border-warm-200/60 bg-cream-50/85 backdrop-blur-md font-sans">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="group flex items-center" aria-label="Kuralı Ne? - Ana Sayfa">
            <img
              src="/logo.svg"
              alt="Kuralı Ne?"
              className="h-14 w-auto object-contain transition-transform duration-300 ease-spring group-hover:scale-105 md:h-16"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              width="48"
              height="64"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-2 md:flex">
            {navItems.map(({ to, label, exact }) => (
              <Link key={to} to={to} className={navLinkClass(to, exact)}>
                {label}
              </Link>
            ))}

            {/* Search */}
            <div className="relative ml-1" ref={searchRef}>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                className="w-56 rounded-xl border border-warm-200 bg-white py-2 pl-9 pr-3 text-sm text-charcoal-900 placeholder-warm-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
              />

              {searchFocused && searchTerm && (
                <div className="absolute top-full z-50 mt-2 w-72 animate-fade-up overflow-hidden rounded-2xl border border-warm-200/60 bg-white p-1.5 shadow-soft-xl ring-1 ring-charcoal-900/5">
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                      <a
                        key={game.id}
                        href={`/oyun/${game.slug}`}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-cream-100"
                        onClick={() => {
                          setSearchFocused(false);
                          setSearchTerm('');
                        }}
                      >
                        <img
                          src={game.image}
                          alt={game.name}
                          loading="lazy"
                          className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-warm-200/60"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold text-charcoal-900">
                            {game.name}
                          </h4>
                          <p className="truncate text-xs text-warm-500">
                            {game.shortDescription}
                          </p>
                        </div>
                      </a>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-xs text-warm-500">Eşleşen oyun bulunamadı</p>
                  )}
                  {searchResultsUrl && (
                    <Link
                      to={searchResultsUrl}
                      className="mt-1 block rounded-xl border-t border-warm-100 px-3 py-2.5 text-center text-xs font-bold text-orange-600 transition-colors hover:bg-orange-50"
                      onClick={() => {
                        setSearchFocused(false);
                        setSearchTerm('');
                      }}
                    >
                      Tüm sonuçları gör
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Auth area */}
            {user ? (
              <div className="ml-1 flex items-center gap-1">
                <NotificationBell />
                <Dropdown
                  align="right"
                  width="w-64"
                  trigger={({ open, toggle }) => (
                    <button
                      type="button"
                      onClick={toggle}
                      className={`group flex items-center gap-2 rounded-xl border py-1 pl-1 pr-2.5 transition-all ${
                        open
                          ? 'border-orange-300 bg-orange-50 shadow-warm-glow'
                          : 'border-warm-200 bg-white shadow-soft hover:border-warm-300'
                      }`}
                      aria-label="Profil menüsü"
                    >
                      <Avatar src={avatarUrl} name={displayName} size="sm" />
                      <span className="hidden max-w-[7rem] truncate text-xs font-bold text-charcoal-900 lg:inline">
                        {displayName}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-warm-500 transition-transform duration-200 ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                >
                  {({ close }) => (
                    <>
                      <div className="flex items-center gap-3 rounded-xl bg-cream-100 px-3 py-2.5">
                        <Avatar src={avatarUrl} name={displayName} size="md" />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-charcoal-900">
                            {displayName}
                          </div>
                          <div className="truncate text-xs text-warm-500">{user.email}</div>
                        </div>
                      </div>
                      <DropdownSeparator />
                      <DropdownLabel>Hesap</DropdownLabel>
                      <DropdownItem
                        as={Link}
                        to="/profil"
                        icon={UserIcon}
                        onClick={close}
                      >
                        Profilim
                      </DropdownItem>
                      <DropdownItem
                        as={Link}
                        to="/profil"
                        icon={Heart}
                        onClick={close}
                      >
                        Favorilerim
                      </DropdownItem>
                      <DropdownItem
                        as={Link}
                        to="/profil"
                        icon={Settings}
                        onClick={close}
                      >
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
              </div>
            ) : (
              <Link
                to="/auth"
                className="ml-1 inline-flex items-center gap-1.5 rounded-xl bg-charcoal-900 px-4 py-2 text-sm font-bold text-cream-50 shadow-soft transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:bg-charcoal-800"
              >
                Giriş Yap
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1 md:hidden">
            {user && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-warm-200 bg-white p-2 text-warm-700 shadow-soft transition-colors hover:bg-warm-50"
              aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 space-y-2 border-t border-warm-200/60 pb-3 pt-4 md:hidden">
            {/* Search */}
            <div className="relative mb-3">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                className="w-full rounded-xl border border-warm-200 bg-white py-2.5 pl-9 pr-3 text-sm text-charcoal-900 placeholder-warm-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
              {searchFocused && searchTerm && (
                <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-warm-200/60 bg-white p-1.5 shadow-soft-xl ring-1 ring-charcoal-900/5">
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                    <a
                      key={game.id}
                      href={`/oyun/${game.slug}`}
                      className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-cream-100"
                      onClick={() => {
                        setSearchFocused(false);
                        setSearchTerm('');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <img
                        src={game.image}
                        alt={game.name}
                        loading="lazy"
                        className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-warm-200/60"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-charcoal-900">
                          {game.name}
                        </h4>
                        <p className="truncate text-xs text-warm-500">
                          {game.shortDescription}
                        </p>
                      </div>
                    </a>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-xs text-warm-500">Eşleşen oyun bulunamadı</p>
                  )}
                  {searchResultsUrl && (
                    <Link
                      to={searchResultsUrl}
                      className="mt-1 block rounded-xl border-t border-warm-100 px-3 py-2.5 text-center text-xs font-bold text-orange-600 transition-colors hover:bg-orange-50"
                      onClick={() => {
                        setSearchFocused(false);
                        setSearchTerm('');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Tüm sonuçları gör
                    </Link>
                  )}
                </div>
              )}
            </div>

            {navItems.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                className={mobileNavLinkClass(to, exact)}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <div className="mt-3 space-y-2 border-t border-warm-200/60 pt-3">
                <Link
                  to="/profil"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    pathname === '/profil'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-warm-glow'
                      : 'bg-cream-100 hover:bg-warm-100'
                  }`}
                >
                  <Avatar src={avatarUrl} name={displayName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div
                      className={`truncate text-sm font-bold ${
                        pathname === '/profil' ? 'text-white' : 'text-charcoal-900'
                      }`}
                    >
                      {displayName}
                    </div>
                    <div
                      className={`truncate text-[11px] ${
                        pathname === '/profil' ? 'text-white/80' : 'text-warm-500'
                      }`}
                    >
                      Profilimi Görüntüle
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-100"
                >
                  <LogOut size={16} />
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 block rounded-xl bg-charcoal-900 px-3.5 py-2.5 text-center text-sm font-bold text-cream-50 transition-colors hover:bg-charcoal-800"
              >
                Giriş Yap / Kayıt Ol
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
