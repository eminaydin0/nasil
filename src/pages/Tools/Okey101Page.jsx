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

      {/* Oyun Detayı Stili Başlık ve Kısa Bilgi */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <Link to="/araclar" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group text-sm">
            <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Araçlara Dön</span>
          </Link>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Simgesel Görsel Alanı */}
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="aspect-square w-28 h-28 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-4xl font-black text-white drop-shadow-lg">101</span>
              </div>
            </div>
            {/* Başlık ve Kısa Açıklama */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[11px] font-medium rounded-lg">Kağıt Oyunu</span>
              </div>
              <h1 className="text-base md:text-lg font-bold text-gray-900 mb-1">101 Okey <span className="text-orange-600">Yazboz</span></h1>
              <p className="text-gray-600 text-sm font-normal mt-1">Dijital yazboz ile ceza puanlarını ve bitişleri kolayca hesaplayın.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-8 mt-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl shadow-xl border border-orange-100 overflow-hidden ring-2 ring-orange-200">
            <div className="p-4 sm:p-8 md:p-10 lg:p-12">
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
