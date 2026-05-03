import { useEffect, useSyncExternalStore } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useSiteStats - global site istatistiklerini tek seferde çeker.
 * StatsSection ve AboutSection (gerçek "aktif kullanıcı" sayısı) tarafından kullanılır.
 *
 * Modül-seviyesi cache + dinleyici pattern; useSyncExternalStore ile
 * setState-in-effect uyarısından kaçınır ve birden fazla bileşen aynı sorguyu
 * paylaşır.
 */
const DEFAULT_STATS = { games: 0, users: 0, comments: 0, categories: 6 };
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
      const [gamesQ, usersQ, commentsQ] = await Promise.all([
        supabase.from('games').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
      ]);
      cachedStats = {
        games: gamesQ.count || 0,
        users: usersQ.count || 0,
        comments: commentsQ.count || 0,
        categories: 6,
      };
    } catch (err) {
      console.error('useSiteStats error:', err);
      cachedStats = { games: 50, users: 100, comments: 200, categories: 6 };
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
