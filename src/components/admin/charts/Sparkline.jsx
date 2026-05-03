import { useId, useMemo } from 'react';

/**
 * Sparkline - mini SVG trend grafigi
 * props:
 *  data: number[]
 *  width, height: opsiyonel (vbox da)
 *  stroke: cizgi rengi
 *  fill: alttaki gradient ust rengi (opsiyonel)
 *  smooth: catmull-rom yumusatma (default true)
 */
function Sparkline({
  data = [],
  width = 120,
  height = 36,
  stroke = '#f97316',
  fill = '#f9731633',
  smooth = true,
  className = '',
  showDot = true,
  strokeWidth = 2,
}) {
  const gradId = useId();
  const safeData = useMemo(() => (data.length > 0 ? data : [0, 0]), [data]);
  const min = Math.min(...safeData);
  const max = Math.max(...safeData);
  const range = max - min || 1;
  const stepX = width / Math.max(safeData.length - 1, 1);

  const points = useMemo(
    () =>
      safeData.map((v, i) => ({
        x: i * stepX,
        y: height - ((v - min) / range) * (height - 4) - 2,
      })),
    [safeData, stepX, height, min, range]
  );

  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    if (!smooth || points.length < 3) {
      return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    }
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  }, [points, smooth]);

  const fillPath = useMemo(
    () => `${linePath} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`,
    [linePath, points, height]
  );

  const last = points[points.length - 1];

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={fillPath} fill={`url(#${gradId})`} />}
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDot && last && (
        <circle cx={last.x} cy={last.y} r={2.5} fill={stroke} stroke="white" strokeWidth="1.5" />
      )}
    </svg>
  );
}

export default Sparkline;
