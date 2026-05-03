import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminLogin from '../../components/admin/AdminLogin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';
import GamesTable from '../../components/admin/GamesTable';
import GameModal from '../../components/admin/GameModal';
import CommentsManager from '../../components/admin/CommentsManager';
import CarouselManager from '../../components/admin/CarouselManager';
import GameOfTheDayManager from '../../components/admin/GameOfTheDayManager';
import ContentManager from '../../components/admin/ContentManager';
import ContactManager from '../../components/admin/ContactManager';
import UserManager from '../../components/admin/UserManager';
import CategoryManager from '../../components/admin/CategoryManager';
import AdminDashboardTab from '../../components/admin/tabs/AdminDashboardTab';
import AdminAnalyticsTab from '../../components/admin/tabs/AdminAnalyticsTab';
import { supabase } from '../../lib/supabase';
import { useCategories } from '../../hooks/useCategories';
import { useConfirm } from '../../components/ui';

const trackAdminAction = (action, details) => {
  if (import.meta.env.DEV) {
    console.log(`[Admin Action] ${action}:`, details);
  }
};

function AdminPanel() {
  const { categories: adminCategories } = useCategories();
  const confirm = useConfirm();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [games, setGames] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedGames, setSelectedGames] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalViews: 0,
    totalComments: 0,
    avgRating: 0,
  });
  const [sortedGames, setSortedGames] = useState([]);
  const [unreadContactCount, setUnreadContactCount] = useState(0);

  useEffect(() => {
    const adminData = localStorage.getItem('adminData') || sessionStorage.getItem('adminData');
    if (adminData) {
      setIsAuthenticated(true);
      loadGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unread contact count for badge
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadUnread = async () => {
      try {
        const { count } = await supabase
          .from('contact_messages')
          .select('id', { count: 'exact', head: true })
          .eq('is_read', false);
        setUnreadContactCount(count || 0);
      } catch (err) {
        console.error('Unread count error:', err);
      }
    };
    loadUnread();
    const interval = setInterval(loadUnread, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab]);

  const loadGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*, gallery:game_gallery_images(image_url)')
        .order('id', { ascending: true });

      if (error) throw error;

      const formattedGames = data.map((g) => ({
        id: g.id,
        slug: g.slug,
        name: g.name,
        category: g.category,
        players: g.players,
        difficulty: g.difficulty,
        image: g.image,
        gallery: g.gallery ? g.gallery.map((item) => item.image_url) : [],
        shortDescription: g.short_description,
        description: g.description,
        rules: g.rules,
        tips: g.tips,
        videoUrl: g.video_url || '',
        videoTitle: g.video_title || '',
        playTimeMinutes: g.play_time_minutes || '',
        faq: Array.isArray(g.faq) ? g.faq : [],
      }));

      setGames(formattedGames);

      await calculateStats(formattedGames);

      const gamesWithStats = await loadGamesWithStats(formattedGames);
      setSortedGames(gamesWithStats);
    } catch (error) {
      console.error('Error loading games from Supabase:', error);
      setGames([]);
    }
  };

  const calculateStats = async (gamesList) => {
    try {
      const [viewsRes, commentsRes] = await Promise.all([
        supabase.from('game_views').select('view_count'),
        supabase.from('comments').select('rating'),
      ]);

      const totalViews =
        viewsRes.data?.reduce((sum, v) => sum + (v.view_count || 0), 0) || 0;
      const totalComments = commentsRes.data?.length || 0;
      const avgRating =
        totalComments > 0
          ? commentsRes.data.reduce((sum, c) => sum + c.rating, 0) / totalComments
          : 0;

      setStats({
        totalGames: gamesList.length,
        totalViews,
        totalComments,
        avgRating: avgRating.toFixed(1),
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
      setStats({
        totalGames: gamesList.length,
        totalViews: 0,
        totalComments: 0,
        avgRating: 0,
      });
    }
  };

  // Tek sorguda tum oyunlarin view ve yorum istatistiklerini cek (N+1 fix)
  const loadGamesWithStats = async (gamesList) => {
    try {
      const ids = gamesList.map((g) => g.id);
      if (ids.length === 0) return gamesList;

      const [viewsRes, commentsRes] = await Promise.all([
        supabase.from('game_views').select('game_id, view_count').in('game_id', ids),
        supabase.from('comments').select('game_id, rating').in('game_id', ids),
      ]);

      const viewMap = new Map();
      (viewsRes.data || []).forEach((v) => {
        viewMap.set(v.game_id, v.view_count || 0);
      });

      const commentMap = new Map();
      (commentsRes.data || []).forEach((c) => {
        const arr = commentMap.get(c.game_id) || [];
        arr.push(c.rating);
        commentMap.set(c.game_id, arr);
      });

      return gamesList.map((g) => {
        const ratings = commentMap.get(g.id) || [];
        const rating =
          ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
        return {
          ...g,
          views: viewMap.get(g.id) || 0,
          commentCount: ratings.length,
          rating,
        };
      });
    } catch (error) {
      console.error('Error loading game stats:', error);
      return gamesList.map((g) => ({ ...g, views: 0, commentCount: 0, rating: 0 }));
    }
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
    const game = games.find((g) => g.id === id);
    const ok = await confirm({
      type: 'danger',
      title: 'Oyunu sil',
      description: game
        ? `"${game.name}" oyununu kalıcı olarak silmek üzeresiniz. Bu işlem geri alınamaz.`
        : 'Bu oyunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      confirmText: 'Evet, Sil',
      cancelText: 'Vazgeç',
    });
    if (!ok) return;
    try {
      const { error } = await supabase.from('games').delete().eq('id', id);
      if (error) throw error;
      const updatedGames = games.filter((g) => g.id !== id);
      setGames(updatedGames);
      trackAdminAction('delete_game', `Game ID: ${id}`);
      toast.success('Oyun başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting game:', error);
      toast.error('Oyun silinirken hata oluştu!');
    }
  };

  const handleSaveGame = async (gameData) => {
    try {
      let gameId;
      const seoFields = {
        video_url: gameData.videoUrl ?? null,
        video_title: gameData.videoTitle ?? null,
        play_time_minutes: gameData.playTimeMinutes ?? null,
        faq: Array.isArray(gameData.faq) ? gameData.faq : [],
      };

      if (editingGame) {
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
            tips: gameData.tips,
            ...seoFields,
          })
          .eq('id', editingGame.id);

        if (error) throw error;
        gameId = editingGame.id;
      } else {
        const { data, error } = await supabase
          .from('games')
          .insert([
            {
              slug: gameData.slug,
              name: gameData.name,
              category: gameData.category,
              players: gameData.players,
              difficulty: gameData.difficulty,
              image: gameData.image,
              short_description: gameData.shortDescription,
              description: gameData.description,
              rules: gameData.rules,
              tips: gameData.tips,
              ...seoFields,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        gameId = data.id;
      }

      if (gameData.gallery) {
        const { error: deleteError } = await supabase
          .from('game_gallery_images')
          .delete()
          .eq('game_id', gameId);

        if (deleteError) console.error('Error clearing gallery:', deleteError);

        if (gameData.gallery.length > 0) {
          const galleryInserts = gameData.gallery.map((url, index) => ({
            game_id: gameId,
            image_url: url,
            order_index: index,
          }));
          const { error: insertError } = await supabase
            .from('game_gallery_images')
            .insert(galleryInserts);
          if (insertError) console.error('Error inserting gallery:', insertError);
        }
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
    const ok = await confirm({
      type: 'danger',
      title: `${selectedGames.length} oyunu sil`,
      description: `Seçili ${selectedGames.length} oyun kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
      confirmText: 'Hepsini Sil',
      cancelText: 'Vazgeç',
      requireText: 'SIL',
    });
    if (!ok) return;
    try {
      const { error } = await supabase.from('games').delete().in('id', selectedGames);
      if (error) throw error;
      const updatedGames = games.filter((g) => !selectedGames.includes(g.id));
      setGames(updatedGames);
      const count = selectedGames.length;
      setSelectedGames([]);
      trackAdminAction('bulk_delete', `Deleted ${count} games`);
      toast.success(`${count} oyun başarıyla silindi!`);
    } catch (error) {
      console.error('Error deleting games:', error);
      toast.error('Oyunlar silinirken hata oluştu!');
    }
  };

  const handleExportData = async () => {
    try {
      const [commentsRes, viewsRes] = await Promise.all([
        supabase.from('comments').select('*'),
        supabase.from('game_views').select('*'),
      ]);

      const exportData = { games, comments: {}, views: {} };

      commentsRes.data?.forEach((comment) => {
        if (!exportData.comments[comment.game_id]) {
          exportData.comments[comment.game_id] = [];
        }
        exportData.comments[comment.game_id].push(comment);
      });

      viewsRes.data?.forEach((view) => {
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
      toast.success('Veriler başarıyla dışa aktarıldı!', { icon: '💾' });
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
    const gamesWithStats = await loadGamesWithStats(games);
    const sorted = gamesWithStats.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') comparison = a.id - b.id;
      else if (sortBy === 'name') comparison = a.name.localeCompare(b.name, 'tr');
      else if (sortBy === 'category') comparison = a.category.localeCompare(b.category, 'tr');
      else if (sortBy === 'views') comparison = a.views - b.views;
      else if (sortBy === 'rating') comparison = a.rating - b.rating;
      else if (sortBy === 'comments') comparison = a.commentCount - b.commentCount;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    setSortedGames(sorted);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-cream-50 font-sans text-charcoal-900">
      <div className="flex min-h-screen">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          gameCount={games.length}
          badges={{ contact: unreadContactCount }}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar
            activeTab={activeTab}
            onMenuClick={() => setSidebarOpen(true)}
            unreadCount={unreadContactCount}
          />

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-[1400px]">
              {activeTab === 'dashboard' && (
                <AdminDashboardTab
                  stats={stats}
                  sortedGames={sortedGames}
                  games={games}
                  onTabChange={setActiveTab}
                />
              )}

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

              {activeTab === 'comments' && <CommentsManager games={games} />}

              {activeTab === 'analytics' && (
                <AdminAnalyticsTab games={games} stats={stats} />
              )}

              {activeTab === 'carousel' && <CarouselManager games={games} />}
              {activeTab === 'gameoftheday' && <GameOfTheDayManager />}
              {activeTab === 'categories' && <CategoryManager />}
              {activeTab === 'content' && <ContentManager />}
              {activeTab === 'contact' && <ContactManager />}
              {activeTab === 'users' && <UserManager />}
            </div>
          </main>
        </div>
      </div>

      {showAddModal && (
        <GameModal
          game={editingGame}
          categories={adminCategories}
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
