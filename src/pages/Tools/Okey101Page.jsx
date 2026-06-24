import { useEffect } from 'react';
import { Grid3X3 } from 'lucide-react';
import Okey101Score from '../../components/tools/Okey101ScoreV2';
import ToolLayout from '../../components/layout/ToolLayout';

export default function Okey101Page() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            Her oyuncunun o eldeki ceza puanını kutuya yazın; hızlı kısayol butonlarıyla (-101 / -202 / +101 vb.) daha da hızlanın.
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
          <strong>İpucu:</strong> 101 okeyde düşük toplama ulaşan kazanır. Manuel girdi her zaman kullanılabilir.
        </div>
      </div>
    </>
  );

  return (
    <ToolLayout
      title="101 Okey yazboz"
      description="Eşli ya da tekli 101 yazbozu. Ön ayar düğmeleri, otomatik alt toplam ve el bazlı tarihçe ile masayı dijitale taşıyın."
      icon={Grid3X3}
      iconColor="pink"
      badge="Yeni"
      seoTitle="101 Okey Puan Hesaplama — Yazboz tablosu"
      seoDescription="Yüzbir (101) okey için yazboz, ceza puanları ve hızlı kısayollar."
      seoUrl="/araclar/101-yazboz"
      helpContent={helpContent}
    >
      <Okey101Score />
    </ToolLayout>
  );
}
