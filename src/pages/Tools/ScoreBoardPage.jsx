import { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import ScoreBoard from '../../components/tools/ScoreBoard';
import ToolLayout from '../../components/layout/ToolLayout';
import { ToolSeoArticle, getToolLanding } from '../../components/tools/ToolSeoArticle';

const landing = getToolLanding('skor-tablosu');

export default function ScoreBoardPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const helpContent = (
    <>
      <h3 className="mb-4 text-xl font-bold text-warm-900">Nasıl Kullanılır?</h3>
      <p className="mb-4 leading-relaxed text-warm-600">
        İsimlere tıklayarak düzenleyin; + / − ile puan güncelleyin. Sıralama otomatik gelir.
      </p>
    </>
  );

  return (
    <ToolLayout
      title="Skor Tablosu"
      description="Kağıt kalemsiz puan tutma aracı. Oyunlar, yarışmalar ve spor müsabakaları için basit dijital skor tablosu."
      icon={Trophy}
      iconColor="orange"
      seoTitle={landing?.seoTitle}
      seoDescription={landing?.seoDescription}
      seoUrl="/araclar/skor-tablosu"
      helpContent={helpContent}
      seoContent={<ToolSeoArticle slug="skor-tablosu" />}
      faqItems={landing?.faqs || []}
    >
      <ScoreBoard />
    </ToolLayout>
  );
}
