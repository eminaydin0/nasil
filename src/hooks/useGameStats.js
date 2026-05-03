import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useGameStats - tüm oyunlar için TEK seferde batch rating sorgusu.
 *
 * Eski yapıda her GameCard kendi yorum sorgusunu atıyordu (N+1).
 * Bu hook gameId listesini alır, tek bir SELECT ile yorum + rating'leri çeker
 * ve kart-id ↔ {average, count} sözlüğü döner.
 */
export function useGameStats(gameIds) {
  const [statsMap, setStatsMap] = useState({});
  const [loading, setLoading] = useState(false);

  // gameIds bağımlılığı sabitlemek için stable key
  const idsKey = useMemo(() => {
    if (!Array.isArray(gameIds)) return '';
    const cleaned = gameIds.filter((id) => id != null);
    return cleaned.length === 0 ? '' : [...cleaned].sort((a, b) => a - b).join(',');
  }, [gameIds]);

  useEffect(() => {
    if (!idsKey) {
      setStatsMap({});
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const ids = idsKey.split(',').map((id) => Number(id));
        const { data, error } = await supabase
          .from('comments')
          .select('game_id, rating')
          .in('game_id', ids);

        if (error) throw error;
        if (cancelled) return;

        const tally = {};
        for (const row of data || []) {
          const id = row.game_id;
          if (!tally[id]) tally[id] = { sum: 0, count: 0 };
          tally[id].count += 1;
          tally[id].sum += Number(row.rating) || 0;
        }

        const map = {};
        for (const id of ids) {
          const t = tally[id];
          map[id] = {
            count: t ? t.count : 0,
            average: t && t.count > 0 ? Number((t.sum / t.count).toFixed(1)) : 0,
          };
        }
        setStatsMap(map);
      } catch (err) {
        console.error('useGameStats error:', err);
        if (!cancelled) setStatsMap({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  return { statsMap, loading };
}

export default useGameStats;
