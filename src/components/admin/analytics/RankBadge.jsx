import { Trophy } from 'lucide-react';

const PODIUM = [
  {
    bg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
    ring: 'ring-amber-300/50',
    text: 'text-white',
    trophy: true,
  },
  {
    bg: 'bg-gradient-to-br from-slate-300 to-slate-400',
    ring: 'ring-slate-300/50',
    text: 'text-white',
    trophy: true,
  },
  {
    bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
    ring: 'ring-orange-300/50',
    text: 'text-white',
    trophy: true,
  },
];

export default function RankBadge({ rank, size = 'md' }) {
  const style = PODIUM[rank - 1] || {
    bg: 'bg-warm-100',
    ring: 'ring-warm-200/60',
    text: 'text-warm-600',
    trophy: false,
  };

  const dims = size === 'lg' ? 'h-10 w-10 text-base' : size === 'sm' ? 'h-7 w-7 text-xs' : 'h-8 w-8 text-sm';
  const iconSize = size === 'lg' ? 16 : size === 'sm' ? 12 : 14;

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg font-bold shadow-soft ring-1 ${dims} ${style.bg} ${style.ring} ${style.text}`}
    >
      {style.trophy ? <Trophy size={iconSize} /> : rank}
    </span>
  );
}
