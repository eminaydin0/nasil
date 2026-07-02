import { useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import KuraCek from '../../components/tools/KuraCek';
import ToolLayout from '../../components/layout/ToolLayout';

export default function KuraCekPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ToolLayout
      title="Kura Çekme"
      description="İsimleri ekle, kutudan rastgele kazananı seç — çekiliş, görev dağıtımı ve takım kaptanı için."
      icon={Shuffle}
      badge="Yeni"
      seoTitle="Kura Çekme Aracı — Online İsim Çekilişi"
      seoDescription="Ücretsiz online kura çekme aracı. İsimleri yaz, tek tıkla rastgele kazananı belirle. Çekiliş ve oyun geceleri için ideal."
      seoUrl="/araclar/kura-cek"
    >
      <KuraCek />
    </ToolLayout>
  );
}
