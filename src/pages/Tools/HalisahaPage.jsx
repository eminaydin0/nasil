import { useEffect } from 'react';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import HalisahaGenerator from '../../components/tools/HalisahaGenerator';
import ToolLayout from '../../components/layout/ToolLayout';

const FAQ_ITEMS = [
  {
    question: 'Halı saha takım oluşturucu nedir?',
    answer:
      'Halı saha takım oluşturucu, maçtan önce oyuncu isimlerini iki takıma bölen, diziliş kuran ve kadroyu PNG olarak indirmenizi sağlayan ücretsiz online araçtır. Kayıt gerekmez.',
  },
  {
    question: 'Halı saha takımı nasıl oluşturulur?',
    answer:
      'Oyuncu isimlerini girin, saha formatını (5v5, 7v7, 11v11) ve dizilişi seçin. Araç oyuncuları otomatik olarak iki takıma böler; kaptan seçebilir, forma rengi verebilir ve kadroyu PNG olarak indirebilirsiniz.',
  },
  {
    question: 'Halı saha için hangi dizilişler var?',
    answer:
      '5v5 için 2-2 ve 1-2-1, 7v7 için 3-2-1 ve 2-3-1, 11v11 için 4-4-2, 4-3-3 gibi hazır taktikler bulunur. Diziliş stüdyosunda oyuncuları sürükleyerek konumlarını değiştirebilirsiniz.',
  },
  {
    question: 'Halı saha takım oluşturucu ücretsiz mi? Uygulama lazım mı?',
    answer:
      'Tamamen ücretsizdir, uygulama indirmezsiniz. Tarayıcıda açılır; maçtan hemen önce telefonda da kullanıp WhatsApp grubuna PNG atabilirsiniz.',
  },
  {
    question: '5v5, 7v7 ve 11v11 aynı araçta mı?',
    answer:
      'Evet. Tek sayfada 5v5’ten 11v11’e kadar format seçebilir, her formata uygun dizilişle kadro kurabilirsiniz.',
  },
];

export default function HalisahaPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const seoContent = (
    <>
      <h2>Halı Saha Takım Oluşturucu — Ücretsiz Online Kadro</h2>
      <p>
        <strong>Halı saha takım oluşturucu</strong> ile maçtan önce kimin hangi takımda olduğunu 1
        dakikada netleştirin. İsimleri yazın, formatı seçin (5v5–11v11), dizilişi kurun ve PNG
        indirip gruba atın. Ücretsiz, kayıtsız, mobil uyumlu.
      </p>

      <h3>Kimler için?</h3>
      <ul>
        <li>Her hafta aynı tartışma: “takımları kim bölecek?”</li>
        <li>Halı saha kaptanları ve organize edenler</li>
        <li>Adil kura + görsel diziliş isteyenler</li>
      </ul>

      <h3>Nasıl kullanılır?</h3>
      <ul>
        <li>Oyuncu isimlerini kadroya ekleyin.</li>
        <li>Saha formatını seçin: 5v5, 6v6, 7v7, 8v8, 9v9, 10v10 veya 11v11.</li>
        <li>Hazır diziliş seçin veya oyuncuları sürükleyerek konumlandırın.</li>
        <li>Kaptanı belirleyin, forma rengini seçin, PNG indirin / paylaşın.</li>
      </ul>

      <p>
        Sadece rastgele bölmek istiyorsanız{' '}
        <Link to="/araclar/takim-olusturucu">takım oluşturucu</Link>, tek isim çekmek için{' '}
        <Link to="/araclar/kura-cek">kura çek</Link>. Tüm araçlar:{' '}
        <Link to="/araclar">Oyun Araçları</Link>.
      </p>
    </>
  );

  return (
    <ToolLayout
      title="Halı Saha Takım Oluşturucu"
      description="5v5'ten 11v11'e kadar hazır taktiklerle diziliş kurun, isim verin ve PNG indirin."
      icon={Users}
      iconColor="orange"
      seoTitle="Halı Saha Takım Oluşturucu — Ücretsiz Kadro & Diziliş"
      seoDescription="Halı saha takım oluşturucu: isimleri yaz, 5v5–11v11 diz, PNG indir. Ücretsiz, kayıtsız, WhatsApp’a hazır — maçtan önce 1 dakikada kadro."
      seoUrl="/araclar/halisaha-takim-olusturucu"
      seoContent={seoContent}
      faqItems={FAQ_ITEMS}
    >
      <HalisahaGenerator />
    </ToolLayout>
  );
}
