import SEO from '../../components/common/SEO';
import Okey101Score from '../../components/tools/Okey101ScoreV2';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Okey101Page() {
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
          <Okey101Score />
          
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-gray-600">
             <h3 className="font-bold text-gray-900 mb-2">Nasıl Kullanılır?</h3>
             <ul className="list-disc pl-5 space-y-2">
               <li>Her oyuncunun o eldeki ceza puanını kutucuğa yazın.</li>
               <li>Hızlı giriş butonlarını kullanabilirsiniz:
                 <ul className="pl-4 mt-1 text-sm space-y-1">
                   <li><span className="text-green-600 font-bold">Bitti (-101):</span> Eli bitiren oyuncu için.</li>
                   <li><span className="text-emerald-600 font-bold">Okeyli (-202):</span> Okey atarak biten oyuncu için.</li>
                   <li><span className="text-red-500 font-bold">Açmadı (+202):</span> Hiç açamayan oyuncu için.</li>
                   <li><span className="text-orange-500 font-bold">İşler (+101):</span> İşler taşını atan veya ceza yiyen oyuncu için.</li>
                 </ul>
               </li>
               <li>Eğer oyuncunun elinde kalan sayı farklıysa (örn: 35), kutucuğa manuel olarak 35 yazabilirsiniz.</li>
               <li>En altta toplam puanlar otomatik hesaplanır. En düşük puana sahip olan kazanır.</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
