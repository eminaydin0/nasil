import { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import OkeyScore from '../../components/tools/OkeyScore';
import ToolLayout from '../../components/layout/ToolLayout';

export default function OkeyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const helpContent = (
    <>
      <h3 className="font-bold text-warm-900 mb-4">Kurallar ve Kullanım</h3>
      <div className="space-y-3">
        <p className="text-warm-600">
          Bu araç klasik "Düşmeli Okey" (genellikle 20 puandan düşülerek oynanan) versiyonu için tasarlanmıştır.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-warm-600">
          <li>Başlangıç puanını değiştirebilirsiniz (Örn: 30 veya 40).</li>
          <li><strong>Normal Bitiş:</strong> Kaybedenlerden 2 puan düşer.</li>
          <li><strong>Okey/Çift:</strong> Kaybedenlerden 4 puan düşer.</li>
          <li>Kazananın puanı değişmez.</li>
        </ul>
      </div>
    </>
  );

  return (
    <ToolLayout
      title="Okey Puan Sayacı"
      description="Okey oynarken puan hesabı yapmak için en kolay yol. Ceza puanlarını otomatik düşün, kalemi kağıdı bırakın."
      icon={Trophy}
      iconColor="orange"
      badge="Popüler"
      seoTitle="Okey Puan Hesaplama - Düşmeli Okey Sayacı"
      seoDescription="Okey oynarken puan hesabı yapmak için en kolay yol. Ceza puanlarını otomatik düşün, kalemi kağıdı bırakın."
      seoUrl="/araclar/okey-sayaci"
      helpContent={helpContent}
    >
      <div className="p-6 sm:p-10">
        <OkeyScore />
      </div>
    </ToolLayout>
  );
}
