import { useMemo } from 'react';

/**
 * Donut chart - SVG bazli kategori dagilimi
 * props:
 *  data: [{ label, value, color }]
 *  size: cap (px)
 *  thickness: halka kalinligi
 *  centerLabel/centerValue: ortada gosterilecek bilgi
 */
function Donut({
  data = [],
  size = 180,
  thickness = 18,
  centerLabel = 'Toplam',
  centerValue,
  className = '',
}) {
  const total = useMemo(() => data.reduce((s, d) => s + (d.value || 0), 0), [data]);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    if (total === 0) return [];
    let offset = 0;
    return data.map((d) => {
      const portion = (d.value || 0) / total;
      const length = portion * circumference;
      const seg = {
        ...d,
        portion,
        offset,
        length,
        gap: circumference - length,
      };
      offset += length;
      return seg;
    });
  }, [data, total, circumference]);

  const display = centerValue ?? total.toLocaleString('tr-TR');

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f5f5f4"
            strokeWidth={thickness}
          />
          {total > 0 &&
            segments.map((seg, i) => (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={`${seg.length} ${seg.gap}`}
                strokeDashoffset={-seg.offset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dasharray 600ms cubic-bezier(0.16,1,0.3,1)' }}
              />
            ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold tracking-tight text-charcoal-900">{display}</div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-warm-500">
            {centerLabel}
          </div>
        </div>
      </div>

      <div className="grid w-full gap-1.5 text-sm">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between gap-3 text-warm-700">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="truncate font-medium">{d.label}</span>
            </div>
            <div className="shrink-0 font-semibold text-charcoal-900">
              {d.value.toLocaleString('tr-TR')}
              <span className="ml-1 text-[11px] font-medium text-warm-500">
                {total > 0 ? `(%${Math.round((d.value / total) * 100)})` : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Donut;
