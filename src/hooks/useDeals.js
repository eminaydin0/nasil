import { useState, useEffect, useCallback } from 'react';
import { fetchDeals } from '../lib/cheapShark';

/**
 * CheapShark indirimlerini istemci tarafında çeker.
 * @param {object} opts
 * @param {string} opts.storeID  CheapShark mağaza ID (boş = tümü)
 * @param {number} opts.pageSize
 * @param {string} opts.sortBy
 */
export function useDeals({ storeID = '', pageSize = 48, sortBy = 'Deal Rating' } = {}) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDeals({ storeID, pageSize, sortBy });
      setDeals(data);
    } catch (err) {
      console.error('useDeals:', err);
      setError(err.message);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, [storeID, pageSize, sortBy]);

  useEffect(() => {
    load();
  }, [load]);

  return { deals, loading, error, refetch: load };
}
