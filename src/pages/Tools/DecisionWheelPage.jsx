import { useEffect } from 'react';
import { CircleDot } from 'lucide-react';
import DecisionWheel from '../../components/tools/DecisionWheel';
import ToolLayout from '../../components/layout/ToolLayout';
import { ToolSeoArticle, getToolLanding } from '../../components/tools/ToolSeoArticle';

const landing = getToolLanding('karar-carki');

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
      seoTitle={landing?.seoTitle}
      seoDescription={landing?.seoDescription}
      seoUrl="/araclar/karar-carki"
      seoContent={<ToolSeoArticle slug="karar-carki" />}
      faqItems={landing?.faqs || []}
    >
      <DecisionWheel />
    </ToolLayout>
  );
}
