import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { trackPageView } from '../../utils/analytics';
import { useEffect } from 'react';

function ErrorPage({ status = 404, title, message }) {
  const navigate = useNavigate();

  const defaults = {
    404: {
      title: 'Sayfa Bulunamadı',
      message: 'Aradığınız sayfa mevcut değil veya taşınmış olabilir. Belki yanlış bir bağlantıya tıkladınız?'
    },
    500: {
      title: 'Sunucu Hatası',
      message: 'Bir şeyler yanlış gitti. Lütfen biraz sonra tekrar deneyin.'
    }
  };

  const { title: defaultTitle, message: defaultMessage } = defaults[status] || defaults[404];
  const displayTitle = title || defaultTitle;
  const displayMessage = message || defaultMessage;

  useEffect(() => {
    trackPageView(`/hata-${status}`);
  }, [status]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <SEO
        title={`${displayTitle} - Kuralı Ne?`}
        description={displayMessage}
        noindex
      />

      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <span className="text-8xl font-black text-orange-100 select-none">{status}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{displayTitle}</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">{displayMessage}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-md"
          >
            <Home size={20} />
            Ana Sayfa
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Geri Dön
          </button>
          <Link
            to="/oyunlar"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-200 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            <Search size={20} />
            Oyun Ara
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">Popüler sayfalar</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/oyunlar" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              Oyunlar
            </Link>
            <Link to="/araclar" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              Araçlar
            </Link>
            <Link to="/hakkimizda" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              Hakkımızda
            </Link>
            <Link to="/iletisim" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
