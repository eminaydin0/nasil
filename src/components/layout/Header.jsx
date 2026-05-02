import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';

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
  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (to, exact) => {
    if (exact) return pathname === to;
    if (to === '/oyunlar') return pathname === '/oyunlar' || pathname.startsWith('/oyun/') || pathname.startsWith('/kategori/');
    if (to === '/araclar') return pathname === '/araclar' || pathname.startsWith('/araclar/');
    return pathname.startsWith(to);
  };

  const navLinkClass = (to, exact) => {
    const active = isActive(to, exact);
    const base = 'px-3 py-1.5 rounded-lg transition-all text-sm font-semibold tracking-wide';
    return active
      ? `${base} text-white bg-gradient-to-r from-orange-500 to-red-600`
      : `${base} text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600`;
  };

  const mobileNavLinkClass = (to, exact) => {
    const active = isActive(to, exact);
    const base = 'block px-3 py-2 text-sm rounded-lg transition-all font-semibold';
    return active
      ? `${base} text-white bg-gradient-to-r from-orange-500 to-red-600`
      : `${base} text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600`;
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
      
      // Format data
      const formattedGames = (data || []).map(game => ({
        id: game.id,
        slug: game.slug,
        name: game.name,
        category: game.category,
        shortDescription: game.short_description,
        image: game.image
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

  const filteredGames = games.filter(game =>
    searchTerm && (
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (game.shortDescription && game.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  ).slice(0, 5);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group" aria-label="Nasıl Oynanır - Ana Sayfa">
            <img
              src="/logo.svg"
              alt="Nasıl Oynanır"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              width="36"
              height="48"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(({ to, label, exact }) => (
              <Link key={to} to={to} className={navLinkClass(to, exact)}>
                {label}
              </Link>
            ))}
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-56 pl-10 pr-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
              />
              
              {/* Search Dropdown */}
              {searchFocused && searchTerm && filteredGames.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  {filteredGames.map(game => (
                    <a
                      key={game.id}
                      href={`/oyun/${game.slug}`}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setSearchFocused(false);
                        setSearchTerm('');
                      }}
                    >
                      <img src={game.image} alt={game.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{game.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{game.shortDescription}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu - Desktop */}
            {user ? (
                <Link 
                  to="/profil" 
                  className={`w-9 h-9 flex items-center justify-center rounded-full overflow-hidden border shadow-sm transition-colors ${
                    pathname === '/profil' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 border-orange-500 text-white ring-2 ring-orange-200' 
                      : 'bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200'
                  }`}
                  title="Profilim"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profil" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="font-bold text-sm">
                      {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </Link>
            ) : (
              <Link 
                to="/auth" 
                className={`px-4 py-1.5 rounded-lg transition-all text-sm font-medium shadow-sm ${
                  pathname === '/auth'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Giriş Yap
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-orange-600 transition-colors p-2 hover:bg-orange-50 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-3 space-y-2 border-t border-orange-100 pt-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-10 pr-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
              />
              
              {/* Mobile Search Dropdown */}
              {searchFocused && searchTerm && filteredGames.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  {filteredGames.map(game => (
                    <a
                      key={game.id}
                      href={`/oyun/${game.slug}`}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setSearchFocused(false);
                        setSearchTerm('');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <img src={game.image} alt={game.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{game.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{game.shortDescription}</p>
                      </div>
                    </a>
                  ))}
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
             
            {/* User Menu - Mobile */}
            {user ? (
              <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between px-3 py-2 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Bildirimler</span>
                  <NotificationBell />
                </div>
                <Link
                  to="/profil"
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-semibold ${
                    pathname === '/profil'
                      ? 'text-white bg-gradient-to-r from-orange-500 to-red-600'
                      : 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profil" 
                      className="w-5 h-5 rounded-full object-cover border border-orange-200" 
                    />
                  ) : (
                    <User size={18} />
                  )}
                  Profilim ({user.user_metadata?.full_name || user.email?.split('@')[0]})
                </Link>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`block text-center mt-4 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  pathname === '/auth'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
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
