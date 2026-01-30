import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ArrowRight, Loader2, Clock, PieChart, Gamepad2, Mail } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import AdminStats from '../AdminStats';
import TopGames from '../TopGames';

export default function AdminDashboardTab({ stats, sortedGames, games, onTabChange }) {
  const [recentComments, setRecentComments] = useState([]);
  const [topLikedComments, setTopLikedComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);
  const [contactLoading, setContactLoading] = useState(true);
  const [unreadContactCount, setUnreadContactCount] = useState(0);

  // Kategori dağılımı
  const categoryDistribution = games?.reduce((acc, g) => {
    const cat = g.category || 'Diğer';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {}) || {};

  const categoryList = Object.entries(categoryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const maxCategoryCount = Math.max(...Object.values(categoryDistribution), 1);

  // Son yorumlar ve en çok beğenilenleri çek
  useEffect(() => {
    const loadComments = async () => {
      setCommentsLoading(true);
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('id, author_name, content, rating, likes, created_at, game_id')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const gamesMap = (games || []).reduce((acc, g) => {
          acc[g.id] = g.name;
          return acc;
        }, {});

        const formatted = (data || []).map((c) => ({
          id: c.id,
          name: c.author_name,
          comment: c.content?.substring(0, 80) + (c.content?.length > 80 ? '...' : ''),
          rating: c.rating,
          likes: c.likes || 0,
          gameName: gamesMap[c.game_id] || 'Bilinmeyen',
          date: new Date(c.created_at).toLocaleDateString('tr-TR'),
        }));

        setRecentComments(formatted.slice(0, 5));
        setTopLikedComments(
          [...formatted].sort((a, b) => b.likes - a.likes).slice(0, 5)
        );
      } catch (err) {
        console.error('Error loading comments:', err);
      } finally {
        setCommentsLoading(false);
      }
    };
    loadComments();
  }, [games]);

  // Gelen mesajları çek
  useEffect(() => {
    const loadContactMessages = async () => {
      setContactLoading(true);
      try {
        const [messagesRes, unreadRes] = await Promise.all([
          supabase
            .from('contact_messages')
            .select('id, name, email, message, is_read, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('contact_messages')
            .select('id')
            .eq('is_read', false),
        ]);

        if (messagesRes.error) throw messagesRes.error;
        setContactMessages((messagesRes.data || []).map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          message: m.message?.substring(0, 60) + (m.message?.length > 60 ? '...' : ''),
          isRead: m.is_read,
          date: new Date(m.created_at).toLocaleDateString('tr-TR'),
        })));
        setUnreadContactCount((unreadRes.data || []).length);
      } catch (err) {
        console.error('Error loading contact messages:', err);
      } finally {
        setContactLoading(false);
      }
    };
    loadContactMessages();
  }, []);

  const lastGames = [...(sortedGames || [])]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminStats stats={stats} />

      {/* Top Oyunlar + Kategori - Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Top Oyunlar - 8/12 */}
        <div className="lg:col-span-8">
          <TopGames sortedGames={sortedGames} onTabChange={onTabChange} />
        </div>

        {/* Kategori Dağılımı - 4/12 */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 h-fit lg:sticky lg:top-24">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center">
            <PieChart size={20} className="mr-2 text-indigo-600 shrink-0" />
            Kategori Dağılımı
          </h3>
          <div className="space-y-3">
            {categoryList.length === 0 ? (
              <p className="text-gray-500 text-sm">Henüz oyun yok</p>
            ) : (
              categoryList.map(([cat, count]) => (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-sm gap-2">
                    <span className="font-medium text-gray-700 truncate">{cat}</span>
                    <span className="text-gray-500 font-semibold shrink-0">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          {games?.length > 0 && (
            <button
              onClick={() => onTabChange?.('categories')}
              className="mt-4 w-full py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              Tüm Kategoriler
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Yorumlar + İletişim - 3 sütun */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Son Yorumlar */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Clock size={20} className="mr-2 text-blue-600" />
            Son Yorumlar
          </h3>
          {commentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-orange-500" />
            </div>
          ) : recentComments.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">Henüz yorum yok</p>
          ) : (
            <div className="space-y-3">
              {recentComments.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-100 transition-colors"
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                    <span className="text-xs text-gray-500">{c.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-1">{c.comment}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-orange-600 font-medium">{c.gameName}</span>
                    <span className="flex items-center gap-0.5 text-yellow-600">
                      <Star size={12} className="fill-yellow-500" />
                      {c.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => onTabChange?.('comments')}
            className="mt-4 w-full py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            Tüm Yorumlar
            <ArrowRight size={14} />
          </button>
        </div>

        {/* En Çok Beğenilen Yorumlar */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <ThumbsUp size={20} className="mr-2 text-green-600" />
            En Çok Beğenilen Yorumlar
          </h3>
          {commentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-orange-500" />
            </div>
          ) : topLikedComments.filter((c) => c.likes > 0).length === 0 ? (
            <p className="text-gray-500 text-sm py-4">Henüz beğeni alan yorum yok</p>
          ) : (
            <div className="space-y-3">
              {topLikedComments
                .filter((c) => c.likes > 0)
                .slice(0, 5)
                .map((c) => (
                  <div
                    key={c.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-100 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                      <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                        <ThumbsUp size={14} className="fill-green-600" />
                        {c.likes}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-1">{c.comment}</p>
                    <span className="text-xs text-orange-600 font-medium">{c.gameName}</span>
                  </div>
                ))}
            </div>
          )}
          <button
            onClick={() => onTabChange?.('comments')}
            className="mt-4 w-full py-2.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            Yorumları Yönet
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Gelen Mesajlar */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Mail size={20} className="mr-2 text-orange-600" />
            Gelen Mesajlar
            {unreadContactCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                {unreadContactCount} okunmamış
              </span>
            )}
          </h3>
          {contactLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-orange-500" />
            </div>
          ) : contactMessages.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">Henüz mesaj yok</p>
          ) : (
            <div className="space-y-3">
              {contactMessages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    m.isRead ? 'bg-gray-50 border-gray-100' : 'bg-orange-50/50 border-orange-100'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{m.name}</span>
                    <span className="text-xs text-gray-500">{m.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-1">{m.message}</p>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-orange-600 hover:underline font-medium truncate block"
                  >
                    {m.email}
                  </a>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => onTabChange?.('contact')}
            className="mt-4 w-full py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            Tüm Mesajlar
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Son Eklenen Oyunlar */}
      {lastGames.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Gamepad2 size={20} className="mr-2 text-orange-600 shrink-0" />
            Son Eklenen Oyunlar
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {lastGames.map((game) => (
              <button
                key={game.id}
                onClick={() => onTabChange?.('games')}
                className="flex flex-col p-3 sm:p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-md transition-all text-left group"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full aspect-video object-cover rounded-lg mb-2 group-hover:scale-[1.02] transition-transform"
                />
                <span className="font-semibold text-gray-900 text-sm truncate w-full">{game.name}</span>
                <span className="text-xs text-gray-500 truncate w-full">{game.category}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
