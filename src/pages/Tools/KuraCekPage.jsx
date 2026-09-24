import { useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import KuraCek from '../../components/tools/KuraCek';
import ToolLayout from '../../components/layout/ToolLayout';
import { ToolSeoArticle, getToolLanding } from '../../components/tools/ToolSeoArticle';

const landing = getToolLanding('kura-cek');

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
      seoTitle={landing?.seoTitle}
      seoDescription={landing?.seoDescription}
      seoUrl="/araclar/kura-cek"
      seoContent={<ToolSeoArticle slug="kura-cek" />}
      faqItems={landing?.faqs || []}
    >
      <KuraCek />
    </ToolLayout>
  );
}
