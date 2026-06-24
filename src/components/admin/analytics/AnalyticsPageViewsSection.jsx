import { useMemo } from 'react';
import { LayoutGrid } from 'lucide-react';
import RankBadge from './RankBadge';
import { getShare, getTotal } from './rankingUtils';

function PageViewRow({ item, rank, maxViews, totalViews }) {
  const share = getShare(item.views, totalViews);

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 transition-all hover:border-warm-200/70 hover:bg-cream-50 sm:px-3">
      <RankBadge rank={rank} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-sm font-semibold text-charcoal-900">{item.label}</span>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[11px] font-medium tabular-nums text-warm-500">%{share}</span>
            <span className="min-w-[3.5rem] rounded-lg bg-blue-50 px-2 py-1 text-right text-sm font-bold tabular-nums text-blue-700">
              {item.views.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-warm-400">{item.path}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-warm-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700 ease-spring"
            style={{ width: `${(item.views / maxViews) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function PodiumCard({ item, rank, totalViews }) {
  const share = getShare(item.views, totalViews);
  const isFirst = rank === 1;

  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl border border-warm-200/60 bg-gradient-to-b from-white to-cream-50 p-4 text-center shadow-soft ${
        isFirst ? 'order-2 z-10 sm:-mt-3 sm:scale-105 sm:border-amber-200/80' : rank === 2 ? 'order-1' : 'order-3'
      }`}
    >
      <RankBadge rank={rank} size={isFirst ? 'lg' : 'md'} />
      <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-bold text-charcoal-900">
        {item.label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-blue-700">
        {item.views.toLocaleString('tr-TR')}
      </p>
      <p className="mt-0.5 text-[11px] font-medium text-warm-500">toplam trafiğin %{share}&apos;i</p>
    </div>
  );
}

export default function AnalyticsPageViewsSection({ pageViewStats }) {
  const sorted = useMemo(
    () => [...pageViewStats].sort((a, b) => b.views - a.views),
    [pageViewStats]
  );

  const totalViews = getTotal(sorted, 'views');
  const maxViews = sorted[0]?.views || 1;
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
            <LayoutGrid size={18} className="text-blue-600" />
            Sayfa Görüntülenmeleri
          </h3>
          <p className="mt-0.5 text-xs text-warm-500">
            En çok ziyaret edilen sayfalar, görüntülenme sayısına göre sıralı
          </p>
        </div>
        {totalViews > 0 && (
          <div className="rounded-xl bg-blue-50 px-3 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Toplam</p>
            <p className="text-lg font-bold tabular-nums text-blue-800">
              {totalViews.toLocaleString('tr-TR')}
            </p>
          </div>
        )}
      </div>

      {sorted.length > 0 ? (
        <div className="space-y-6">
          {podium.length >= 3 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
              {podium.map((item, i) => (
                <PodiumCard key={item.path} item={item} rank={i + 1} totalViews={totalViews} />
              ))}
            </div>
          )}

          <div className="divide-y divide-warm-100 rounded-xl border border-warm-200/60 bg-cream-50/40">
            {(podium.length < 3 ? sorted : rest).map((item, i) => (
              <PageViewRow
                key={item.path}
                item={item}
                rank={podium.length < 3 ? i + 1 : i + 4}
                maxViews={maxViews}
                totalViews={totalViews}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-warm-500">
          Henüz sayfa görüntülenme verisi yok
        </p>
      )}
    </div>
  );
}
