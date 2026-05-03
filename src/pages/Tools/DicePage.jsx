import { useEffect } from 'react';
import { Dices } from 'lucide-react';
import DiceRoller from '../../components/tools/DiceRoller';
import ToolLayout from '../../components/layout/ToolLayout';

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
      seoTitle="Online Zar At - Tek ve Çift Zar Atma Aracı"
      seoDescription="Kaybolan zarlar için dijital çözüm. Tek tıkla tek veya çift zar atın. Tavla ve diğer kutu oyunları için ideal online zar atma aracı."
      seoUrl="/araclar/zar-at"
    >
      <div className="p-6 sm:p-10">
        <DiceRoller />
      </div>
    </ToolLayout>
  );
}
