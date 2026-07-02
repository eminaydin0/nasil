import { useState, useEffect } from 'react';
import { Cookie, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { initAnalytics, hasAnalyticsConsent } from '../../utils/analytics';
import { setGoogleAnalyticsConsentDenied } from '../../lib/googleAnalytics';

/**
 * KVKK/GDPR uyumlu çerez onay banner'ı
 * localStorage'da tercih saklanır
 */
function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
      return;
    }
    if (hasAnalyticsConsent()) {
      initAnalytics();
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    initAnalytics();
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setGoogleAnalyticsConsentDenied();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Detaylı Ayarlar Modal - Sadece Ayarlar'a tıklanınca */}
      {showDetails && (
        <div 
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40"
          onClick={() => setShowDetails(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-warm-900">Çerez Ayarları</h3>
                <button onClick={() => setShowDetails(false)} className="p-1 hover:bg-warm-100 rounded">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-cream-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">Zorunlu</p>
                    <p className="text-xs text-warm-500">Site işlevselliği için</p>
                  </div>
                  <span className="text-xs font-bold text-green-600">Aktif</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">Analitik</p>
                    <p className="text-xs text-warm-500">Google Analytics ve site istatistikleri</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-warm-300 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={acceptAll} className="flex-1 py-2.5 bg-orange-600 text-white rounded-lg font-medium text-sm hover:bg-orange-700">
                  Kaydet
                </button>
                <button onClick={acceptNecessary} className="py-2.5 px-4 bg-warm-100 text-warm-700 rounded-lg font-medium text-sm hover:bg-warm-200">
                  Reddet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alt Bar - Minimal, arka plan görünür */}
      <div className="safe-area-x fixed bottom-0 left-0 right-0 z-50 safe-area-bottom px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto animate-slide-up">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 sm:py-3 sm:px-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-warm-200/80">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="hidden sm:flex shrink-0 p-1.5 bg-orange-100 rounded-lg">
                <Cookie size={18} className="text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-warm-700 truncate sm:line-clamp-2">
                  Çerezler kullanıyoruz. Sitemizi kullanarak kabul etmiş olursunuz.{' '}
                  <Link to="/cerez-politikasi" className="text-orange-600 hover:underline whitespace-nowrap">Detay</Link>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowDetails(true)}
                className="text-xs sm:text-sm text-warm-500 hover:text-warm-700 px-3 py-1.5 hover:bg-warm-100 rounded-lg transition-colors"
              >
                Ayarlar
              </button>
              <button
                onClick={acceptNecessary}
                className="text-xs sm:text-sm text-warm-600 hover:text-warm-800 px-3 py-1.5 hover:bg-warm-100 rounded-lg transition-colors"
              >
                Reddet
              </button>
              <button
                onClick={acceptAll}
                className="text-xs sm:text-sm px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors whitespace-nowrap"
              >
                Kabul Et
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CookieConsent;
