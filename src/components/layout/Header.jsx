import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

function Header({ searchTerm, setSearchTerm }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [games, setGames] = useState([]);
  const searchRef = useRef(null);

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

  console.log('Search term:', searchTerm);
  console.log('Filtered games:', filteredGames);
  console.log('Search focused:', searchFocused);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-orange-100">
      <nav className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              NASIL <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">OYNANIR</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-4 py-2 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all text-sm font-bold uppercase tracking-wide">
              Ana Sayfa
            </Link>
            <a href="#oyunlar" className="px-4 py-2 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all text-sm font-bold uppercase tracking-wide">
              Oyunlar
            </a>
            <a href="#hakkinda" className="px-4 py-2 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all text-sm font-bold uppercase tracking-wide">
              Hakkında
            </a>
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
              />
              
              {/* Search Dropdown */}
              {searchFocused && searchTerm && filteredGames.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  {filteredGames.map(game => (
                    <a
                      key={game.id}
                      href={`/oyun/${game.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setSearchFocused(false);
                        setSearchTerm('');
                      }}
                    >
                      <img src={game.image} alt={game.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{game.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{game.shortDescription}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
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
          <div className="md:hidden mt-6 pb-4 space-y-2 border-t border-orange-100 pt-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
              />
              
              {/* Mobile Search Dropdown */}
              {searchFocused && searchTerm && filteredGames.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  {filteredGames.map(game => (
                    <a
                      key={game.id}
                      href={`/oyun/${game.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setSearchFocused(false);
                        setSearchTerm('');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <img src={game.image} alt={game.name} className="w-12 h-12 rounded-lg object-cover" />
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
              className="block px-4 py-3 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <a
              href="#oyunlar"
              className="block px-4 py-3 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Oyunlar
            </a>
            <a
              href="#hakkinda"
              className="block px-4 py-3 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 rounded-lg transition-all font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hakkında
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
