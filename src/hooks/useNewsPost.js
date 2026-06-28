import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { formatNewsPost } from './useNews';

export function useNewsPost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPost = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('news_posts')
        .select(`
          *,
          related_game:games!related_game_id(id, slug, name, image, short_description)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (fetchError) throw fetchError;
      setPost(formatNewsPost(data));
    } catch (err) {
      console.error('Error loading news post:', err);
      setError(err.message);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  useEffect(() => {
    if (!slug || loading || error || !post) return;

    const key = `news-view-${slug}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, '1');
    supabase.rpc('increment_news_view', { post_slug: slug }).then(({ error: rpcError }) => {
      if (!rpcError) {
        setPost((prev) =>
          prev ? { ...prev, viewCount: (prev.viewCount || 0) + 1 } : prev
        );
      }
    });
  }, [slug, loading, error, post?.id]);

  return { post, loading, error, refetch: loadPost };
}
