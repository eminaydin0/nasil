import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import DiceRoller from '../../components/tools/DiceRoller';
import { Link } from 'react-router-dom';
import { ChevronLeft, Dices } from 'lucide-react';

export default function DicePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO 
        title="Online Zar At - Tek ve Çift Zar Atma Aracı" 
        description="Kaybolan zarlar için dijital çözüm. Tek tıkla tek veya çift zar atın. Tavla ve diğer kutu oyunları için ideal online zar atma aracı."
        url="/araclar/zar-at"
      />

      <div className="bg-gray-900 py-8 px-4">
        <div className="container mx-auto">
          <Link to="/araclar" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ChevronLeft size={20} />
            Araçlara Dön
          </Link>
          <h1 className="text-3xl font-black text-white">
            Online Zar At
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <div className="max-w-xl mx-auto">
          <DiceRoller />
          
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 prose prose-indigo">
            <h3>Bu Araç Ne İşe Yarar?</h3>
            <p>
              Tavla, Monopoly veya herhangi bir kutu oyunu oynarken zarlarınız kaybolduysa veya koltuğun altına kaçtıysa, bu dijital zar aracını kullanabilirsiniz.
            </p>
            <ul>
              <li><strong>1 Zar:</strong> Basit şans oyunları için.</li>
              <li><strong>2 Zar:</strong> Tavla ve Monopoly gibi oyunlar için.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
