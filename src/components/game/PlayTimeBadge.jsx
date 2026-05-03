import { Clock } from 'lucide-react';

/**
 * Tahmini oyun suresi rozeti.
 * playTimeMinutes 30 ise "30 dk", 90 ise "1 sa 30 dk" gibi gosterilir.
 * 0 / null / undefined ise hicbir sey render edilmez.
 */
function formatMinutes(min) {
  if (!min || min <= 0) return null;
  if (min < 60) return `${min} dk`;
  const hours = Math.floor(min / 60);
  const remaining = min % 60;
  if (remaining === 0) return `${hours} sa`;
  return `${hours} sa ${remaining} dk`;
}

export default function PlayTimeBadge({ minutes, size = 'md', className = '' }) {
  const label = formatMinutes(minutes);
  if (!label) return null;

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-1 text-xs gap-1.5'
    : 'px-3 py-1.5 text-sm gap-2';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-lg border bg-blue-50 text-blue-700 border-blue-200 ${sizeClasses} ${className}`}
      aria-label={`Tahmini oyun süresi: ${label}`}
    >
      <Clock size={size === 'sm' ? 14 : 16} className="text-blue-600" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
