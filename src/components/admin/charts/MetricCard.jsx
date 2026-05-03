import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Sparkline from './Sparkline';

const TONES = {
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
    stroke: '#f97316',
    fill: '#f9731633',
    border: 'border-orange-100/60',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    stroke: '#3b82f6',
    fill: '#3b82f633',
    border: 'border-blue-100/60',
  },
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    stroke: '#10b981',
    fill: '#10b98133',
    border: 'border-emerald-100/60',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50',
    iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-500',
    stroke: '#a855f7',
    fill: '#a855f733',
    border: 'border-purple-100/60',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-500',
    stroke: '#f59e0b',
    fill: '#f59e0b33',
    border: 'border-amber-100/60',
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-50 to-pink-50',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500',
    stroke: '#f43f5e',
    fill: '#f43f5e33',
    border: 'border-rose-100/60',
  },
};

function formatNumber(n) {
  if (typeof n !== 'number') return n;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString('tr-TR');
}

/**
 * MetricCard - premium istatistik karti
 * props:
 *  icon, label, value, hint (opsiyonel alt yazi)
 *  delta: yuzde degisim sayisi (opsiyonel)
 *  spark: number[] (sparkline)
 *  tone: orange | blue | emerald | purple | amber | rose
 *  format: 'number' | 'raw' (default 'number')
 */
function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  delta,
  spark,
  tone = 'orange',
  format = 'number',
  className = '',
}) {
  const t = TONES[tone] || TONES.orange;
  const display = format === 'number' && typeof value === 'number' ? formatNumber(value) : value;

  let DeltaIcon = Minus;
  let deltaColor = 'text-warm-500 bg-warm-100';
  if (typeof delta === 'number') {
    if (delta > 0) {
      DeltaIcon = TrendingUp;
      deltaColor = 'text-emerald-700 bg-emerald-100';
    } else if (delta < 0) {
      DeltaIcon = TrendingDown;
      deltaColor = 'text-rose-700 bg-rose-100';
    }
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${t.border} ${t.bg} p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg ${className}`}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {Icon && (
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl text-white shadow-soft ${t.iconBg}`}
              >
                <Icon size={18} />
              </span>
            )}
            <span className="text-[11px] font-bold uppercase tracking-wider text-warm-600">
              {label}
            </span>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-charcoal-900">
            {display}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            {typeof delta === 'number' && (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-bold ${deltaColor}`}
              >
                <DeltaIcon size={11} />
                {delta > 0 ? '+' : ''}
                {delta}%
              </span>
            )}
            {hint && <span className="font-medium text-warm-500">{hint}</span>}
          </div>
        </div>
        {spark && spark.length > 0 && (
          <div className="hidden w-24 shrink-0 sm:block">
            <Sparkline data={spark} stroke={t.stroke} fill={t.fill} height={48} width={96} />
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
