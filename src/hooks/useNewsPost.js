import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { formatNewsPost } from './useNews';
import { storedNewsSlug } from '../constants/newsSlugRedirects';

export function useNewsPost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPost = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      const select = `
          *,
          related_game:games!related_game_id(id, slug, name, image, short_description)
        `;
      const fetchBySlug = (value) =>
        supabase
          .from('news_posts')
          .select(select)
          .eq('slug', value)
          .eq('is_published', true)
          .maybeSingle();

      let { data, error: fetchError } = await fetchBySlug(slug);
      const stored = storedNewsSlug(slug);
      if (!data && !fetchError && stored !== slug) {
        const fallback = await fetchBySlug(stored);
        data = fallback.data;
        fetchError = fallback.error;
      }

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Haber bulunamadı');
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
    supabase.rpc('increment_news_view', { post_slug: post.slug || slug }).then(({ error: rpcError }) => {
      if (!rpcError) {
        setPost((prev) =>
          prev ? { ...prev, viewCount: (prev.viewCount || 0) + 1 } : prev
        );
      }
    });
  }, [slug, loading, error, post?.id]);

  return { post, loading, error, refetch: loadPost };
}
