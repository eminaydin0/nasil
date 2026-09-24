import { useEffect } from 'react';
import { Grid3X3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Okey101Score from '../../components/tools/Okey101ScoreV2';
import ToolLayout from '../../components/layout/ToolLayout';

const FAQ_ITEMS = [
  {
    question: '101 yazboz',
    answer:
      '101 yazboz, 101 okey oyununda her elin ceza puanlarını tuttuğunuz dijital puantaj tablosudur. Kağıt kalem yerine telefondan veya bilgisayardan puan girersiniz; toplamlar otomatik hesaplanır.',
  },
  
  {
    question: '101 okey yazboz nasıl tutulur?',
    answer:
      'Her el sonunda oyuncunun ceza puanını kutuya girin; bitiren için -101, okeyle bitiş için -202 kısayollarını kullanın. 101 okey yazboz aracı alt toplamları otomatik hesaplar ve el geçmişini tutar.',
  },
  {
    question: '101 yazboz online ücretsiz mi? Uygulama indirmek gerekir mi?',
    answer:
      'Evet, tamamen ücretsizdir. Uygulama indirmeden tarayıcıda açılır; kayıt gerekmez. “101 yazboz online” arayanlar için doğrudan masaüstü ve mobilde çalışır.',
  },
  {
    question: '101 okeyde kim kazanır?',
    answer:
      '101 okeyde en düşük toplam puana ulaşan oyuncu kazanır. El geçmişini takip ederek kimin önde olduğunu anlık görebilirsiniz.',
  },
  {
    question: 'Eşli 101 ile tekli 101 aynı yazbozla tutulur mu?',
    answer:
      'Evet. Aynı 101 yazboz tablosunda tekli veya eşli (takım) oyuncu düzeniyle puan tutabilirsiniz. Açmama cezaları (+202 / +404) için hazır kısayollar vardır.',
  },

  {
    question: '101 yazboz nasıl kullanılır?',
    answer:
      '101 yazboz, 101 okey oyununda her elin ceza puanlarını tuttuğunuz dijital puantaj tablosudur. Kağıt kalem yerine telefondan veya bilgisayardan puan girersiniz; toplamlar otomatik hesaplanır.',
  },
  {
    question: '101 okey kurallarını da öğrenebilir miyim?',
    answer:
      'Evet. 101 Okey kuralları, açılış ve ceza puanlarının anlatıldığı rehber sayfamıza göz atabilirsiniz; yazbozu kullanırken kurallara da bakmak için tek tık yeter.',
  },
];

export default function Okey101Page() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const seoContent = (
    <>
      <h2>101 Yazboz Online — Ücretsiz 101 Okey Puan Tablosu</h2>
      <p>
        <strong>101 yazboz</strong> arıyorsanız doğru yerdesiniz: kayıt yok, uygulama yok, reklam
        labirenti yok. Bu <strong>101 okey yazboz online</strong> aracı kağıt kalemi bırakıp ceza
        puanlarını saniyeler içinde tutmanız için tasarlandı. Masa başında telefonu açın, isimleri
        yazın, her elin puanını girin — alt toplam ve el geçmişi otomatik gelsin.
      </p>

      <h3>Neden bu 101 yazbozu?</h3>
      <ul>
        <li>
          <strong>Hemen açılır:</strong> tarayıcıda çalışır, Play Store / App Store indirmezsiniz.
        </li>
        <li>
          <strong>Hızlı kısayollar:</strong> -101 (bitti), -202 (okey), +101 / +202 / +404 cezalar.
        </li>
        <li>
          <strong>Otomatik hesap:</strong> el bazlı tarihçe + anlık toplam; “kaç kaldı?” kavgası biter.
        </li>
        <li>
          <strong>Mobil uyumlu:</strong> 101 yazboz telefon ekranında da rahat kullanılır.
        </li>
      </ul>

      <h3>101 okey yazboz nasıl kullanılır? (3 adım)</h3>
      <ol className="list-decimal space-y-1 pl-5">
        <li>Oyuncu / takım isimlerini ekleyin.</li>
        <li>El bitince ceza puanını yazın veya kısayola dokunun.</li>
        <li>Toplamı ve geçmişi kontrol edin; en düşük puan kazananı gösterir.</li>
      </ol>

      <h3>101 okey puanları (kısa özet)</h3>
      <ul>
        <li>
          <strong>Bitti (−101):</strong> eli bitiren oyuncu.
        </li>
        <li>
          <strong>Okey (−202):</strong> okeyle bitiş.
        </li>
        <li>
          <strong>Açmadı (+202 / +404):</strong> tekli veya eşli açamama cezası.
        </li>
        <li>
          <strong>İşler (+101):</strong> ek ceza / işaretleme.
        </li>
      </ul>
      <p>
        Kuralların tamamı için <Link to="/oyun/101-okey">101 Okey kuralı ne?</Link> rehberine bakın.
        Düşmeli okey oynuyorsanız <Link to="/araclar/okey-sayaci">okey puan sayacı</Link>, batak /
        king için <Link to="/araclar/batak-yazboz">batak yazboz</Link> da aynı ailede. Tüm
        araçlar: <Link to="/araclar">Oyun Araçları</Link>.
      </p>

      <h3>101 yazboz mu, mobil uygulama mı?</h3>
      <p>
        Birçok “101 yazboz” uygulaması indirme ve bildirim ister. Buradaki online 101 okey yazboz
        ise linki açmanız yeterli — özellikle misafir masasında veya ortak telefonda pratiktir.
        Skorları masada paylaşmak için ekranı göstermeniz yeter; ekstra hesap açmazsınız.
      </p>
    </>
  );

  const helpContent = (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-warm-200/70 pb-5">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 ring-1 ring-orange-400/35">
          <Grid3X3 className="h-6 w-6 text-orange-700" aria-hidden />
        </div>
        <h3 className="font-display text-xl font-bold text-charcoal-900">Nasıl kullanılır?</h3>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-warm-200 bg-cream-50/70 p-4">
          <p className="text-sm leading-relaxed text-warm-700">
            Her oyuncunun o eldeki ceza puanını kutuya yazın; hızlı kısayol butonlarıyla (-101 /
            -202 / +101 vb.) daha da hızlanın.
          </p>
        </div>

        <div className="rounded-2xl border border-warm-200 bg-white/90 p-4">
          <h4 className="font-bold text-charcoal-900">Kısayol düğmeleri</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <div>
                <strong className="text-charcoal-900">Bitti (-101)</strong>
                <p className="text-xs text-warm-500">Eli bitiren</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
              <div>
                <strong className="text-charcoal-900">Okey (-202)</strong>
                <p className="text-xs text-warm-500">Okeyle bitiş</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
              <div>
                <strong className="text-charcoal-900">Açmadı (+202/+404)</strong>
                <p className="text-xs text-warm-500">Tekli / eşli</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
              <div>
                <strong className="text-charcoal-900">İşler (+101)</strong>
                <p className="text-xs text-warm-500">Ceza olarak işaretlemek için</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-200/70 bg-orange-500/10 p-4 text-sm leading-relaxed text-orange-950">
          <strong>İpucu:</strong> 101 okeyde düşük toplama ulaşan kazanır. Manuel girdi her zaman
          kullanılabilir.
        </div>
      </div>
    </>
  );

  return (
    <ToolLayout
      title="101 Okey Yazboz"
      description="Eşli ya da tekli 101 yazbozu. Ön ayar düğmeleri, otomatik alt toplam ve el bazlı tarihçe ile masayı dijitale taşıyın."
      icon={Grid3X3}
      iconColor="pink"
      badge="Yeni"
      seoTitle="101 Yazboz Online — Ücretsiz 101 Okey Puan Tablosu"
      seoDescription="101 yazboz online: kağıt kalem yok. -101/-202 kısayol, otomatik toplam, el geçmişi. Ücretsiz 101 okey yazboz — kayıt yok, mobilde aç."
      seoUrl="/araclar/101-yazboz"
      helpContent={helpContent}
      seoContent={seoContent}
      faqItems={FAQ_ITEMS}
    >
      <Okey101Score />
    </ToolLayout>
  );
}
