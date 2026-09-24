import { useEffect } from 'react';
import { Users } from 'lucide-react';
import TeamGenerator from '../../components/tools/TeamGenerator';
import ToolLayout from '../../components/layout/ToolLayout';
import { ToolSeoArticle, getToolLanding } from '../../components/tools/ToolSeoArticle';

const landing = getToolLanding('takim-olusturucu');

export default function TeamGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const helpContent = (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-orange-100 p-2">
          <Users className="h-5 w-5 text-orange-600" />
        </div>
        <h3 className="text-xl font-bold text-warm-900">Halı Saha ve Oyun Geceleri İçin</h3>
      </div>
      <p className="mb-4 leading-relaxed text-warm-600">
        İsimleri alt alta yazın, sistem rastgele ve adil şekilde takımları dağıtsın.
      </p>
    </>
  );

  return (
    <ToolLayout
      title="Takım Oluşturucu"
      description="Arkadaş grubu için adil takım kurma aracı. İsimleri girin, kaç takım olacağını seçin ve kura çekin."
      icon={Users}
      iconColor="orange"
      seoTitle={landing?.seoTitle}
      seoDescription={landing?.seoDescription}
      seoUrl="/araclar/takim-olusturucu"
      helpContent={helpContent}
      seoContent={<ToolSeoArticle slug="takim-olusturucu" />}
      faqItems={landing?.faqs || []}
    >
      <TeamGenerator />
    </ToolLayout>
  );
}
