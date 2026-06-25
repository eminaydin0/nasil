import { useEffect } from 'react';
import { Users } from 'lucide-react';
import HalisahaGenerator from '../../components/tools/HalisahaGenerator';
import ToolLayout from '../../components/layout/ToolLayout';

export default function HalisahaPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ToolLayout
      title="Halısaha Takımı Oluşturucu"
      description="5v5'ten 11v11'e kadar hazır taktiklerle diziliş kurun, isim verin ve PNG indirin."
      icon={Users}
      iconColor="orange"
      seoTitle="Halısaha Takımı Oluşturucu"
      seoDescription="5v5'ten 11v11'e kadar halı saha diziliş editörü. Hazır taktikler, kaptan, forma renkleri ve PNG indirme."
      seoUrl="/araclar/halisaha-takim-olusturucu"
    >
      <HalisahaGenerator />
    </ToolLayout>
  );
}
