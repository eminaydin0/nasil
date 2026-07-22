import { useEffect } from 'react';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import HalisahaGenerator from '../../components/tools/HalisahaGenerator';
import ToolLayout from '../../components/layout/ToolLayout';

const FAQ_ITEMS = [
  {
    question: 'Halı saha takımı nasıl oluşturulur?',
    answer:
      'Oyuncu isimlerini girin, saha formatını (5v5, 7v7, 11v11) ve dizilişi seçin. Halı saha takım oluşturucu oyuncuları otomatik olarak iki takıma böler; kaptan seçebilir, forma rengi verebilir ve kadroyu PNG olarak indirebilirsiniz.',
  },
  {
    question: 'Halı saha için hangi dizilişler var?',
    answer:
      '5v5 için 2-2 ve 1-2-1, 7v7 için 3-2-1 ve 2-3-1, 11v11 için 4-4-2, 4-3-3 gibi hazır taktikler bulunur. Diziliş stüdyosunda oyuncuları sürükleyerek konumlarını değiştirebilirsiniz.',
  },
  {
    question: 'Halı saha takım oluşturucu ücretsiz mi?',
    answer:
      'Evet. Halı saha takım oluşturma aracı tamamen ücretsizdir, kayıt gerektirmez ve mobil uyumludur. Maçtan hemen önce telefonunuzdan da kullanabilirsiniz.',
  },
];

export default function HalisahaPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const seoContent = (
    <>
      <h2>Halı Saha Takım Oluşturucu</h2>
      <p>
        Halı saha maçından önce takımları adil bölmenin en hızlı yolu. İsimleri yazın, saha
        formatını seçin ve halı saha takım oluşturucu oyuncuları dengeli şekilde iki takıma dağıtsın.
        5v5’ten 11v11’e kadar hazır dizilişlerle kadronuzu kurun, kaptan belirleyin, forma renklerini
        seçin ve dizilişi PNG olarak indirip WhatsApp grubunuzda paylaşın.
      </p>
      <h3>Nasıl kullanılır?</h3>
      <ul>
        <li>Oyuncu isimlerini kadroya ekleyin.</li>
        <li>Saha formatını seçin: 5v5, 6v6, 7v7, 8v8, 9v9, 10v10 veya 11v11.</li>
        <li>Hazır bir diziliş seçin veya oyuncuları sürükleyerek konumlandırın.</li>
        <li>Kaptanı belirleyin, forma rengini seçin ve PNG olarak indirin.</li>
      </ul>
      <p>
        Rastgele takım kurmak için{' '}
        <Link to="/araclar/takim-olusturucu">takım oluşturucu</Link> aracını, sıralı seçim için{' '}
        <Link to="/araclar/kura-cek">kura çekme</Link> aracını da kullanabilirsiniz. Tüm oyun
        araçları <Link to="/araclar">Oyun Araçları</Link> sayfasında.
      </p>
    </>
  );

  return (
    <ToolLayout
      title="Halı Saha Takım Oluşturucu"
      description="5v5'ten 11v11'e kadar hazır taktiklerle diziliş kurun, isim verin ve PNG indirin."
      icon={Users}
      iconColor="orange"
      seoUrl="/araclar/halisaha-takim-olusturucu"
      seoContent={seoContent}
      faqItems={FAQ_ITEMS}
    >
      <HalisahaGenerator />
    </ToolLayout>
  );
}
