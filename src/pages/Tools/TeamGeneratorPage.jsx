import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import TeamGenerator from '../../components/tools/TeamGenerator';
import { Link } from 'react-router-dom';
import { ChevronLeft, Users } from 'lucide-react';

export default function TeamGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO 
        title="Rastgele Takım Oluşturucu - Kura Çek" 
        description="Arkadaş grubu için adil takım kurma aracı. İsimleri girin, kaç takım olacağını seçin ve kura çekin."
        url="/araclar/takim-olusturucu"
      />

      <div className="bg-gray-900 py-8 px-4">
        <div className="container mx-auto">
          <Link to="/araclar" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ChevronLeft size={20} />
            Araçlara Dön
          </Link>
          <h1 className="text-3xl font-black text-white">
            Takım Oluşturucu
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <TeamGenerator />
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Halı Saha ve Oyun Geceleri İçin</h3>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              "Sen bizim takıma gel", "Haksızlık oldu" tartışmalarına son. İsimleri alt alta yazın, sistem tamamen rastgele bir şekilde takımları dağıtsın.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Adil Dağılım
                </h4>
                <p className="text-sm text-gray-600">Rastgele algoritma ile dengeli takımlar</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Hızlı Kurulum
                </h4>
                <p className="text-sm text-gray-600">İsimleri girin, takımlarınız hazır</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-green-800">
                <strong>⚽ İpucu:</strong> Takım sayısı kadar oyuncu ekleyin veya sistemi otomatik dağıtıma bırakın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
