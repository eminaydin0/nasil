import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Settings, Shield, Edit2, Check, X, Camera } from 'lucide-react';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

// Curated list of "Netflix-style" avatars
const AVATAR_OPTIONS = [
  // Adventurers
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Gizmo',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Baby',
  // Avataaars
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Scooter',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Mimi',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Boots',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Jack',
  // Bottts
  'https://api.dicebear.com/9.x/bottts/svg?seed=Cuddles',
  'https://api.dicebear.com/9.x/bottts/svg?seed=Willow',
  'https://api.dicebear.com/9.x/bottts/svg?seed=Buster',
  // Micahs
  'https://api.dicebear.com/9.x/micah/svg?seed=Midnight',
  'https://api.dicebear.com/9.x/micah/svg?seed=Bandit',
  'https://api.dicebear.com/9.x/micah/svg?seed=Bear',
];

function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentAvatar = user?.user_metadata?.avatar_url;
  const initials = user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Çıkış yapıldı');
      navigate('/');
    } catch (error) {
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  const handleAvatarSelect = async (url) => {
    setLoading(true);
    try {
      // 1. Update Auth Metadata (Client Side State)
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: url }
      });

      if (authError) throw authError;

      // 2. Update Public Profiles Table (Admin/Public View)
      // Note: This matches the RLS policy "Users can update their own profile"
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id);

      if (dbError) {
         console.warn('Profile table update failed:', dbError);
         // Don't throw here if auth update succeeded, just warn
      }

      toast.success('Profil resmi güncellendi!');
      setIsEditingAvatar(false);
      
      // Force reload to reflect changes in context immediately if needed, 
      // but supabase.auth.onAuthStateChange in context should handle it.
      // However, sometimes metadata updates might need a refresh.
      // window.location.reload(); // Optional, but usually context updates automatically.
      
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Profil resmi güncellenemedi.' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <>
      <SEO title="Profilim - Kuralı Ne?" description="Kullanıcı profili" />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Profilim</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Panel: Kullanıcı Kartı */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 relative overflow-hidden">
              
              <div className="relative inline-block mx-auto mb-4 group">
                 <div className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl ${!currentAvatar ? 'bg-orange-100' : 'bg-gray-100'}`}>
                    {currentAvatar ? (
                      <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-orange-600">
                        {initials}
                      </span>
                    )}
                 </div>
                 <button 
                    onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                    className="absolute bottom-0 right-0 p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 shadow-lg transition-transform transform hover:scale-110"
                    title="Profil Resmini Değiştir"
                 >
                    {isEditingAvatar ? <X size={20} /> : <Camera size={20} />}
                 </button>
              </div>

              <h2 className="text-xl font-bold text-gray-800 break-all mb-1">
                {user.user_metadata?.full_name || user.email.split('@')[0]}
              </h2>
              <p className="text-sm text-gray-500 mb-6">{user.email}</p>
              
              {/* Avatar Selection Grid */}
              {isEditingAvatar && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl animate-fade-in border border-gray-200">
                   <h3 className="text-sm font-bold text-gray-700 mb-3 block">Bir Avatar Seç</h3>
                   <div className="grid grid-cols-4 gap-2">
                      {AVATAR_OPTIONS.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => handleAvatarSelect(avatar)}
                          disabled={loading}
                          className={`aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 bg-white
                             ${currentAvatar === avatar ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent hover:border-gray-300'}
                          `}
                        >
                          <img src={avatar} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                   </div>
                   {loading && <p className="text-xs text-orange-600 mt-2 font-semibold">Tüm platformlarda güncelleniyor...</p>}
                </div>
              )}

              <div className="mt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <LogOut size={18} />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Panel: Detaylar */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-orange-500" />
                Hesap Bilgileri
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-xs">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ad Soyad</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.full_name || '-'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-xs">
                    <Mail size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">E-posta Adresi</p>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-xs">
                    <Shield size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hesap Durumu</p>
                    <p className="text-sm font-medium text-emerald-600">Aktif</p>
                  </div>
                </div>

                {user.user_metadata?.birth_year && (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full shadow-xs">
                      <Settings size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Doğum Yılı</p>
                      <p className="text-sm font-medium text-gray-900">{user.user_metadata.birth_year}</p>
                    </div>
                  </div>
                )}

                {user.user_metadata?.gender && (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full shadow-xs">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cinsiyet</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata.gender === 'male' ? 'Erkek' : 
                         user.user_metadata.gender === 'female' ? 'Kadın' : 'Diğer'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gelecek Özellikler Alanı */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <Settings size={20} />
                Yakında Gelecek Özellikler
              </h3>
              <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm pl-2">
                <li>Favori oyunları kaydetme</li>
                <li>Okey ve Batak skor geçmişi</li>
                <li>Turnuva oluşturma ve yönetme</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
