import { Eye, LogOut } from 'lucide-react';

function AdminHeader({ onLogout, onNavigateHome }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">Admin Panel</h1>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Oyun Yönetimi</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-gray-700 hover:text-orange-600 transition-colors text-sm sm:text-base"
              title="Siteyi Görüntüle"
            >
              <Eye size={18} className="sm:w-5 sm:h-5 shrink-0" />
              <span className="hidden md:inline">Siteyi Görüntüle</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
              title="Çıkış Yap"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5 shrink-0" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
