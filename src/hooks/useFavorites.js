import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          game_id,
          created_at,
          game:games(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFavorites(data || []);
      setFavoriteIds(new Set((data || []).map(f => f.game_id)));
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
      setFavoriteIds(new Set());
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (gameId) => {
    if (!user) {
      toast.error('Favorilere eklemek için giriş yapın', {
        icon: '🔒',
      });
      return false;
    }

    const isFav = favoriteIds.has(gameId);

    // Optimistic update
    const newFavoriteIds = new Set(favoriteIds);
    if (isFav) {
      newFavoriteIds.delete(gameId);
    } else {
      newFavoriteIds.add(gameId);
    }
    setFavoriteIds(newFavoriteIds);

    try {
      if (isFav) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('game_id', gameId);
        
        if (error) throw error;
        
        setFavorites(favorites.filter(f => f.game_id !== gameId));
        toast.success('Favorilerden çıkarıldı', {
          icon: '💔',
        });
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from('user_favorites')
          .insert([{ user_id: user.id, game_id: gameId }])
          .select(`
            id,
            game_id,
            created_at,
            game:games(*)
          `)
          .single();
        
        if (error) throw error;
        
        setFavorites([data, ...favorites]);
        toast.success('Favorilere eklendi', {
          icon: '❤️',
        });
      }
      return true;
    } catch (error) {
      // Revert optimistic update on error
      setFavoriteIds(favoriteIds);
      console.error('Error toggling favorite:', error);
      
      if (error.code === '23505') {
        toast.error('Bu oyun zaten favorilerinizde');
      } else {
        toast.error('Bir hata oluştu');
      }
      return false;
    }
  };

  const isFavorite = (gameId) => {
    return favoriteIds.has(gameId);
  };

  const getFavoriteCount = () => {
    return favorites.length;
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  return { 
    favorites, 
    loading, 
    toggleFavorite, 
    isFavorite, 
    getFavoriteCount,
    refresh: loadFavorites 
  };
};
