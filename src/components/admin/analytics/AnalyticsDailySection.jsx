import { useMemo } from 'react';
import { CalendarDays, Users, Eye, TrendingUp, Clock } from 'lucide-react';
import { getTimeRangeLabel } from './constants';

function formatDay(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatDuration(sec) {
  const s = Number(sec) || 0;
  if (s < 60) return `${s}sn`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m}dk ${r}sn` : `${m}dk`;
}

export default function AnalyticsDailySection({ dailyStats, hourlyStats, todayStats, timeRange }) {
  const maxViews = useMemo(
    () => Math.max(...(dailyStats || []).map((d) => d.pageViews), 1),
    [dailyStats]
  );
  const maxHour = useMemo(
    () => Math.max(...(hourlyStats || []).map((h) => h.pageViews), 1),
    [hourlyStats]
  );

  const totals = useMemo(() => {
    const list = dailyStats || [];
    return {
      views: list.reduce((a, d) => a + d.pageViews, 0),
      sessions: list.reduce((a, d) => a + d.sessions, 0),
      avgBounce: list.length
        ? Math.round(list.reduce((a, d) => a + d.bounceRate, 0) / list.length)
        : 0,
    };
  }, [dailyStats]);

  const peakHour = useMemo(() => {
    const list = hourlyStats || [];
    if (!list.length) return null;
    return list.reduce((best, h) => (h.pageViews > best.pageViews ? h : best), list[0]);
  }, [hourlyStats]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-soft">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            <Users size={12} /> Bugün ziyaretçi
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-900">
            {(todayStats?.todaySessions || 0).toLocaleString('tr-TR')}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700">
            Dün: {(todayStats?.yesterdaySessions || 0).toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-soft">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <Eye size={12} /> Bugün görüntülenme
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-blue-900">
            {(todayStats?.todayViews || 0).toLocaleString('tr-TR')}
          </p>
          <p className="mt-1 text-[11px] text-blue-700">
            Dün: {(todayStats?.yesterdayViews || 0).toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="rounded-2xl border border-warm-200/60 bg-white p-4 shadow-soft">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-warm-500">
            <CalendarDays size={12} /> Dönem oturum
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-charcoal-900">
            {totals.sessions.toLocaleString('tr-TR')}
          </p>
          <p className="mt-1 text-[11px] text-warm-500">{getTimeRangeLabel(timeRange)}</p>
        </div>
        <div className="rounded-2xl border border-warm-200/60 bg-white p-4 shadow-soft">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-warm-500">
            <TrendingUp size={12} /> Ort. bounce
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-charcoal-900">%{totals.avgBounce}</p>
          <p className="mt-1 text-[11px] text-warm-500">
            Yoğun saat: {peakHour ? `${String(peakHour.hour).padStart(2, '0')}:00` : '—'}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-charcoal-900">
          <CalendarDays size={18} className="text-orange-600" />
          Günlük Trafik
        </h3>
        <p className="mb-4 text-xs text-warm-500">
          Her gün kaç kişi girdi, kaç sayfa görüntüledi, bounce ve ortalama süre
        </p>

        {dailyStats?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-warm-100 text-[10px] uppercase tracking-wider text-warm-500">
                  <th className="pb-2 pr-3 font-bold">Gün</th>
                  <th className="pb-2 pr-3 font-bold">Ziyaretçi</th>
                  <th className="pb-2 pr-3 font-bold">Görüntülenme</th>
                  <th className="pb-2 pr-3 font-bold">Arama</th>
                  <th className="pb-2 pr-3 font-bold">Yorum</th>
                  <th className="pb-2 pr-3 font-bold">Bounce</th>
                  <th className="pb-2 font-bold">Ort. süre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-50">
                {[...dailyStats].reverse().map((day) => (
                  <tr key={String(day.date)} className="align-middle">
                    <td className="py-3 pr-3 font-semibold text-charcoal-900">{formatDay(day.date)}</td>
                    <td className="py-3 pr-3 tabular-nums font-bold text-orange-700">
                      {day.sessions.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums font-semibold text-charcoal-900">
                          {day.pageViews.toLocaleString('tr-TR')}
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-warm-100">
                          <div
                            className="h-full rounded-full bg-orange-500"
                            style={{ width: `${(day.pageViews / maxViews) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 tabular-nums text-warm-700">{day.searches}</td>
                    <td className="py-3 pr-3 tabular-nums text-warm-700">{day.comments}</td>
                    <td className="py-3 pr-3 tabular-nums text-warm-700">%{day.bounceRate}</td>
                    <td className="py-3 tabular-nums text-warm-700">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} className="text-warm-400" />
                        {formatDuration(day.avgDuration)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-warm-500">Henüz günlük veri yok</p>
        )}
      </div>

      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="mb-1 text-base font-bold text-charcoal-900">Saatlik Yoğunluk</h3>
        <p className="mb-4 text-xs text-warm-500">Türkiye saati (Europe/Istanbul) — hangi saatte daha çok giriliyor</p>
        {hourlyStats?.length ? (
          <div className="flex items-end gap-1 overflow-x-auto pb-2 scroll-touch sm:gap-1.5">
            {hourlyStats.map((h) => (
              <div key={h.hour} className="flex min-w-[1.75rem] flex-1 flex-col items-center gap-1.5">
                <span className="text-[9px] font-bold tabular-nums text-warm-500">
                  {h.pageViews > 0 ? h.pageViews : ''}
                </span>
                <div
                  className="w-full max-w-[2rem] rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400"
                  style={{
                    height: `${Math.max((h.pageViews / maxHour) * 100, h.pageViews > 0 ? 6 : 2)}px`,
                  }}
                  title={`${String(h.hour).padStart(2, '0')}:00 — ${h.pageViews} görüntülenme, ${h.sessions} oturum`}
                />
                <span className="text-[9px] font-medium text-warm-400">
                  {String(h.hour).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-warm-500">Saatlik veri yok</p>
        )}
      </div>
    </div>
  );
}
