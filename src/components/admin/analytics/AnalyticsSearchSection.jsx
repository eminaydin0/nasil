import { useMemo } from 'react';
import { Search } from 'lucide-react';
import RankBadge from './RankBadge';
import { getShare, getTotal } from './rankingUtils';

export default function AnalyticsSearchSection({ searchStats }) {
  const sorted = useMemo(
    () => [...searchStats].sort((a, b) => b.count - a.count),
    [searchStats]
  );
  const total = getTotal(sorted, 'count');
  const max = sorted[0]?.count || 1;

  return (
    <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
            <Search size={18} className="text-amber-600" />
            En Çok Aranan Terimler
          </h3>
          <p className="mt-0.5 text-xs text-warm-500">
            Kullanıcıların site içi arama sorguları
          </p>
        </div>
        {total > 0 && (
          <div className="rounded-xl bg-amber-50 px-3 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Toplam Arama</p>
            <p className="text-lg font-bold tabular-nums text-amber-800">{total.toLocaleString('tr-TR')}</p>
          </div>
        )}
      </div>

      {sorted.length > 0 ? (
        <div className="divide-y divide-warm-100 rounded-xl border border-warm-200/60 bg-cream-50/40">
          {sorted.map((item, i) => {
            const share = getShare(item.count, total);
            return (
              <div
                key={item.term}
                className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-cream-50"
              >
                <RankBadge rank={i + 1} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold capitalize text-charcoal-900">
                      &ldquo;{item.term}&rdquo;
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[11px] font-medium tabular-nums text-warm-500">%{share}</span>
                      <span className="min-w-[2.5rem] rounded-lg bg-amber-100 px-2 py-0.5 text-right text-sm font-bold tabular-nums text-amber-800">
                        {item.count}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-warm-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                      style={{ width: `${(item.count / max) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-warm-500">
          Henüz arama verisi yok. Header veya oyunlar sayfasından yapılan aramalar burada görünür.
        </p>
      )}
    </div>
  );
}
