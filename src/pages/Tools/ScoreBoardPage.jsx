import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import ScoreBoard from '../../components/tools/ScoreBoard';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trophy } from 'lucide-react';

export default function ScoreBoardPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <ScoreBoard />
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nasıl Kullanılır?</h3>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Herhangi bir oyun için hızlıca skor tutmanız gerektiğinde kullanabilirsiniz.
            </p>

            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Oyuncu İsimleri
                </h4>
                <p className="text-sm text-gray-600">İsimleri değiştirmek için üzerine tıklayın</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Puan Güncelleme
                </h4>
                <p className="text-sm text-gray-600">+ ve - butonlarıyla puanı kolayca güncelleyin</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Oyuncu Ekleme
                </h4>
                <p className="text-sm text-gray-600">"Oyuncu Ekle" ile dilediğiniz kadar kişi ekleyin</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>🏆 İpucu:</strong> Sıralama otomatik olarak en yüksek puandan en düşüğe doğru yapılır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
