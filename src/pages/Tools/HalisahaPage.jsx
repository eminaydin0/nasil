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
      description="Küçük saha maçları için hızlı takım kurma aracı. 5v5, 6v6, 7v7 formatlarını destekler."
      icon={Users}
      iconColor="orange"
      seoTitle="Halısaha Takımı Oluşturucu"
      seoDescription="Küçük saha maçları için hızlı takım kurma aracı. 5v5, 6v6, 7v7 formatlarını destekler."
      seoUrl="/araclar/halisaha-takim-olusturucu"
    >
      <HalisahaGenerator />
    </ToolLayout>
  );
}
