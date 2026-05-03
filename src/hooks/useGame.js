import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGame(slug) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewCount, setViewCount] = useState(0);

  const loadGame = async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*, gallery:game_gallery_images(image_url)')
        .eq('slug', slug)
        .single();
      
      if (gameError) throw gameError;
      
      const foundGame = {
        id: gameData.id,
        slug: gameData.slug,
        name: gameData.name,
        category: gameData.category,
        players: gameData.players,
        difficulty: gameData.difficulty,
        image: gameData.image,
        gallery: gameData.gallery ? gameData.gallery.map(item => item.image_url) : [],
        shortDescription: gameData.short_description,
        description: gameData.description,
        rules: Array.isArray(gameData.rules) ? gameData.rules : [],
        tips: Array.isArray(gameData.tips) ? gameData.tips : [],
        videoUrl: gameData.video_url || null,
        videoTitle: gameData.video_title || null,
        playTimeMinutes: gameData.play_time_minutes || null,
        faq: Array.isArray(gameData.faq) ? gameData.faq : [],
        createdAt: gameData.created_at,
        updatedAt: gameData.updated_at,
      };
      
      setGame(foundGame);
      await updateViewCount(gameData.id);
    } catch (err) {
      console.error('Error loading game:', err);
      setError(err.message);
      setGame(null);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const updateViewCount = async (gameId) => {
    try {
      const { data: existingView } = await supabase
        .from('game_views')
        .select('view_count')
        .eq('game_id', gameId)
        .single();
      
      if (existingView) {
        const { data, error } = await supabase
          .from('game_views')
          .update({ view_count: existingView.view_count + 1 })
          .eq('game_id', gameId)
          .select()
          .single();
        
        if (!error && data) {
          setViewCount(data.view_count);
        }
      } else {
        const { data, error } = await supabase
          .from('game_views')
          .insert([{ game_id: gameId, view_count: 1 }])
          .select()
          .single();
        
        if (!error && data) {
          setViewCount(data.view_count);
        }
      }
    } catch (err) {
      console.error('Error updating view count:', err);
    }
  };

  useEffect(() => {
    loadGame();
  }, [slug]);

  return { game, loading, error, viewCount, refetch: loadGame };
}
