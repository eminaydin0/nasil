import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Search, RefreshCw, Trash2, Shield, Calendar, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    try {
      if (!window.confirm(currentStatus ? 'Bu kullanıcının engelini kaldırmak istediğinize emin misiniz?' : 'Bu kullanıcıyı engellemek istediğinize emin misiniz?')) {
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast.success(currentStatus ? 'Kullanıcı engeli kaldırıldı' : 'Kullanıcı engellendi');
      loadUsers(); // Refresh list
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('İşlem yapılırken hata oluştu');
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <User className="text-orange-600" />
          Kullanıcı Yönetimi
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={loadUsers}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Yenile"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          placeholder="İsim veya e-posta ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doğum Yılı / Cinsiyet
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar_url ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatar_url}
                              alt={user.full_name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                              {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || 'İsimsiz'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col text-sm text-gray-900">
                        <span className='flex items-center gap-1'>
                             <Calendar size={14} className="text-gray-400"/> {user.birth_year || '-'}
                        </span>
                        <span className="text-gray-500 text-xs mt-1">
                          {user.gender === 'male' ? 'Erkek' : 
                           user.gender === 'female' ? 'Kadın' : 
                           user.gender === 'other' ? 'Diğer' : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleBanUser(user.id, user.is_banned)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            user.is_banned 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                          title={user.is_banned ? 'Engeli Kaldır' : 'Kullanıcıyı Engelle'}
                        >
                          {user.is_banned ? (
                            <>
                              <CheckCircle size={14} />
                              <span>Engeli Aç</span>
                            </>
                          ) : (
                            <>
                              <Ban size={14} />
                              <span>Engelle</span>
                            </>
                          )}
                        </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
           <span className="text-sm text-gray-500">Toplam {filteredUsers.length} kullanıcı gösteriliyor</span>
        </div>
      </div>
    </div>
  );
}

export default UserManager;
