import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, MessageCircle, TrendingUp, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard';
import AdminLogin from '../../components/admin/AdminLogin';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminStats from '../../components/admin/AdminStats';
import TopGames from '../../components/admin/TopGames';
import GamesTable from '../../components/admin/GamesTable';
import GameModal from '../../components/admin/GameModal';
import CommentsManager from '../../components/admin/CommentsManager';
import CarouselManager from '../../components/admin/CarouselManager';
import { supabase } from '../../lib/supabase';
import { exportAnalyticsData } from '../../utils/analytics';

// Admin action tracking fonksiyonu
const trackAdminAction = (action, details) => {
  console.log(`[Admin Action] ${action}:`, details);
  // İsterseniz buraya analytics tracking ekleyebilirsiniz
};

function AdminPanel() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [games, setGames] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'games', 'comments', 'analytics', 'carousel'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'views', 'rating', 'id', 'category', 'comments'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [selectedGames, setSelectedGames] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalViews: 0,
    totalComments: 0,
    avgRating: 0
  });
  const [sortedGames, setSortedGames] = useState([]);

  useEffect(() => {
    // Check if already logged in
    const adminData = localStorage.getItem('adminData') || sessionStorage.getItem('adminData');
    if (adminData) {
      setIsAuthenticated(true);
      loadGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGames = async () => {
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadGames();
    trackAdminAction('login', 'Admin panel login successful');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminData');
    sessionStorage.removeItem('adminData');
    trackAdminAction('logout', 'Admin panel logout');
    toast.success('Başarıyla çıkış yaptınız!');
  };

  const handleDeleteGame = async (id) => {
    if (window.confirm('Bu oyunu silmek istediğinizden emin misiniz?')) {
      try {
        const { error } = await supabase
          .from('games')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        const updatedGames = games.filter(g => g.id !== id);
        setGames(updatedGames);
        trackAdminAction('delete_game', `Game ID: ${id}`);
        toast.success('Oyun başarıyla silindi!');
      } catch (error) {
        console.error('Error deleting game:', error);
        toast.error('Oyun silinirken hata oluştu!');
      }
    }
  };

  const handleSaveGame = async (gameData) => {
    try {
      if (editingGame) {
        // Edit existing game
        const { error } = await supabase
          .from('games')
          .update({
            slug: gameData.slug,
            name: gameData.name,
            category: gameData.category,
            players: gameData.players,
            difficulty: gameData.difficulty,
            image: gameData.image,
            short_description: gameData.shortDescription,
            description: gameData.description,
            rules: gameData.rules,
            tips: gameData.tips
          })
          .eq('id', editingGame.id);
        
        if (error) throw error;
        
        const updatedGames = games.map(g => g.id === editingGame.id ? { ...gameData, id: editingGame.id } : g);
        setGames(updatedGames);
      } else {
        // Add new game
        const { data, error } = await supabase
          .from('games')
          .insert([{
            slug: gameData.slug,
            name: gameData.name,
            category: gameData.category,
            players: gameData.players,
            difficulty: gameData.difficulty,
            image: gameData.image,
            short_description: gameData.shortDescription,
            description: gameData.description,
            rules: gameData.rules,
            tips: gameData.tips
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        const newGame = {
          id: data.id,
          slug: data.slug,
          name: data.name,
          category: data.category,
          players: data.players,
          difficulty: data.difficulty,
          image: data.image,
          shortDescription: data.short_description,
          description: data.description,
          rules: data.rules,
          tips: data.tips
        };
        setGames([...games, newGame]);
      }
      setShowAddModal(false);
      setEditingGame(null);
      loadGames();
      trackAdminAction(editingGame ? 'update_game' : 'add_game', `Game: ${gameData.name}`);
      toast.success(editingGame ? 'Oyun başarıyla güncellendi!' : 'Oyun başarıyla eklendi!');
    } catch (error) {
      console.error('Error saving game:', error);
      toast.error('Oyun kaydedilirken hata oluştu!');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedGames.length === 0) return;
    if (window.confirm(`Seçili ${selectedGames.length} oyunu silmek istediğinizden emin misiniz?`)) {
      try {
        const { error } = await supabase
          .from('games')
          .delete()
          .in('id', selectedGames);
        
        if (error) throw error;
        
        const updatedGames = games.filter(g => !selectedGames.includes(g.id));
        setGames(updatedGames);
        setSelectedGames([]);
        trackAdminAction('bulk_delete', `Deleted ${selectedGames.length} games`);
        toast.success(`${selectedGames.length} oyun başarıyla silindi!`);
      } catch (error) {
        console.error('Error deleting games:', error);
        toast.error('Oyunlar silinirken hata oluştu!');
      }
    }
  };

  const handleExportData = async () => {
    try {
      // Fetch all data from Supabase
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*');
      
      const { data: viewsData } = await supabase
        .from('game_views')
        .select('*');
      
      const exportData = {
        games: games,
        comments: {},
        views: {}
      };
      
      // Group comments by game_id
      commentsData?.forEach(comment => {
        if (!exportData.comments[comment.game_id]) {
          exportData.comments[comment.game_id] = [];
        }
        exportData.comments[comment.game_id].push(comment);
      });
      
      // Group views by game_id
      viewsData?.forEach(view => {
        exportData.views[view.game_id] = view.view_count;
      });

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `oyunlar-yedek-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      trackAdminAction('export_data', `Games and comments export`);
      toast.success('Veriler başarıyla dışa aktarıldı!', {
        icon: '💾',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Veriler dışa aktarılırken hata oluştu!');
    }
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
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        onLogout={handleLogout}
        onNavigateHome={() => navigate('/')}
      />

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
            <button
              onClick={() => setActiveTab('carousel')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'carousel'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Download size={18} className="rotate-180" />
              <span>Carousel</span>
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <AdminStats stats={stats} />
            <TopGames sortedGames={sortedGames} />
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <GamesTable
            games={games}
            sortedGames={sortedGames}
            selectedGames={selectedGames}
            setSelectedGames={setSelectedGames}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={(game) => {
              setEditingGame(game);
              setShowAddModal(true);
            }}
            onDelete={handleDeleteGame}
            onBulkDelete={handleBulkDelete}
            onExport={handleExportData}
            onAddNew={() => {
              setEditingGame(null);
              setShowAddModal(true);
            }}
          />
        )}
        
        {/* Comments Tab */}
        {activeTab === 'comments' && <CommentsManager games={games} />}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Actions */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Engagement Score</div>
                    <div className="text-xs text-gray-500">Kullanıcı etkileşim puanı</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(
                    Math.min(
                      ((stats.totalComments / Math.max(stats.totalViews, 1)) * 100 * 0.2) +
                      ((parseFloat(stats.avgRating || 0) / 5) * 30) +
                      (Math.min((stats.totalViews / 1000) * 30, 30)) +
                      (Math.min((stats.totalGames / 50) * 20, 20)),
                      100
                    )
                  )}/100
                </div>
              </div>
              <button
                onClick={() => {
                  exportAnalyticsData();
                  toast.success('Analytics verileri dışa aktarıldı!', { icon: '📊' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download size={18} />
                <span>Analytics İndir</span>
              </button>
            </div>
            
            <AnalyticsDashboard games={games} />
          </div>
        )}

        {activeTab === 'carousel' && (
          <CarouselManager />
        )}
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

export default AdminPanel;
