import { Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const ICON_MAP = {
  comment_reply: '💬',
  comment_like: '❤️',
  new_follower: '👤',
  badge_earned: '🏆',
  favorite_game_update: '⭐',
  system_announcement: '📢',
};

function formatTime(createdAt) {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Az önce';
  if (diffMins < 60) return `${diffMins} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  return date.toLocaleDateString('tr-TR');
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('id, type, title, content, link, icon, is_read, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error) setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleBellClick = () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) fetchNotifications();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  const markAsRead = async (id) => {
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .in('id', unreadIds);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
  };

  if (!user) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={handleBellClick}
        className="relative p-2 rounded-full text-warm-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
        title="Bildirimler"
        aria-label="Bildirimler"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[min(400px,70vh)] bg-white rounded-xl shadow-xl border border-warm-200 overflow-hidden z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-warm-100 bg-cream-50">
            <span className="font-semibold text-warm-800">Bildirimler</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium"
              >
                Tümünü okundu işaretle
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-warm-500 text-sm">
                Yükleniyor...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-warm-500 text-sm">
                Henüz bildirim yok.
              </div>
            ) : (
              <ul className="divide-y divide-warm-100">
                {notifications.map((n) => (
                  <li key={n.id}>
                    {n.link ? (
                      <Link
                        to={n.link}
                        onClick={() => {
                          markAsRead(n.id);
                          setOpen(false);
                        }}
                        className={`flex gap-3 px-4 py-3 hover:bg-orange-50/50 transition-colors ${!n.is_read ? 'bg-orange-50/30' : ''}`}
                      >
                        <span className="text-lg flex-shrink-0">
                          {n.icon || ICON_MAP[n.type] || '📌'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-warm-900 truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-warm-500 line-clamp-2">
                            {n.content}
                          </p>
                          <p className="text-xs text-warm-400 mt-0.5">
                            {formatTime(n.created_at)}
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markAsRead(n.id)}
                        className={`w-full flex gap-3 px-4 py-3 text-left hover:bg-orange-50/50 transition-colors ${!n.is_read ? 'bg-orange-50/30' : ''}`}
                      >
                        <span className="text-lg flex-shrink-0">
                          {n.icon || ICON_MAP[n.type] || '📌'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-warm-900 truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-warm-500 line-clamp-2">
                            {n.content}
                          </p>
                          <p className="text-xs text-warm-400 mt-0.5">
                            {formatTime(n.created_at)}
                          </p>
                        </div>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
