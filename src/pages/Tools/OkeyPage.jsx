import SEO from '../../components/common/SEO';
import OkeyScore from '../../components/tools/OkeyScore';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function OkeyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO 
        title="Okey Puan Hesaplama - Düşmeli Okey Sayacı" 
        description="Okey oynarken puan hesabı yapmak için en kolay yol. Ceza puanlarını otomatik düşün, kalemi kağıdı bırakın."
        url="/araclar/okey-sayaci"
      />

      <div className="bg-gray-900 py-8 px-4">
        <div className="container mx-auto">
          <Link to="/araclar" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ChevronLeft size={20} />
            Araçlara Dön
          </Link>
          <h1 className="text-3xl font-black text-white">
            Okey Puan Sayacı
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <div className="max-w-2xl mx-auto">
          <OkeyScore />
          
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-gray-600">
            <h3 className="font-bold text-gray-900 mb-2">Kurallar ve Kullanım</h3>
            <p className="mb-2">
              Bu araç klasik "Düşmeli Okey" (genellikle 20 puandan düşülerek oynanan) versiyonu için tasarlanmıştır.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Başlangıç puanını değiştirebilirsiniz (Örn: 30 veya 40).</li>
              <li><strong>Normal Bitiş:</strong> Kaybedenlerden 2 puan düşer.</li>
              <li><strong>Okey/Çift:</strong> Kaybedenlerden 4 puan düşer.</li>
              <li>Kazananın puanı değişmez.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
