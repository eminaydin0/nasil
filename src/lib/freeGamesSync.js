import { supabase } from './supabase';
import { fetchGiveaways } from './gamerPower';

/**
 * GamerPower → Supabase upsert
 * @param {string} query - GAMERPOWER_FILTERS değeri
 */
export async function syncFreeGamesFromApi(query = '') {
  const items = await fetchGiveaways(query);
  const now = new Date().toISOString();

  if (items.length === 0) {
    await logSync(0, 'warning', 'API boş liste döndü');
    return { count: 0, items: [] };
  }

  await supabase.from('free_games').update({ is_active: false }).eq('is_active', true);

  const rows = items.map((item) => ({
    ...item,
    is_active: true,
    synced_at: now,
  }));

  const { error } = await supabase.from('free_games').upsert(rows, {
    onConflict: 'external_id',
    ignoreDuplicates: false,
  });

  if (error) throw error;

  await logSync(items.length, 'success', `${items.length} giveaway senkronize edildi`);

  return { count: items.length, items: rows };
}

async function logSync(count, status, message) {
  await supabase.from('free_games_sync_log').insert([
    { synced_count: count, status, message },
  ]);
}

export async function getLastSyncLog() {
  const { data } = await supabase
    .from('free_games_sync_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}
