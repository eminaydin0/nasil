import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import DiceRoller from '../../components/tools/DiceRoller';
import { Link } from 'react-router-dom';
import { ChevronLeft, Dices } from 'lucide-react';

export default function DicePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full h-screen min-h-screen bg-white">
      <SEO 
        title="Online Zar At - Tek ve Çift Zar Atma Aracı" 
        description="Kaybolan zarlar için dijital çözüm. Tek tıkla tek veya çift zar atın. Tavla ve diğer kutu oyunları için ideal online zar atma aracı."
        url="/araclar/zar-at"
      />
      <DiceRoller />
    </div>
  );
}
