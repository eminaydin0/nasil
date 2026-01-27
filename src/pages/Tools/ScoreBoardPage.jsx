import { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import ScoreBoard from '../../components/tools/ScoreBoard';
import ToolLayout from '../../components/layout/ToolLayout';

export default function ScoreBoardPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const helpContent = (
    <>
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
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Oyuncu İsimleri
          </h4>
          <p className="text-sm text-gray-600">İsimleri değiştirmek için üzerine tıklayın</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Puan Güncelleme
          </h4>
          <p className="text-sm text-gray-600">+ ve - butonlarıyla puanı kolayca güncelleyin</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
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
    </>
  );

  return (
    <ToolLayout
      title="Skor Tablosu"
      description="Kağıt kalemsiz puan tutma aracı. Oyunlar, yarışmalar ve spor müsabakaları için basit dijital skor tablosu."
      icon={Trophy}
      iconColor="blue"
      seoTitle="Skor Tablosu - Basit Puan Tutucu"
      seoDescription="Kağıt kalemsiz puan tutma aracı. Oyunlar, yarışmalar ve spor müsabakaları için basit dijital skor tablosu."
      seoUrl="/araclar/skor-tablosu"
      helpContent={helpContent}
    >
      <div className="p-8">
        <ScoreBoard />
      </div>
    </ToolLayout>
  );
}
