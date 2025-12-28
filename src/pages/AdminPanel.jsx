import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Eye, MessageCircle, ThumbsUp, Star, TrendingUp, Users, BarChart3, Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { supabase } from '../lib/supabase';

function AdminPanel() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [games, setGames] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'games' or 'comments'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'views', 'rating', 'id', 'category', 'comments'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [selectedGames, setSelectedGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalViews: 0,
    totalComments: 0,
    avgRating: 0
  });
  const [sortedGames, setSortedGames] = useState([]);
  
  // Admin credentials (gerçek projede backend'de olmalı)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    // Check if already logged in
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGames = async () => {
    setLoading(true);
    try {
      // Supabase'den oyunları çek
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      // Format games
      const formattedGames = data.map(g => ({
        id: g.id,
        slug: g.slug,
        name: g.name,
        category: g.category,
        players: g.players,
        difficulty: g.difficulty,
        image: g.image,
        shortDescription: g.short_description,
        description: g.description,
        rules: g.rules,
        tips: g.tips
      }));
      
      setGames(formattedGames);
      
      // Stats hesapla
      await calculateStats(formattedGames);
      
      // SortedGames'i de yükle
      const gamesWithStats = await loadGamesWithStats(formattedGames);
      setSortedGames(gamesWithStats);
    } catch (error) {
      console.error('Error loading games from Supabase:', error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async (gamesList) => {
    try {
      // Toplam view sayısı
      const { data: viewsData, error: viewsError } = await supabase
        .from('game_views')
        .select('view_count');
      
      if (viewsError) {
        console.error('Error fetching views:', viewsError);
      }
      
      console.log('Views data from Supabase:', viewsData);
      
      const totalViews = viewsData?.reduce((sum, v) => sum + (v.view_count || 0), 0) || 0;
      
      // Toplam yorum sayısı ve ortalama rating
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('rating');
      
      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
      }
      
      const totalComments = commentsData?.length || 0;
      const avgRating = totalComments > 0
        ? commentsData.reduce((sum, c) => sum + c.rating, 0) / totalComments
        : 0;
      
      console.log('Stats calculated:', {
        totalGames: gamesList.length,
        totalViews,
        totalComments,
        avgRating: avgRating.toFixed(1)
      });
      
      setStats({
        totalGames: gamesList.length,
        totalViews: totalViews,
        totalComments: totalComments,
        avgRating: avgRating.toFixed(1)
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
      setStats({
        totalGames: gamesList.length,
        totalViews: 0,
        totalComments: 0,
        avgRating: 0
      });
    }
  };

  const loadGamesWithStats = async (gamesList) => {
    const gamesWithStats = await Promise.all(
      gamesList.map(async (game) => {
        try {
          // Get view count
          const { data: viewData } = await supabase
            .from('game_views')
            .select('view_count')
            .eq('game_id', game.id)
            .single();
          
          // Get comments
          const { data: commentsData } = await supabase
            .from('comments')
            .select('rating')
            .eq('game_id', game.id);
          
          const views = viewData?.view_count || 0;
          const comments = commentsData || [];
          const rating = comments.length > 0 
            ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length 
            : 0;
          
          return { ...game, views, commentCount: comments.length, rating };
        } catch (error) {
          console.error(`Error loading stats for game ${game.id}:`, error);
          return { ...game, views: 0, commentCount: 0, rating: 0 };
        }
      })
    );
    
    return gamesWithStats;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      loadGames();
      setError('');
    } else {
      setError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setUsername('');
    setPassword('');
  };

  const handleDeleteGame = (id) => {
    if (window.confirm('Bu oyunu silmek istediğinizden emin misiniz?')) {
      const updatedGames = games.filter(g => g.id !== id);
      setGames(updatedGames);
      localStorage.setItem('gamesData', JSON.stringify(updatedGames));
    }
  };

  const handleSaveGame = (gameData) => {
    let updatedGames;
    if (editingGame) {
      // Edit existing game
      updatedGames = games.map(g => g.id === editingGame.id ? { ...gameData, id: editingGame.id } : g);
    } else {
      // Add new game
      const newId = games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1;
      updatedGames = [...games, { ...gameData, id: newId }];
    }
    setGames(updatedGames);
    localStorage.setItem('gamesData', JSON.stringify(updatedGames));
    setShowAddModal(false);
    setEditingGame(null);
  };

  const handleBulkDelete = () => {
    if (selectedGames.length === 0) return;
    if (window.confirm(`Seçili ${selectedGames.length} oyunu silmek istediğinizden emin misiniz?`)) {
      const updatedGames = games.filter(g => !selectedGames.includes(g.id));
      setGames(updatedGames);
      localStorage.setItem('gamesData', JSON.stringify(updatedGames));
      setSelectedGames([]);
    }
  };

  const handleExportData = () => {
    const exportData = {
      games: games,
      comments: {},
      views: {}
    };
    
    games.forEach(game => {
      const comments = localStorage.getItem(`comments_${game.id}`);
      const views = localStorage.getItem(`views_${game.id}`);
      if (comments) exportData.comments[game.id] = JSON.parse(comments);
      if (views) exportData.views[game.id] = parseInt(views);
    });

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `oyunlar-yedek-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  useEffect(() => {
    if (games.length > 0) {
      loadSortedGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games, sortBy, sortDirection]);

  const loadSortedGames = async () => {
    const sorted = await getFilteredAndSortedGames();
    setSortedGames(sorted);
  };

  const getFilteredAndSortedGames = async () => {
    // Get games with stats from Supabase
    const gamesWithStats = await loadGamesWithStats(games);
    
    return gamesWithStats.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name, 'tr');
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category, 'tr');
      } else if (sortBy === 'views') {
        comparison = a.views - b.views;
      } else if (sortBy === 'rating') {
        comparison = a.rating - b.rating;
      } else if (sortBy === 'comments') {
        comparison = a.commentCount - b.commentCount;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Yönetim paneline giriş yapın</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Kullanıcı adınızı girin"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Şifrenizi girin"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all"
            >
              Giriş Yap
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo: admin / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Oyun Yönetimi</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <Eye size={20} />
                <span>Siteyi Görüntüle</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={20} />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'dashboard'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 size={18} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'games'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Oyunlar ({games.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'comments'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageCircle size={18} />
              <span>Yorumlar</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'analytics'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp size={18} />
              <span>Analytics</span>
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalGames || 0}</div>
                <div className="text-sm text-gray-600">Toplam Oyun</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Eye className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{(stats.totalViews || 0).toLocaleString('tr-TR')}</div>
                <div className="text-sm text-gray-600">Toplam Görüntülenme</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MessageCircle className="text-purple-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalComments || 0}</div>
                <div className="text-sm text-gray-600">Toplam Yorum</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="text-yellow-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.avgRating || '0.0'}</div>
                <div className="text-sm text-gray-600">Ortalama Puan</div>
              </div>
            </div>

            {/* Top Games */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp size={20} className="mr-2 text-green-600" />
                  En Çok Görüntülenen Oyunlar
                </h3>
                <div className="space-y-3">
                  {sortedGames
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5)
                    .map((game, index) => (
                      <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          <img src={game.image} alt={game.name} className="w-12 h-12 object-cover rounded" />
                          <div>
                            <div className="font-semibold text-gray-900">{game.name}</div>
                            <div className="text-sm text-gray-500">{game.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-green-600 font-semibold">
                          <Eye size={16} />
                          <span>{(game.views || 0).toLocaleString('tr-TR')}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Star size={20} className="mr-2 text-yellow-600" />
                  En Yüksek Puanlı Oyunlar
                </h3>
                <div className="space-y-3">
                  {sortedGames
                    .filter(game => game.commentCount > 0)
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 5)
                    .map((game, index) => (
                      <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          <img src={game.image} alt={game.name} className="w-12 h-12 object-cover rounded" />
                          <div>
                            <div className="font-semibold text-gray-900">{game.name}</div>
                            <div className="text-sm text-gray-500">{game.commentCount || 0} yorum</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-600 font-semibold">
                          <Star size={16} className="fill-yellow-600" />
                          <span>{(game.rating || 0).toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <>
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Oyunlar</h2>
                <p className="text-gray-600">Toplam {games.length} oyun</p>
              </div>
              <div className="flex items-center space-x-3">
                {selectedGames.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                    <span>Seçilileri Sil ({selectedGames.length})</span>
                  </button>
                )}
                <button
                  onClick={handleExportData}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download size={18} />
                  <span>Verileri İndir</span>
                </button>
                <button
                  onClick={() => {
                    setEditingGame(null);
                    setShowAddModal(true);
                  }}
                  className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus size={20} />
                  <span>Yeni Oyun Ekle</span>
                </button>
              </div>
            </div>

            {/* Games Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedGames.length === getFilteredAndSortedGames().length && getFilteredAndSortedGames().length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGames(getFilteredAndSortedGames().map(g => g.id));
                            } else {
                              setSelectedGames([]);
                            }
                          }}
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('id')}
                          className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                        >
                          <span>ID</span>
                          {sortBy === 'id' ? (
                            sortDirection === 'asc' ? <ArrowUp size={16} className="text-orange-600" /> : <ArrowDown size={16} className="text-orange-600" />
                          ) : (
                            <ArrowUpDown size={16} className="text-gray-400 group-hover:text-orange-600" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Görsel</th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                        >
                          <span>Oyun Adı</span>
                          {sortBy === 'name' ? (
                            sortDirection === 'asc' ? <ArrowUp size={16} className="text-orange-600" /> : <ArrowDown size={16} className="text-orange-600" />
                          ) : (
                            <ArrowUpDown size={16} className="text-gray-400 group-hover:text-orange-600" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('category')}
                          className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                        >
                          <span>Kategori</span>
                          {sortBy === 'category' ? (
                            sortDirection === 'asc' ? <ArrowUp size={16} className="text-orange-600" /> : <ArrowDown size={16} className="text-orange-600" />
                          ) : (
                            <ArrowUpDown size={16} className="text-gray-400 group-hover:text-orange-600" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('rating')}
                          className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                        >
                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                          <span>Puan</span>
                          {sortBy === 'rating' ? (
                            sortDirection === 'asc' ? <ArrowUp size={16} className="text-orange-600" /> : <ArrowDown size={16} className="text-orange-600" />
                          ) : (
                            <ArrowUpDown size={16} className="text-gray-400 group-hover:text-orange-600" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('comments')}
                          className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                        >
                          <MessageCircle size={16} className="text-blue-500" />
                          <span>Yorum</span>
                          {sortBy === 'comments' ? (
                            sortDirection === 'asc' ? <ArrowUp size={16} className="text-orange-600" /> : <ArrowDown size={16} className="text-orange-600" />
                          ) : (
                            <ArrowUpDown size={16} className="text-gray-400 group-hover:text-orange-600" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('views')}
                          className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
                        >
                          <Eye size={16} className="text-green-500" />
                          <span>Görüntülenme</span>
                          {sortBy === 'views' ? (
                            sortDirection === 'asc' ? <ArrowUp size={16} className="text-orange-600" /> : <ArrowDown size={16} className="text-orange-600" />
                          ) : (
                            <ArrowUpDown size={16} className="text-gray-400 group-hover:text-orange-600" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedGames.map((game) => {
                      return (
                        <tr key={game.id} className="hover:bg-orange-50/30 transition-all duration-200 group">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedGames.includes(game.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGames([...selectedGames, game.id]);
                                } else {
                                  setSelectedGames(selectedGames.filter(id => id !== game.id));
                                }
                              }}
                              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 group-hover:bg-orange-100 text-gray-700 group-hover:text-orange-700 rounded-lg font-semibold text-sm transition-colors">
                              {game.id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <img 
                              src={game.image} 
                              alt={game.name}
                              className="w-20 h-14 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{game.name}</div>
                            <div className="text-sm text-gray-500">{game.players}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
                              {game.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {game.rating > 0 ? (
                              <div className="flex items-center space-x-1">
                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                <span className="font-semibold text-gray-900">{game.rating.toFixed(1)}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <MessageCircle size={14} className="text-blue-500" />
                              <span className="font-semibold text-blue-600">{game.commentCount || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Eye size={14} className="text-green-500" />
                              <span className="font-semibold text-green-600">{(game.views || 0).toLocaleString('tr-TR')}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingGame(game);
                                  setShowAddModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:scale-110"
                                title="Düzenle"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteGame(game.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-110"
                                title="Sil"
                              >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
              </div>
            </div>
          </>
        )}
        
        {/* Comments Tab */}
        {activeTab === 'comments' && <CommentsManager games={games} />}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsDashboard games={games} />}
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <GameModal
          game={editingGame}
          onSave={handleSaveGame}
          onClose={() => {
            setShowAddModal(false);
            setEditingGame(null);
          }}
        />
      )}
    </div>
  );
}

// Game Modal Component
function GameModal({ game, onSave, onClose }) {
  const [formData, setFormData] = useState(game || {
    name: '',
    category: 'Dış Mekan',
    players: '',
    difficulty: 'Kolay',
    image: '',
    shortDescription: '',
    description: '',
    rules: [''],
    tips: ['']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const handleTipChange = (index, value) => {
    const newTips = [...formData.tips];
    newTips[index] = value;
    setFormData({ ...formData, tips: newTips });
  };

  const addRule = () => {
    setFormData({ ...formData, rules: [...formData.rules, ''] });
  };

  const addTip = () => {
    setFormData({ ...formData, tips: [...formData.tips, ''] });
  };

  const removeRule = (index) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData({ ...formData, rules: newRules });
  };

  const removeTip = (index) => {
    const newTips = formData.tips.filter((_, i) => i !== index);
    setFormData({ ...formData, tips: newTips });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {game ? 'Oyunu Düzenle' : 'Yeni Oyun Ekle'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Oyun Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              >
                <option value="Dış Mekan">Dış Mekan</option>
                <option value="İç Mekan">İç Mekan</option>
                <option value="İç Mekan / Dış Mekan">İç Mekan / Dış Mekan</option>
                <option value="Masa Oyunları">Masa Oyunları</option>
                <option value="Kağıt Oyunları">Kağıt Oyunları</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Oyuncu Sayısı *</label>
              <input
                type="text"
                value={formData.players}
                onChange={(e) => setFormData({ ...formData, players: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Örn: 3+ kişi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zorluk *</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              >
                <option value="Kolay">Kolay</option>
                <option value="Orta">Orta</option>
                <option value="Zor">Zor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL *</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-2 w-32 h-24 object-cover rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kısa Açıklama *</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detaylı Açıklama *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              rows="4"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Oyun Kuralları *</label>
              <button type="button" onClick={addRule} className="text-orange-600 text-sm hover:text-orange-700">
                + Kural Ekle
              </button>
            </div>
            <div className="space-y-2">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder={`Kural ${index + 1}`}
                    required
                  />
                  {formData.rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">İpuçları *</label>
              <button type="button" onClick={addTip} className="text-orange-600 text-sm hover:text-orange-700">
                + İpucu Ekle
              </button>
            </div>
            <div className="space-y-2">
              {formData.tips.map((tip, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => handleTipChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder={`İpucu ${index + 1}`}
                    required
                  />
                  {formData.tips.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTip(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {game ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Comments Manager Component
function CommentsManager({ games }) {
  const [allComments, setAllComments] = useState([]);
  const [selectedGame, setSelectedGame] = useState('all');
  const [loading, setLoading] = useState(true);

  const countReplies = (replies) => {
    let count = replies.length;
    replies.forEach(reply => {
      if (reply.replies && reply.replies.length > 0) {
        count += countReplies(reply.replies);
      }
    });
    return count;
  };

  const loadAllComments = async () => {
    setLoading(true);
    try {
      // Supabase'den tüm yorumları çek
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format comments with game info
      const formattedComments = data.map(comment => {
        const game = games.find(g => g.id === comment.game_id);
        return {
          id: comment.id,
          name: comment.author_name,
          comment: comment.content,
          rating: comment.rating,
          likes: comment.likes || 0,
          replies: comment.replies || [],
          isTestimonial: comment.is_testimonial || false,
          date: new Date(comment.created_at).toLocaleDateString('tr-TR'),
          gameId: comment.game_id,
          gameName: game?.name || 'Bilinmeyen Oyun',
          totalReplies: countReplies(comment.replies || [])
        };
      });
      
      setAllComments(formattedComments);
    } catch (error) {
      console.error('Error loading comments from Supabase:', error);
      setAllComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (games.length > 0) {
      loadAllComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games]);

  const handleDeleteComment = async (commentId, gameId) => {
    if (window.confirm('Bu yorumu ve tüm yanıtlarını silmek istediğinizden emin misiniz?')) {
      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', commentId);
        
        if (error) throw error;
        
        loadAllComments();
      } catch (error) {
        console.error('Error deleting comment from Supabase:', error);
      }
    }
  };

  const handleDeleteReply = async (commentId, replyId, gameId) => {
    if (window.confirm('Bu yanıtı silmek istediğinizden emin misiniz?')) {
      try {
        // Get the comment
        const { data: comment, error: fetchError } = await supabase
          .from('comments')
          .select('replies')
          .eq('id', commentId)
          .single();
        
        if (fetchError) throw fetchError;
        
        const deleteReplyRecursive = (replies) => {
          return replies.filter(r => {
            if (r.id === replyId) return false;
            if (r.replies && r.replies.length > 0) {
              r.replies = deleteReplyRecursive(r.replies);
            }
            return true;
          });
        };
        
        const updatedReplies = deleteReplyRecursive(comment.replies || []);
        
        const { error: updateError } = await supabase
          .from('comments')
          .update({ replies: updatedReplies })
          .eq('id', commentId);
        
        if (updateError) throw updateError;
        
        loadAllComments();
      } catch (error) {
        console.error('Error deleting reply from Supabase:', error);
      }
    }
  };

  const handleToggleTestimonial = async (commentId, gameId, isTestimonial) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_testimonial: isTestimonial })
        .eq('id', commentId);
      
      if (error) throw error;
      
      loadAllComments();
    } catch (error) {
      console.error('Error updating testimonial in Supabase:', error);
    }
  };

  const handleDeleteAllGameComments = async (gameId) => {
    if (window.confirm('Bu oyunun tüm yorumlarını silmek istediğinizden emin misiniz?')) {
      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('game_id', gameId);
        
        if (error) throw error;
        
        loadAllComments();
      } catch (error) {
        console.error('Error deleting game comments from Supabase:', error);
      }
    }
  };

  const filteredComments = selectedGame === 'all' 
    ? allComments 
    : allComments.filter(c => c.gameId === parseInt(selectedGame));

  const getCommentCountByGame = (gameId) => {
    return allComments.filter(c => c.gameId === gameId).length;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Yorumlar</h2>
          <p className="text-gray-600">Toplam {allComments.length} yorum</p>
        </div>
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option value="all">Tüm Oyunlar ({allComments.length})</option>
          {games.map(game => {
            const count = getCommentCountByGame(game.id);
            return count > 0 ? (
              <option key={game.id} value={game.id}>
                {game.name} ({count})
              </option>
            ) : null;
          })}
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Yorumlar yükleniyor...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Henüz yorum yok</p>
            </div>
          ) : (
          filteredComments.map(comment => (
            <div key={`${comment.gameId}-${comment.id}`} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-semibold text-gray-900">{comment.name}</span>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-orange-600 font-medium mb-2">{comment.gameName}</p>
                  <p className="text-gray-700">{comment.comment}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="text-sm text-gray-500 flex items-center">
                      <ThumbsUp size={14} className="mr-1" />
                      {comment.likes} beğeni
                    </span>
                    {comment.totalReplies > 0 && (
                      <span className="text-sm text-gray-500 flex items-center">
                        <MessageCircle size={14} className="mr-1" />
                        {comment.totalReplies} yanıt
                      </span>
                    )}
                    {comment.isTestimonial && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ★ Ana Sayfada Gösteriliyor
                      </span>
                    )}
                  </div>

                  {/* Display Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <ReplyDisplay 
                          key={reply.id}
                          reply={reply}
                          commentId={comment.id}
                          gameId={comment.gameId}
                          onDelete={handleDeleteReply}
                          depth={0}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleToggleTestimonial(comment.id, comment.gameId, !comment.isTestimonial)}
                    className={`p-2 rounded-lg transition-colors ${
                      comment.isTestimonial 
                        ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title={comment.isTestimonial ? 'Ana Sayfadan Kaldır' : 'Ana Sayfada Göster'}
                  >
                    <Star size={18} className={comment.isTestimonial ? 'fill-green-600' : ''} />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id, comment.gameId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Yorumu Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      )}
    </div>
  );
}

// Reply Display Component for Admin
function ReplyDisplay({ reply, commentId, gameId, onDelete, depth }) {
  return (
    <div className={`space-y-3 ${depth > 0 ? 'ml-6' : ''}`}>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-gray-900 text-sm">{reply.name}</span>
              <span className="text-xs text-gray-500">{reply.date} {reply.time}</span>
            </div>
            <p className="text-gray-700 text-sm">{reply.text}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs text-gray-500 flex items-center">
                <ThumbsUp size={12} className="mr-1" />
                {reply.likes || 0} beğeni
              </span>
            </div>
          </div>
          <button
            onClick={() => onDelete(commentId, reply.id, gameId)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Yanıtı Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Nested Replies */}
      {reply.replies && reply.replies.length > 0 && (
        <div className="space-y-3">
          {reply.replies.map((nestedReply) => (
            <ReplyDisplay
              key={nestedReply.id}
              reply={nestedReply}
              commentId={commentId}
              gameId={gameId}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
