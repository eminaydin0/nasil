import { useEffect } from 'react';
import { Grid3X3 } from 'lucide-react';
import Okey101Score from '../../components/tools/Okey101ScoreV2';
import ToolLayout from '../../components/layout/ToolLayout';

export default function Okey101Page() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const helpContent = (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Grid3X3 className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Nasıl Kullanılır?</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-gray-700">Her oyuncunun o eldeki ceza puanını kutucuğa yazın.</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
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

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-2">Manuel Giriş:</h4>
          <p className="text-sm text-gray-600">Eğer oyuncunun elinde kalan sayı farklıysa (örn: 35), kutucuğa manuel olarak yazabilirsiniz.</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-2">Otomatik Hesaplama:</h4>
          <p className="text-sm text-gray-600">En altta toplam puanlar otomatik hesaplanır. En düşük puana sahip olan kazanır.</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
        <p className="text-sm text-orange-900">
          <strong>💡 İpucu:</strong> 101 Okey'de amaç elinizdeki tüm taşları bitirmek ve en az ceza puanı toplamaktır.
        </p>
      </div>
    </>
  );

  return (
    <ToolLayout
      title=""
      description=""
      icon={Grid3X3}
      iconColor="orange"
      badge=""
      seoTitle="101 Okey Puan Hesaplama - Yazboz Tablosu"
      seoDescription="Yüzbir (101) Okey oyunu için dijital yazboz. Ceza puanları, elden bitme ve açmama cezalarını otomatik hesaplayın."
      seoUrl="/araclar/101-yazboz"
      helpContent={helpContent}
    >
      <div className="p-0">
        <Okey101Score />
      </div>
    </ToolLayout>
  );
}
