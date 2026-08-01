import { useMemo } from 'react';
import { Monitor, Globe, Link2 } from 'lucide-react';
import { Donut } from '../charts';
import RankBadge from './RankBadge';
import { getTimeRangeLabel } from './constants';
import { getShare, getTotal, sortByDesc } from './rankingUtils';

const SOURCE_LABELS = {
  direct: 'Doğrudan',
  search: 'Arama',
  social: 'Sosyal Medya',
  referral: 'Referral',
};

function RankedMetricList({ items, total, formatter }) {
  const max = items[0]?.value || 1;

  return (
    <div className="divide-y divide-warm-100">
      {items.map((item, i) => {
        const share = getShare(item.value, total);
        return (
          <div
            key={item.label}
            className="flex items-center gap-3 px-1 py-3 first:pt-0 last:pb-0"
          >
            <RankBadge rank={i + 1} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-charcoal-900">{item.label}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[11px] font-medium tabular-nums text-warm-500">%{share}</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: item.color }}>
                    {formatter(item.value)}
                  </span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-warm-100">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-spring"
                  style={{
                    width: `${(item.value / max) * 100}%`,
                    background: `linear-gradient(90deg, ${item.color}cc, ${item.color})`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsTrafficSection({ analytics, timeRange, referrerStats = [] }) {
  const deviceData = useMemo(() => {
    const raw = [
      { label: 'Masaüstü', value: analytics.deviceStats.desktop, color: '#6366f1' },
      { label: 'Mobil', value: analytics.deviceStats.mobile, color: '#10b981' },
      { label: 'Tablet', value: analytics.deviceStats.tablet, color: '#f59e0b' },
    ];
    return sortByDesc(raw, 'value');
  }, [analytics.deviceStats]);

  const trafficData = useMemo(() => {
    const raw = [
      { label: 'Doğrudan', value: analytics.trafficSources.direct, color: '#06b6d4' },
      { label: 'Arama', value: analytics.trafficSources.search, color: '#10b981' },
      { label: 'Sosyal Medya', value: analytics.trafficSources.social, color: '#ec4899' },
      { label: 'Referral', value: analytics.trafficSources.referral, color: '#f97316' },
    ];
    return sortByDesc(raw, 'value');
  }, [analytics.trafficSources]);

  const referrers = useMemo(
    () => sortByDesc(referrerStats || [], 'sessions'),
    [referrerStats]
  );
  const referrerTotal = getTotal(referrers, 'sessions');
  const referrerMax = referrers[0]?.sessions || 1;

  const deviceTotal = getTotal(deviceData, 'value');
  const trafficTotal = getTotal(trafficData, 'value');
  const hasDeviceData = deviceData.some((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
          <Monitor size={18} className="text-indigo-600" />
          Cihaz Dağılımı
        </h3>
        <p className="mb-4 text-xs text-warm-500">Oturum başına cihaz tipi</p>

        {hasDeviceData ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex shrink-0 justify-center">
              <Donut data={deviceData} size={160} thickness={18} centerLabel="Cihaz" />
            </div>
            <div className="min-w-0 flex-1">
              <RankedMetricList
                items={deviceData}
                total={deviceTotal}
                formatter={(v) => `%${v}`}
              />
            </div>
          </div>
        ) : (
          <RankedMetricList
            items={deviceData}
            total={deviceTotal || 1}
            formatter={(v) => `%${v}`}
          />
        )}
      </div>

      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
          <Globe size={18} className="text-cyan-600" />
          Trafik Kaynakları
        </h3>
        <p className="mb-4 text-xs text-warm-500">Kaynaklara göre ziyaret dağılımı</p>

        <RankedMetricList
          items={trafficData}
          total={trafficTotal || 1}
          formatter={(v) => `%${v}`}
        />
      </div>

      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6 lg:col-span-2">
        <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-charcoal-900">
          <Link2 size={18} className="text-orange-600" />
          Nereden geldiler?
        </h3>
        <p className="mb-4 text-xs text-warm-500">
          Referrer domain / kaynak kırılımı — en çok oturum getiren siteler
        </p>

        {referrers.length ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {referrers.map((item, i) => {
              const share = getShare(item.sessions, referrerTotal);
              return (
                <div
                  key={`${item.host}-${item.source}-${i}`}
                  className="flex items-center gap-3 rounded-xl border border-warm-200/60 bg-cream-50/50 px-3 py-2.5"
                >
                  <RankBadge rank={i + 1} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-charcoal-900">{item.host}</p>
                        <p className="text-[11px] text-warm-500">
                          {SOURCE_LABELS[item.source] || item.source}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold tabular-nums text-orange-700">
                          {item.sessions}
                        </p>
                        <p className="text-[10px] text-warm-500">%{share}</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-warm-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500"
                        style={{ width: `${(item.sessions / referrerMax) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-warm-500">Henüz referrer verisi yok</p>
        )}
      </div>

      <div className="rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-amber-50 p-4 text-xs leading-relaxed text-orange-900 lg:col-span-2">
        <strong className="block text-orange-700">Not</strong>
        Veriler {getTimeRangeLabel(timeRange)} içindeki oturumlara dayanır. Bounce tek sayfa
        oturumudur; süre oturum başına en yüksek kaydedilen değerdir.
      </div>
    </div>
  );
}
