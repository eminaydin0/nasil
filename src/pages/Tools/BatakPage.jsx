import { useEffect } from 'react';
import { PencilLine } from 'lucide-react';
import BatakScore from '../../components/tools/BatakScore';
import ToolLayout from '../../components/layout/ToolLayout';

export default function BatakPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const helpContent = (
    <>
      <h3 className="font-bold text-gray-900 mb-4">Kullanım İpuçları</h3>
      <div className="space-y-3">
        <p className="text-gray-600">
          Her el bittiğinde oyuncuların aldığı puanları (veya cezaları eksi olarak) kutucuklara girin ve <strong>"Turu Ekle"</strong> butonuna basın veya Enter'layın.
        </p>
        <p className="text-gray-600">
          Sistem otomatik olarak alt toplamı alacaktır. İhaleli Batak, Gömmeli Batak veya King gibi tüm varyasyonlarda kullanılabilir.
        </p>
      </div>
    </>
  );

  return (
    <ToolLayout
      title="Batak & King Yazboz"
      description="İhaleli batak, eşli batak veya King oyunları için dijital yazboz. Puanları otomatik toplayın."
      icon={PencilLine}
      iconColor="orange"
      seoTitle="Batak & King Yazboz Tablosu"
      seoDescription="İhaleli batak, eşli batak veya King oyunları için dijital yazboz. Puanları otomatik toplayın."
      seoUrl="/araclar/batak-yazboz"
      helpContent={helpContent}
    >
      <div className="p-8">
        <BatakScore />
      </div>
    </ToolLayout>
  );
}
