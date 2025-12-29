import { Eye, LogOut } from 'lucide-react';

function AdminHeader({ onLogout, onNavigateHome }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">Oyun Yönetimi</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <Eye size={20} />
              <span>Siteyi Görüntüle</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
