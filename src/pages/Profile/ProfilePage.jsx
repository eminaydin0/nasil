import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Settings, Shield } from 'lucide-react';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Çıkış yapıldı');
      navigate('/');
    } catch (error) {
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <>
      <SEO title="Profilim - Nasıl Oynanır" description="Kullanıcı profili" />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Profilim</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Panel: Kullanıcı Kartı */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-orange-600">
                  {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 break-all">
                {user.user_metadata?.full_name || user.email.split('@')[0]}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              
              <div className="mt-6">
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
            <div className="bg-linear-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <Settings size={20} />
                Yakında Gelecek Özellikler
              </h3>
              <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm pl-2">
                <li>Favori oyunları kaydetme</li>
                <li>Okey ve Batak skor geçmişi</li>
                <li>Profil resmi özelleştirme</li>
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
