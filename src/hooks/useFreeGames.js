import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

function mapRow(row) {
  return {
    id: row.id,
    externalId: row.external_id,
    title: row.title,
    image: row.image,
    platform: row.platform,
    worth: row.worth,
    endDate: row.end_date,
    url: row.open_giveaway_url,
    type: row.giveaway_type,
    description: row.description,
    syncedAt: row.synced_at,
  };
}

export function useFreeGames({ limit } = {}) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('free_games')
        .select('*')
        .eq('is_active', true)
        .order('synced_at', { ascending: false });

      if (limit) query = query.limit(limit);

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      setGames((data || []).map(mapRow));
    } catch (err) {
      console.error('useFreeGames:', err);
      setError(err.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { games, loading, error, refetch: load };
}
