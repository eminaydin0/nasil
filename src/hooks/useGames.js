import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .order('id', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      const formattedGames = data.map(game => ({
        id: game.id,
        slug: game.slug,
        name: game.name,
        category: game.category,
        players: game.players,
        difficulty: game.difficulty,
        image: game.image,
        shortDescription: game.short_description,
        description: game.description,
        rules: game.rules,
        tips: game.tips,
        views: game.views || 0,
        createdAt: game.created_at
      }));
      
      setGames(formattedGames);
    } catch (err) {
      console.error('Error loading games:', err);
      setError(err.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  return { games, loading, error, refetch: loadGames };
}
