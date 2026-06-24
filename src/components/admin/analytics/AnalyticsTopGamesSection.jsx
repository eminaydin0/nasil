import { useMemo, useState } from 'react';
import { BarChart3, Eye, MessageCircle, Trophy } from 'lucide-react';
import RankBadge from './RankBadge';
import { getShare, getTotal, sortByDesc } from './rankingUtils';

const SORT_TABS = [
  { id: 'views', label: 'Görüntülenme', icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'comments', label: 'Yorum', icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
];

function GameRow({ game, rank, metric, maxValue, totalValue }) {
  const value = metric.id === 'views' ? game.views : game.comments;
  const share = getShare(value, totalValue);
  const Icon = metric.icon;

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 transition-all hover:border-warm-200/70 hover:bg-cream-50 sm:px-3">
      <RankBadge rank={rank} />

      {game.image ? (
        <img
          src={game.image}
          alt={game.name}
          loading="lazy"
          className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-warm-200/60"
        />
      ) : (
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-warm-100 text-xs font-bold text-warm-500">
          ?
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-sm font-semibold text-charcoal-900">{game.name}</span>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[11px] font-medium tabular-nums text-warm-500">%{share}</span>
            <span
              className={`inline-flex min-w-[3.5rem] items-center justify-end gap-1 rounded-lg px-2 py-1 text-sm font-bold tabular-nums ${metric.bg} ${metric.color}`}
            >
              <Icon size={13} />
              {value.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-warm-500">
          <span className="inline-flex items-center gap-1">
            <Eye size={11} /> {game.views.toLocaleString('tr-TR')} görüntülenme
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle size={11} /> {game.comments} yorum
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-warm-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700 ease-spring"
            style={{ width: `${(value / maxValue) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsTopGamesSection({ topGames }) {
  const [sortBy, setSortBy] = useState('views');
  const metric = SORT_TABS.find((t) => t.id === sortBy);

  const sorted = useMemo(() => {
    const key = sortBy === 'views' ? 'views' : 'comments';
    return sortByDesc(topGames, key);
  }, [topGames, sortBy]);

  const metricKey = sortBy === 'views' ? 'views' : 'comments';
  const totalValue = getTotal(sorted, metricKey);
  const maxValue = sorted[0]?.[metricKey] || 1;

  return (
    <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
            <Trophy size={18} className="text-orange-600" />
            En Popüler Oyunlar
          </h3>
          <p className="mt-0.5 text-xs text-warm-500">
            Seçili metriğe göre sıralanmış lider tablosu
          </p>
        </div>

        <div className="inline-flex shrink-0 rounded-xl border border-warm-200 bg-cream-50 p-1">
          {SORT_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = sortBy === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSortBy(tab.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-white text-charcoal-900 shadow-soft'
                    : 'text-warm-500 hover:text-charcoal-900'
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {sorted.length > 0 ? (
        <div className="divide-y divide-warm-100 rounded-xl border border-warm-200/60 bg-cream-50/40">
          {sorted.map((game, i) => (
            <GameRow
              key={game.id}
              game={game}
              rank={i + 1}
              metric={metric}
              maxValue={maxValue}
              totalValue={totalValue}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-warm-500">Henüz veri yok</p>
      )}
    </div>
  );
}
