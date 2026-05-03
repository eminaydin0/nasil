import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Users,
  Search,
  RefreshCw,
  Calendar,
  Ban,
  CheckCircle,
  Loader2,
  ShieldOff,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../ui';

function UserManager() {
  const confirm = useConfirm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | banned

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBanUser = async (userId, currentStatus) => {
    const user = users.find((u) => u.id === userId);
    const userName = user?.full_name || user?.email || 'Kullanıcı';
    const ok = await confirm({
      type: currentStatus ? 'info' : 'danger',
      title: currentStatus ? 'Kullanıcı engelini kaldır' : 'Kullanıcıyı engelle',
      description: currentStatus
        ? `"${userName}" adlı kullanıcının engelini kaldırmak istediğinize emin misiniz?`
        : `"${userName}" adlı kullanıcı engellenecek. Yorum yapamayacak ve hesabına erişemeyecek. Devam edilsin mi?`,
      confirmText: currentStatus ? 'Engeli Kaldır' : 'Engelle',
      cancelText: 'Vazgeç',
    });
    if (!ok) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      toast.success(currentStatus ? 'Kullanıcı engeli kaldırıldı' : 'Kullanıcı engellendi');
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('İşlem yapılırken hata oluştu');
    }
  };

  const counts = useMemo(() => {
    const total = users.length;
    const banned = users.filter((u) => u.is_banned).length;
    return { total, banned, active: total - banned };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return users.filter((u) => {
      if (filter === 'active' && u.is_banned) return false;
      if (filter === 'banned' && !u.is_banned) return false;
      if (!q) return true;
      return (
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q)
      );
    });
  }, [users, searchTerm, filter]);

  const FILTERS = [
    { id: 'all', label: 'Tümü', count: counts.total },
    { id: 'active', label: 'Aktif', count: counts.active },
    { id: 'banned', label: 'Engelli', count: counts.banned },
  ];

  return (
    <div className="space-y-5">
      {/* Üst bar */}
      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-charcoal-900">
              <Users size={20} className="text-orange-600" />
              Kullanıcı Yönetimi
            </h2>
            <p className="mt-0.5 text-sm text-warm-500">
              Toplam {counts.total} kullanıcı · {counts.active} aktif · {counts.banned} engelli
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadUsers}
              className="inline-flex items-center gap-1.5 rounded-xl border border-warm-200 bg-cream-50 px-3.5 py-2.5 text-sm font-semibold text-warm-800 transition-all hover:bg-warm-100"
              title="Yenile"
            >
              <RefreshCw size={16} />
              Yenile
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İsim veya e-posta ile ara..."
              className="w-full rounded-xl border border-warm-200 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-charcoal-900 placeholder-warm-400 transition-colors focus:border-orange-400 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="inline-flex shrink-0 rounded-xl border border-warm-200 bg-cream-50 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-white text-charcoal-900 shadow-soft'
                    : 'text-warm-500 hover:text-charcoal-900'
                }`}
              >
                {f.label}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    filter === f.id ? 'bg-warm-100 text-warm-700' : 'bg-warm-200/50 text-warm-600'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-warm-200/60 bg-white p-20 shadow-soft">
          <Loader2 size={28} className="animate-spin text-orange-500" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-warm-200/60 bg-white p-16 text-center shadow-soft">
          <Users size={28} className="mx-auto mb-2 text-warm-400" />
          <p className="text-sm font-semibold text-warm-700">Kullanıcı bulunamadı</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-warm-200/60 bg-white shadow-soft">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="border-b border-warm-200 bg-cream-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-warm-600">
                    Kullanıcı
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-warm-600">
                    Profil
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-warm-600">
                    Kayıt
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-warm-600">
                    Durum
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-warm-600">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-warm-100 transition-colors hover:bg-cream-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.full_name || ''}
                            loading="lazy"
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-warm-200"
                          />
                        ) : (
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-sm font-bold text-white shadow-soft">
                            {(user.full_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-charcoal-900">
                            {user.full_name || 'İsimsiz'}
                          </div>
                          <div className="truncate text-xs text-warm-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="inline-flex items-center gap-1 text-warm-700">
                          <Calendar size={11} className="text-warm-400" />
                          {user.birth_year || '—'}
                        </span>
                        <span className="text-warm-500">
                          {user.gender === 'male'
                            ? 'Erkek'
                            : user.gender === 'female'
                              ? 'Kadın'
                              : user.gender === 'other'
                                ? 'Diğer'
                                : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-warm-600">
                      {new Date(user.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_banned ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                          <ShieldOff size={11} />
                          Engelli
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                          <ShieldCheck size={11} />
                          Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleBanUser(user.id, user.is_banned)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                          user.is_banned
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        }`}
                      >
                        {user.is_banned ? (
                          <>
                            <CheckCircle size={12} />
                            Engeli Aç
                          </>
                        ) : (
                          <>
                            <Ban size={12} />
                            Engelle
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil */}
          <div className="space-y-2.5 p-3 md:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-warm-200/60 bg-cream-50 p-3"
              >
                <div className="flex items-start gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || ''}
                      loading="lazy"
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-warm-200"
                    />
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-sm font-bold text-white shadow-soft">
                      {(user.full_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-charcoal-900">
                      {user.full_name || 'İsimsiz'}
                    </div>
                    <div className="truncate text-xs text-warm-500">{user.email}</div>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                      {user.is_banned ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-1.5 py-0.5 font-bold text-rose-700">
                          <ShieldOff size={10} />
                          Engelli
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-700">
                          <ShieldCheck size={10} />
                          Aktif
                        </span>
                      )}
                      <span className="text-warm-500">
                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleBanUser(user.id, user.is_banned)}
                  className={`mt-2.5 w-full rounded-lg py-2 text-xs font-bold transition-colors ${
                    user.is_banned
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  }`}
                >
                  {user.is_banned ? 'Engeli Aç' : 'Engelle'}
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-warm-200/60 bg-cream-50 px-5 py-3 text-xs font-semibold text-warm-600">
            Toplam {filteredUsers.length} kullanıcı gösteriliyor
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManager;
