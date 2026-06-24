import { Activity, ArrowRight, Radio, Share2, Filter } from 'lucide-react';
import { getShare, getTotal } from './rankingUtils';

function FunnelStep({ label, value, rate, isLast }) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="w-full rounded-xl border border-warm-200/60 bg-white p-4 text-center shadow-soft">
        <p className="text-[10px] font-bold uppercase tracking-wider text-warm-500">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-charcoal-900">
          {value.toLocaleString('tr-TR')}
        </p>
        {typeof rate === 'number' && rate > 0 && (
          <p className="mt-1 text-[11px] font-semibold text-emerald-600">↓ %{rate} dönüşüm</p>
        )}
      </div>
      {!isLast && (
        <ArrowRight size={16} className="my-2 hidden shrink-0 text-warm-300 lg:block" aria-hidden />
      )}
    </div>
  );
}

const PLATFORM_LABELS = {
  whatsapp: 'WhatsApp',
  twitter: 'Twitter / X',
  facebook: 'Facebook',
  telegram: 'Telegram',
  linkedin: 'LinkedIn',
  copy: 'Link Kopyala',
  bilinmeyen: 'Diğer',
};

export default function AnalyticsInsightsSection({ funnel, shareStats, liveVisitors }) {
  const shareTotal = getTotal(shareStats, 'count');
  const shareMax = shareStats[0]?.count || 1;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-white">
              <Radio size={16} />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-white ring-2 ring-emerald-400" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Canlı Ziyaretçi</p>
              <p className="text-xs text-emerald-600">Son 5 dakika</p>
            </div>
          </div>
          <p className="mt-3 text-4xl font-bold tabular-nums text-emerald-800">{liveVisitors}</p>
        </div>

        <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={16} className="text-purple-600" />
            <h3 className="text-sm font-bold text-charcoal-900">Dönüşüm Hunisi</h3>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <FunnelStep label="Ana Sayfa" value={funnel.homeViews} />
            <FunnelStep label="Oyun Görüntüleme" value={funnel.gameViews} rate={funnel.homeToGame} />
            <FunnelStep label="Yorum" value={funnel.comments} rate={funnel.gameToComment} isLast />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-charcoal-900">
          <Share2 size={18} className="text-pink-600" />
          Paylaşım Platformları
        </h3>

        {shareStats.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {shareStats.map((item) => {
              const share = getShare(item.count, shareTotal);
              const label = PLATFORM_LABELS[item.platform] || item.platform;
              return (
                <div
                  key={item.platform}
                  className="rounded-xl border border-warm-200/60 bg-cream-50 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold capitalize text-charcoal-900">{label}</span>
                    <span className="text-sm font-bold tabular-nums text-pink-700">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-warm-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500"
                      style={{ width: `${(item.count / shareMax) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-warm-500">%{share} pay</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-warm-500">
            Henüz paylaşım verisi yok
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-blue-200/60 bg-blue-50/50 p-4 text-xs leading-relaxed text-blue-900">
        <strong className="flex items-center gap-1 text-blue-700">
          <Activity size={14} /> İpucu
        </strong>
        Huni düşükse oyun detay sayfalarına yönlendirme ve yorum teşviklerini güçlendirmeyi düşünün.
        Arama listesi hangi oyunların eksik olduğunu gösterebilir.
      </div>
    </div>
  );
}
