import { useEffect } from 'react';
import { Users } from 'lucide-react';
import TeamGenerator from '../../components/tools/TeamGenerator';
import ToolLayout from '../../components/layout/ToolLayout';

export default function TeamGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const helpContent = (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Users className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Halı Saha ve Oyun Geceleri İçin</h3>
      </div>

      <p className="text-gray-600 mb-4 leading-relaxed">
        "Sen bizim takıma gel", "Haksızlık oldu" tartışmalarına son. İsimleri alt alta yazın, sistem tamamen rastgele bir şekilde takımları dağıtsın.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Adil Dağılım
          </h4>
          <p className="text-sm text-gray-600">Rastgele algoritma ile dengeli takımlar</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Hızlı Kurulum
          </h4>
          <p className="text-sm text-gray-600">İsimleri girin, takımlarınız hazır</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
        <p className="text-sm text-orange-900">
          <strong>⚽ İpucu:</strong> Takım sayısı kadar oyuncu ekleyin veya sistemi otomatik dağıtıma bırakın.
        </p>
      </div>
    </>
  );

  return (
    <ToolLayout
      title="Takım Oluşturucu"
      description="Arkadaş grubu için adil takım kurma aracı. İsimleri girin, kaç takım olacağını seçin ve kura çekin."
      icon={Users}
      iconColor="orange"
      seoTitle="Rastgele Takım Oluşturucu - Kura Çek"
      seoDescription="Arkadaş grubu için adil takım kurma aracı. İsimleri girin, kaç takım olacağını seçin ve kura çekin."
      seoUrl="/araclar/takim-olusturucu"
      helpContent={helpContent}
    >
      <div className="p-6 sm:p-10">
        <TeamGenerator />
      </div>
    </ToolLayout>
  );
}
