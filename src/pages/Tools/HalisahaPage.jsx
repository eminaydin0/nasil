import { useEffect } from 'react';
import { Users } from 'lucide-react';
import HalisahaGenerator from '../../components/tools/HalisahaGenerator';
import ToolLayout from '../../components/layout/ToolLayout';
import { ToolSeoArticle, getToolLanding } from '../../components/tools/ToolSeoArticle';

const landing = getToolLanding('halisaha-takim-olusturucu');

export default function HalisahaPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ToolLayout
      title="Halı Saha Takım Oluşturucu"
      description="5v5'ten 11v11'e kadar hazır taktiklerle diziliş kurun, isim verin ve PNG indirin."
      icon={Users}
      iconColor="orange"
      seoUrl="/araclar/halisaha-takim-olusturucu"
      seoContent={<ToolSeoArticle slug="halisaha-takim-olusturucu" />}
      faqItems={landing?.faqs || []}
    >
      <HalisahaGenerator />
    </ToolLayout>
  );
}
