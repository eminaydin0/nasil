import { useEffect } from 'react';
import { PencilLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import BatakScore from '../../components/tools/BatakScore';
import ToolLayout from '../../components/layout/ToolLayout';

const FAQ_ITEMS = [
  {
    question: 'Batak yazboz nasıl tutulur?',
    answer:
      'Her el sonunda oyuncuların aldığı el/ceza sayısını kutulara girin ve turu ekleyin. Batak yazboz aracı alt toplamı otomatik hesaplar. İhaleli batak, gömmeli batak ve king varyasyonlarının hepsinde çalışır.',
  },
  {
    question: 'Batak kuralları nedir?',
    answer:
      'Batakta amaç ihalede söz verdiğiniz kadar el almaktır. Kuralların adım adım anlatımı ve ipuçları için Batak oyun rehberimize göz atın.',
  },
  {
    question: 'Batak yazboz ücretsiz mi?',
    answer:
      'Evet. Batak & King yazboz tablosu tamamen ücretsizdir, kayıt gerektirmez ve mobil uyumludur.',
  },
];

export default function BatakPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const seoContent = (
    <>
      <h2>Batak & King Yazboz — Online Puan Tablosu</h2>
      <p>
        İhaleli batak, eşli batak veya king oynarken puanları kağıda yazmakla uğraşmayın. Batak
        yazboz aracıyla her el sonunda puanları girin, alt toplam otomatik hesaplansın ve tur
        geçmişini takip edin. İhaleli batak, gömmeli batak ve king dahil tüm varyasyonlarda
        kullanılabilir.
      </p>
      <p>
        Batak oyununun kurallarını mı arıyorsunuz? Adım adım anlatım, ipuçları ve sık sorulan sorular
        için <Link to="/oyun/batak">Batak Kuralı Ne?</Link> rehberimize göz atın. Okey oyunları için{' '}
        <Link to="/araclar/101-yazboz">101 okey yazboz</Link> ve{' '}
        <Link to="/araclar/okey-sayaci">okey sayacı</Link> araçları da mevcut.
      </p>
    </>
  );

  const helpContent = (
    <>
      <h3 className="font-bold text-warm-900 mb-4">Kullanım İpuçları</h3>
      <div className="space-y-3">
        <p className="text-warm-600">
          Her el bittiğinde oyuncuların aldığı puanları (veya cezaları eksi olarak) kutucuklara girin ve <strong>"Turu Ekle"</strong> butonuna basın veya Enter'layın.
        </p>
        <p className="text-warm-600">
          Sistem otomatik olarak alt toplamı alacaktır. İhaleli Batak, Gömmeli Batak veya King gibi tüm varyasyonlarda kullanılabilir.
        </p>
      </div>
    </>
  );

  return (
    <ToolLayout
      title="Batak & King Yazboz"
      description="İhaleli batak, eşli batak veya King oyunları için dijital yazboz. Puanları otomatik toplayın."
      icon={PencilLine}
      iconColor="indigo"
      seoUrl="/araclar/batak-yazboz"
      helpContent={helpContent}
      seoContent={seoContent}
      faqItems={FAQ_ITEMS}
    >
      <BatakScore />
    </ToolLayout>
  );
}
