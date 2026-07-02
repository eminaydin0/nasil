import { useState, useEffect } from 'react';
import { X, Share2, Smartphone } from 'lucide-react';

const STORAGE_KEY = 'add_to_home_dismissed';
const DISMISS_DAYS = 7;

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true ||
  document.referrer.includes('android-app://');

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  window.innerWidth < 768;

export default function AddToHomeScreen() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isStandalone()) return;
    if (!isMobile()) return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const parsed = parseInt(dismissed, 10);
      if (!isNaN(parsed) && Date.now() - parsed < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    }

    setIsIOSDevice(isIOS());

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    setVisible(true);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') handleDismiss();
  };

  if (!visible) return null;

  return (
    <div className="safe-area-x add-to-home-prompt fixed bottom-[calc(5.5rem+var(--mobile-bottom-ui,0px)+var(--safe-bottom))] left-4 right-4 z-[45] animate-slideUp sm:bottom-20 sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-warm-200 overflow-hidden">
        <div className="p-4 pr-12 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 flex h-11 w-11 items-center justify-center rounded-full text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>

          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <Smartphone className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-warm-900 text-sm">Ana ekranınıza ekleyin</p>
              <p className="text-xs text-warm-500 mt-0.5">
                {isIOSDevice ? (
                  <>
                    Hızlı erişim için <span className="font-semibold text-orange-600">Paylaş</span> butonuna
                    dokunun, ardından <span className="font-semibold">"Ana Ekrana Ekle"</span>yi seçin.
                  </>
                ) : (
                  <>
                    Uygulama gibi kullanın. İnternet bağlantısı olmadan da erişebilirsiniz.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {isIOSDevice ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-warm-100 rounded-xl text-xs text-warm-600">
                <Share2 size={16} className="text-orange-500 shrink-0" />
                <span>Paylaş → Ana Ekrana Ekle</span>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="flex-1 py-2.5 px-4 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <Smartphone size={18} />
                Ana Ekrana Ekle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
