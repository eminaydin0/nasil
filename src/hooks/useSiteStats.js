import { useEffect, useSyncExternalStore } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useSiteStats - global site istatistiklerini tek seferde çeker.
 * StatsSection ve AboutSection aynı okuma toplamını kullanır.
 *
 * Modül-seviyesi cache + dinleyici pattern; useSyncExternalStore ile
 * setState-in-effect uyarısından kaçınır ve birden fazla bileşen aynı sorguyu
 * paylaşır.
 */
const DEFAULT_STATS = { games: 0, reads: 0, comments: 0, categories: 0 };

/** 62 → 60, 4238 → 4000. Gösterilen rakam gerçek sayının üstüne çıkmaz. */
export function floorStat(n) {
  const v = Math.max(0, Math.floor(Number(n) || 0));
  if (v >= 1000) return Math.floor(v / 1000) * 1000;
  if (v >= 100) return Math.floor(v / 50) * 50;
  if (v >= 10) return Math.floor(v / 10) * 10;
  return v;
}

function sumCounts(rows) {
  return (rows || []).reduce((sum, row) => sum + (Number(row.view_count) || 0), 0);
}
let cachedStats = null;
let inflight = null;
const listeners = new Set();

function emit() {
  for (const fn of listeners) fn();
}

async function loadOnce() {
  if (cachedStats) return cachedStats;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const [gamesQ, commentsQ, categoriesQ, gameViewsQ, newsViewsQ] = await Promise.all([
        supabase.from('games').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('game_views').select('view_count'),
        supabase.from('news_posts').select('view_count').eq('is_published', true),
      ]);
      cachedStats = {
        games: gamesQ.count || 0,
        reads: sumCounts(gameViewsQ.data) + sumCounts(newsViewsQ.data),
        comments: commentsQ.count || 0,
        categories: categoriesQ.count || 0,
      };
    } catch (err) {
      console.error('useSiteStats error:', err);
      cachedStats = { ...DEFAULT_STATS };
    }
    inflight = null;
    emit();
    return cachedStats;
  })();

  return inflight;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedStats || DEFAULT_STATS;
}

export function useSiteStats() {
  const stats = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (cachedStats) return;
    loadOnce();
  }, []);

  return { stats, loading: !cachedStats };
}

export default useSiteStats;
