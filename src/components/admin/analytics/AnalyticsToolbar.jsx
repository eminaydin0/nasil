import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportAnalyticsData } from '../../../utils/analytics';
import { buildExportPayload } from '../../../utils/analyticsAdmin';
import { TIME_RANGES, ANALYTICS_SECTIONS } from './constants';

export default function AnalyticsToolbar({
  timeRange,
  onTimeRangeChange,
  activeSection,
  onSectionChange,
  analytics,
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-charcoal-900">Site Analitiği</h2>
            <p className="mt-0.5 text-sm text-warm-500">
              Kim girdi, nereden geldi, günlük trafik ve oturum detayları
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex rounded-xl border border-warm-200 bg-cream-50 p-1">
              {TIME_RANGES.map((tr) => (
                <button
                  key={tr.value}
                  type="button"
                  onClick={() => onTimeRangeChange(tr.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    timeRange === tr.value
                      ? 'bg-white text-charcoal-900 shadow-soft'
                      : 'text-warm-500 hover:text-charcoal-900'
                  }`}
                >
                  {tr.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                exportAnalyticsData(buildExportPayload(analytics || {}));
                toast.success('Dashboard verisi indirildi');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-charcoal-900 px-3.5 py-2 text-xs font-semibold text-cream-50 transition-all hover:-translate-y-0.5 hover:bg-charcoal-800"
            >
              <Download size={14} />
              İndir
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-warm-200/60 bg-white p-1 shadow-soft scroll-touch">
        {ANALYTICS_SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              activeSection === id
                ? 'bg-orange-600 text-white shadow-warm-glow'
                : 'text-warm-600 hover:bg-cream-50 hover:text-charcoal-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
