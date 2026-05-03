import { useMemo, useState } from 'react';
import { Trophy, Star, Eye, MessageCircle, ArrowRight } from 'lucide-react';

const TABS = [
  { id: 'views', label: 'Görüntülenme', icon: Eye, color: '#10b981' },
  { id: 'rating', label: 'Puan', icon: Star, color: '#f59e0b' },
  { id: 'comments', label: 'Yorum', icon: MessageCircle, color: '#a855f7' },
];

function TopGameRow({ game, index, metric, formatter }) {
  const Icon = metric.icon;
  const medalColors = [
    { bg: 'bg-gradient-to-br from-amber-400 to-yellow-500', text: 'text-white' },
    { bg: 'bg-gradient-to-br from-warm-300 to-warm-400', text: 'text-white' },
    { bg: 'bg-gradient-to-br from-orange-400 to-orange-600', text: 'text-white' },
  ];
  const medal = medalColors[index] || { bg: 'bg-warm-100', text: 'text-warm-600' };

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-all duration-200 hover:border-warm-200/70 hover:bg-cream-50">
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold shadow-soft ${medal.bg} ${medal.text}`}
      >
        {index < 3 ? <Trophy size={14} /> : index + 1}
      </span>
      <img
        src={game.image}
        alt={game.name}
        loading="lazy"
        className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-warm-200/60"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-charcoal-900">{game.name}</div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-warm-500">
          <span className="rounded-md bg-warm-100 px-1.5 py-0.5 font-medium">{game.category}</span>
        </div>
      </div>
      <div
        className="flex shrink-0 items-center gap-1 rounded-lg bg-warm-100 px-2.5 py-1.5 text-sm font-bold"
        style={{ color: metric.color }}
      >
        <Icon size={14} />
        <span>{formatter(game)}</span>
      </div>
    </div>
  );
}

function TopGames({ sortedGames = [], onTabChange }) {
  const [activeMetric, setActiveMetric] = useState('views');

  const sorted = useMemo(() => {
    const list = [...sortedGames];
    if (activeMetric === 'views') {
      return list.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
    }
    if (activeMetric === 'rating') {
      return list
        .filter((g) => (g.commentCount || 0) > 0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
    }
    return list
      .filter((g) => (g.commentCount || 0) > 0)
      .sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))
      .slice(0, 6);
  }, [sortedGames, activeMetric]);

  const metric = TABS.find((t) => t.id === activeMetric);

  const formatter = (g) => {
    if (activeMetric === 'views') return (g.views || 0).toLocaleString('tr-TR');
    if (activeMetric === 'rating') return (g.rating || 0).toFixed(1);
    return g.commentCount || 0;
  };

  return (
    <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
            <Trophy size={18} className="text-orange-600" />
            En İyi Oyunlar
          </h3>
          <p className="mt-0.5 text-xs text-warm-500">
            Performansa göre sıralanmış lider tablosu
          </p>
        </div>
        <div className="inline-flex shrink-0 rounded-xl border border-warm-200 bg-cream-50 p-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = activeMetric === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveMetric(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-charcoal-900 shadow-soft'
                    : 'text-warm-500 hover:text-charcoal-900'
                }`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="py-12 text-center text-sm text-warm-500">Henüz veri yok</p>
      ) : (
        <div className="space-y-1.5">
          {sorted.map((game, i) => (
            <TopGameRow
              key={game.id}
              game={game}
              index={i}
              metric={metric}
              formatter={formatter}
            />
          ))}
        </div>
      )}

      {sorted.length > 0 && onTabChange && (
        <button
          type="button"
          onClick={() => onTabChange('games')}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
        >
          Tüm Oyunları Görüntüle
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

export default TopGames;
