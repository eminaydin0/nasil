import { Gauge } from 'lucide-react';

const DIFFICULTY_STYLES = {
  Kolay: {
    label: 'Kolay',
    container: 'bg-green-50 text-green-700 border-green-200',
    icon: 'text-green-600',
    bars: 1,
  },
  Orta: {
    label: 'Orta',
    container: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: 'text-yellow-600',
    bars: 2,
  },
  Zor: {
    label: 'Zor',
    container: 'bg-red-50 text-red-700 border-red-200',
    icon: 'text-red-600',
    bars: 3,
  },
};

function normalize(difficulty) {
  if (!difficulty) return null;
  const key = String(difficulty).trim();
  if (DIFFICULTY_STYLES[key]) return key;
  const lower = key.toLowerCase();
  if (lower.includes('kolay') || lower === 'easy') return 'Kolay';
  if (lower.includes('orta') || lower === 'medium') return 'Orta';
  if (lower.includes('zor') || lower === 'hard') return 'Zor';
  return null;
}

export default function DifficultyBadge({ difficulty, size = 'md', className = '' }) {
  const key = normalize(difficulty);
  if (!key) return null;
  const style = DIFFICULTY_STYLES[key];

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-1 text-xs gap-1.5'
    : 'px-3 py-1.5 text-sm gap-2';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-lg border ${style.container} ${sizeClasses} ${className}`}
      aria-label={`Zorluk seviyesi: ${style.label}`}
    >
      <Gauge size={size === 'sm' ? 14 : 16} className={style.icon} aria-hidden="true" />
      <span>{style.label}</span>
      <span className="flex items-center gap-0.5 ml-1" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`block w-1 rounded-sm ${n <= style.bars ? 'bg-current opacity-80' : 'bg-current opacity-20'} ${
              size === 'sm' ? 'h-2' : 'h-2.5'
            }`}
          />
        ))}
      </span>
    </span>
  );
}

export { DIFFICULTY_STYLES };
