import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { CATEGORIES as FALLBACK_CATEGORIES } from '../constants/categories';

/**
 * Veritabanından kategorileri çeker. Boşsa constants'taki fallback kullanılır.
 * @param {Object} options
 * @param {boolean} options.includeInactive - Pasif kategorileri de dahil et (admin için)
 */
export function useCategories({ includeInactive = false } = {}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      // Sadece aktif kategorileri çek (admin hariç)
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        setCategories(
          data.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            image: c.image_url,
            color: c.color,
            orderIndex: c.order_index,
            isActive: c.is_active ?? true,
          }))
        );
      } else {
        // DB boşsa constants'tan fallback
        setCategories(
          FALLBACK_CATEGORIES.map((c, i) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            image: c.image,
            color: c.color,
            orderIndex: i + 1,
            isActive: true,
          }))
        );
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories(
        FALLBACK_CATEGORIES.map((c, i) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          image: c.image,
          color: c.color,
          orderIndex: i + 1,
          isActive: true,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, loading, refetch: loadCategories };
}
