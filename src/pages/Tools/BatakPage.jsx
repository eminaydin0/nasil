import SEO from '../../components/common/SEO';
import BatakScore from '../../components/tools/BatakScore';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function BatakPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO 
        title="Batak & King Yazboz Tablosu" 
        description="İhaleli batak, eşli batak veya King oyunları için dijital yazboz. Puanları otomatik toplayın."
        url="/araclar/batak-yazboz"
      />

      <div className="bg-gray-900 py-8 px-4">
        <div className="container mx-auto">
          <Link to="/araclar" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ChevronLeft size={20} />
            Araçlara Dön
          </Link>
          <h1 className="text-3xl font-black text-white">
            Batak Yazboz
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <div className="max-w-3xl mx-auto">
          <BatakScore />
          
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-gray-600">
             <h3 className="font-bold text-gray-900 mb-2">Kullanım İpuçları</h3>
             <p>
               Her el bittiğinde oyuncuların aldığı puanları (veya cezaları eksi olarak) kutucuklara girin ve <strong>"Turu Ekle"</strong> butonuna basın veya Enter'layın.
             </p>
             <p className="mt-2">
               Sistem otomatik olarak alt toplamı alacaktır. İhaleli Batak, Gömmeli Batak veya King gibi tüm varyasyonlarda kullanılabilir.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
