import { useEffect } from 'react';
import { Dices } from 'lucide-react';
import DiceRoller from '../../components/tools/DiceRoller';
import ToolLayout from '../../components/layout/ToolLayout';
import { ToolSeoArticle, getToolLanding } from '../../components/tools/ToolSeoArticle';

const landing = getToolLanding('zar-at');

export default function DicePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ToolLayout
      title="Zar At"
      description="Kaybolan zarlar için dijital çözüm. Tek tıkla tek veya çift zar atın. Tavla ve diğer kutu oyunları için ideal online zar atma aracı."
      icon={Dices}
      iconColor="orange"
      seoTitle={landing?.seoTitle}
      seoDescription={landing?.seoDescription}
      seoUrl="/araclar/zar-at"
      seoContent={<ToolSeoArticle slug="zar-at" />}
      faqItems={landing?.faqs || []}
    >
      <DiceRoller />
    </ToolLayout>
  );
}
