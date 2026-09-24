import { useEffect } from 'react';
import { PencilLine } from 'lucide-react';
import BatakScore from '../../components/tools/BatakScore';
import ToolLayout from '../../components/layout/ToolLayout';
import { ToolSeoArticle, getToolLanding } from '../../components/tools/ToolSeoArticle';

const landing = getToolLanding('batak-yazboz');

export default function BatakPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const helpContent = (
    <>
      <h3 className="mb-4 font-bold text-warm-900">Kullanım İpuçları</h3>
      <div className="space-y-3">
        <p className="text-warm-600">
          Her el bittiğinde oyuncuların aldığı puanları (veya cezaları eksi olarak) kutucuklara
          girin ve <strong>&quot;Turu Ekle&quot;</strong> butonuna basın veya Enter&apos;layın.
        </p>
        <p className="text-warm-600">
          Sistem otomatik olarak alt toplamı alır. İhaleli Batak, Gömmeli Batak veya King gibi tüm
          varyasyonlarda kullanılabilir.
        </p>
      </div>
    </>
  );

  return (
    <ToolLayout
      title="Batak & King Yazboz"
      description="İhaleli batak, eşli batak veya King oyunları için dijital yazboz. Puanları otomatik toplayın."
      icon={PencilLine}
      iconColor="indigo"
      seoTitle={landing?.seoTitle}
      seoDescription={landing?.seoDescription}
      seoUrl="/araclar/batak-yazboz"
      helpContent={helpContent}
      seoContent={<ToolSeoArticle slug="batak-yazboz" />}
      faqItems={landing?.faqs || []}
    >
      <BatakScore />
    </ToolLayout>
  );
}
