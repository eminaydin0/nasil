/**
 * BarChart - basit yatay bar listesi
 * data: [{ label, value, color? }]
 */
function BarChart({ data = [], maxValueOverride, className = '', formatter }) {
  const max = maxValueOverride ?? Math.max(...data.map((d) => d.value || 0), 1);

  return (
    <div className={`space-y-3 ${className}`}>
      {data.map((d, i) => {
        const pct = Math.max((d.value / max) * 100, 2);
        const color = d.color || '#f97316';
        return (
          <div key={i}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="truncate font-medium text-warm-700">{d.label}</span>
              <span className="shrink-0 font-semibold text-charcoal-900">
                {formatter ? formatter(d.value) : d.value.toLocaleString('tr-TR')}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-warm-100">
              <div
                className="h-full rounded-full transition-all duration-700 ease-spring"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}cc, ${color})`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BarChart;
