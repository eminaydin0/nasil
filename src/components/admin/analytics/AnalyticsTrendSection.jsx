import { useMemo } from 'react';
import { LineChart, TrendingUp, TrendingDown } from 'lucide-react';
import Sparkline from '../charts/Sparkline';
import { getTimeRangeLabel } from './constants';

function formatBucketLabel(date, timeRange) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);

  if (timeRange === '24hours') {
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

export default function AnalyticsTrendSection({ chartData, timeRange, comparison }) {
  const views = useMemo(() => chartData.map((d) => d.views), [chartData]);
  const total = useMemo(() => views.reduce((s, v) => s + v, 0), [views]);
  const peak = useMemo(() => Math.max(...views, 0), [views]);
  const avg = views.length ? Math.round(total / views.length) : 0;
  const maxBar = peak || 1;

  const trendDelta = comparison?.pageViews;
  const TrendIcon = typeof trendDelta === 'number' && trendDelta < 0 ? TrendingDown : TrendingUp;
  const trendColor =
    typeof trendDelta === 'number' && trendDelta < 0 ? 'text-rose-600' : 'text-emerald-600';

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-warm-200/60 bg-white p-4 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-warm-500">Toplam</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-charcoal-900">
            {total.toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="rounded-2xl border border-warm-200/60 bg-white p-4 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-warm-500">Ortalama</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-charcoal-900">
            {avg.toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="rounded-2xl border border-warm-200/60 bg-white p-4 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-warm-500">En Yoğun</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-orange-600">
            {peak.toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="rounded-2xl border border-warm-200/60 bg-white p-4 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-warm-500">Değişim</p>
          <p className={`mt-1 flex items-center gap-1 text-2xl font-bold tabular-nums ${trendColor}`}>
            {typeof trendDelta === 'number' ? (
              <>
                <TrendIcon size={20} />
                {trendDelta > 0 ? '+' : ''}
                {trendDelta}%
              </>
            ) : (
              '—'
            )}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
              <LineChart size={18} className="text-orange-600" />
              Ziyaret Trendi
            </h3>
            <p className="mt-0.5 text-xs text-warm-500">
              {getTimeRangeLabel(timeRange)} içindeki sayfa görüntülenmeleri
            </p>
          </div>
          {views.length > 1 && (
            <div className="hidden h-12 w-40 sm:block">
              <Sparkline data={views} stroke="#f97316" fill="#f9731633" height={48} width={160} />
            </div>
          )}
        </div>

        {chartData.length > 0 ? (
          <div className="flex items-end gap-1 overflow-x-auto pb-2 scroll-touch sm:gap-2">
            {chartData.map((point, i) => (
              <div
                key={`${point.date}-${i}`}
                className="flex min-w-[2.5rem] flex-1 flex-col items-center gap-2"
              >
                <span className="text-[10px] font-bold tabular-nums text-warm-600">
                  {point.views > 0 ? point.views : ''}
                </span>
                <div
                  className="w-full max-w-[3rem] rounded-t-md bg-gradient-to-t from-orange-500 to-orange-400 transition-all duration-500"
                  style={{
                    height: `${Math.max((point.views / maxBar) * 120, point.views > 0 ? 8 : 2)}px`,
                  }}
                  title={`${formatBucketLabel(point.date, timeRange)}: ${point.views}`}
                />
                <span className="max-w-[3.5rem] truncate text-[9px] font-medium text-warm-400">
                  {formatBucketLabel(point.date, timeRange)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-warm-500">Henüz trend verisi yok</p>
        )}
      </div>
    </div>
  );
}
