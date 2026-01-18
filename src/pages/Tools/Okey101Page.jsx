import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import Okey101Score from '../../components/tools/Okey101ScoreV2';
import { Link } from 'react-router-dom';
import { ChevronLeft, Grid3X3 } from 'lucide-react';

export default function Okey101Page() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO 
        title="101 Okey Puan Hesaplama - Yazboz Tablosu" 
        description="Yüzbir (101) Okey oyunu için dijital yazboz. Ceza puanları, elden bitme ve açmama cezalarını otomatik hesaplayın."
        url="/araclar/101-yazboz"
      />

      <div className="bg-gray-900 py-8 px-4">
        <div className="container mx-auto">
          <Link to="/araclar" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ChevronLeft size={20} />
            Araçlara Dön
          </Link>
          <h1 className="text-3xl font-black text-white">
            101 Okey Yazboz
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <Okey101Score />
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Grid3X3 className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nasıl Kullanılır?</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <p className="text-gray-700 mb-3">Her oyuncunun o eldeki ceza puanını kutucuğa yazın.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">Hızlı Giriş Butonları:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Bitti (-101)</span>
                    <span className="text-xs text-gray-500">Eli bitiren oyuncu için</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-emerald-700">Okeyli (-202)</span>
                    <span className="text-xs text-gray-500">Okey atarak biten için</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-700">Açmadı (+202)</span>
                    <span className="text-xs text-gray-500">Hiç açamayan için</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium text-orange-700">İşler (+101)</span>
                    <span className="text-xs text-gray-500">İşler taşı atan için</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">Manuel Giriş:</h4>
                <p className="text-sm text-gray-600">Eğer oyuncunun elinde kalan sayı farklıysa (örn: 35), kutucuğa manuel olarak yazabilirsiniz.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">Otomatik Hesaplama:</h4>
                <p className="text-sm text-gray-600">En altta toplam puanlar otomatik hesaplanır. En düşük puana sahip olan kazanır.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
              <p className="text-sm text-pink-800">
                <strong>💡 İpucu:</strong> 101 Okey'de amaç elinizdeki tüm taşları bitirmek ve en az ceza puanı toplamaktır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
