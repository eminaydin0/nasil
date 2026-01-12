import SEO from '../../components/common/SEO';
import TeamGenerator from '../../components/tools/TeamGenerator';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function TeamGeneratorPage() {
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
          <TeamGenerator />
          
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-gray-600">
            <h3 className="font-bold text-gray-900 mb-2">Halı Saha ve Oyun Geceleri İçin</h3>
            <p>
              "Sen bizim takıma gel", "Haksızlık oldu" tartışmalarına son. İsimleri alt alta yazın, sistem tamamen rastgele bir şekilde takımları dağıtsın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
