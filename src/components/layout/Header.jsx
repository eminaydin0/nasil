import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [games, setGames] = useState([]);
  const searchRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-linear-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="text-xl font-black text-gray-900 tracking-tight leading-none">
              NASIL <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-600">OYNANIR</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className="px-3 py-1.5 text-gray-700 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all text-sm font-semibold tracking-wide">
              Ana Sayfa
            </Link>
            <Link to="/oyunlar" className="px-3 py-1.5 text-gray-700 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all text-sm font-semibold tracking-wide">
              Oyunlar
            </Link>
            <Link to="/araclar" className="px-3 py-1.5 text-gray-700 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all text-sm font-semibold tracking-wide">
              Araçlar
            </Link>
            <Link to="/hakkimizda" className="px-3 py-1.5 text-gray-700 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all text-sm font-semibold tracking-wide">
              Hakkımızda
            </Link>
            <Link to="/iletisim" className="px-3 py-1.5 text-gray-700 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all text-sm font-semibold tracking-wide">
              İletişim
            </Link>
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
                className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                title="Profilim"
              >
                <User size={18} />
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="px-4 py-1.5 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-all text-sm font-medium shadow-sm"
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
            <Link
              to="/"
              className="block px-3 py-2 text-sm text-gray-700 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/oyunlar"
              className="block px-3 py-2 text-sm text-gray-700 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Oyunlar
            </Link>
            <Link
              to="/araclar"
              className="block px-3 py-2 text-sm text-gray-700 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Araçlar
            </Link>
            <Link
              to="/hakkimizda"
              className="block px-3 py-2 text-sm text-gray-700 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              to="/iletisim"
              className="block px-3 py-2 text-sm text-gray-700 hover:text-white hover:bg-linear-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              İletişim
            </Link>
             
            {/* User Menu - Mobile */}
            {user ? (
              <Link
                to="/profil"
                className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 bg-orange-50 rounded-lg font-semibold mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                Profilim ({user.email})
              </Link>
            ) : (
              <Link
                to="/auth"
                className="block text-center mt-4 px-3 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium"
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
