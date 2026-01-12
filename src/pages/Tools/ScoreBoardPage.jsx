import SEO from '../../components/common/SEO';
import ScoreBoard from '../../components/tools/ScoreBoard';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function ScoreBoardPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO 
        title="Skor Tablosu - Basit Puan Tutucu" 
        description="Kağıt kalemsiz puan tutma aracı. Oyunlar, yarışmalar ve spor müsabakaları için basit dijital skor tablosu."
        url="/araclar/skor-tablosu"
      />

      <div className="bg-gray-900 py-8 px-4">
        <div className="container mx-auto">
          <Link to="/araclar" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ChevronLeft size={20} />
            Araçlara Dön
          </Link>
          <h1 className="text-3xl font-black text-white">
            Skor Tablosu
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <div className="max-w-xl mx-auto">
          <ScoreBoard />
          
           <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 prose prose-indigo">
            <h3>Nasıl Kullanılır?</h3>
            <p>
              Herhangi bir oyun için hızlıca skor tutmanız gerektiğinde kullanabilirsiniz.
            </p>
            <ul>
              <li>İsimleri değiştirmek için üzerine tıklayın.</li>
              <li>+ ve - butonlarıyla puanı güncelleyin.</li>
              <li>"Oyuncu Ekle" ile dilediğiniz kadar kişi ekleyin.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
