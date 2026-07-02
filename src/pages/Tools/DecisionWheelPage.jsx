import { useEffect } from 'react';
import { CircleDot } from 'lucide-react';
import DecisionWheel from '../../components/tools/DecisionWheel';
import ToolLayout from '../../components/layout/ToolLayout';

export default function DecisionWheelPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ToolLayout
      title="Karar Çarkı"
      description="Seçenekleri yaz, çarkı çevir — kura, ceza veya kimin başlayacağına hızlı karar ver."
      icon={CircleDot}
      badge="Yeni"
      seoTitle="Karar Çarkı — Online Şans Çarkı"
      seoDescription="Kura, ceza seçimi ve oyun kararları için ücretsiz online karar çarkı. Seçenekleri yaz, çevir, sonucu gör."
      seoUrl="/araclar/karar-carki"
    >
      <DecisionWheel />
    </ToolLayout>
  );
}
