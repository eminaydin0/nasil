import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { rankNewsPosts } from '../lib/newsAlgorithm';

function formatRelatedGame(game) {
  if (!game) return null;
  return {
    id: game.id,
    slug: game.slug,
    name: game.name,
    image: game.image,
    shortDescription: game.short_description || game.shortDescription || '',
  };
}

export function formatNewsPost(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || '',
    excerpt: row.excerpt || '',
    content: row.content || '',
    coverImage: row.cover_image,
    category: row.category || 'Oyun Dünyası',
    tags: row.tags || [],
    relatedGameId: row.related_game_id,
    relatedGame: formatRelatedGame(row.related_game),
    author: row.author || 'Kuralı Ne?',
    authorAvatar: row.author_avatar,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    readTimeMinutes: row.read_time_minutes || 1,
    viewCount: row.view_count ?? 0,
    isPublished: row.is_published ?? false,
    isFeatured: row.is_featured ?? false,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function useNews({
  includeDrafts = false,
  limit,
  category,
  featuredOnly = false,
  sort = 'trending',
} = {}) {
  const [rawPosts, setRawPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('news_posts')
        .select(`
          *,
          related_game:games!related_game_id(id, slug, name, image)
        `);

      if (!includeDrafts) {
        query = query.eq('is_published', true);
      }
      if (category && category !== 'Tümü') {
        query = query.eq('category', category);
      }
      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      setRawPosts((data || []).map(formatNewsPost));
    } catch (err) {
      console.error('Error loading news:', err);
      setError(err.message);
      setRawPosts([]);
    } finally {
      setLoading(false);
    }
  }, [includeDrafts, category, featuredOnly]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const posts = useMemo(() => {
    const ranked = rankNewsPosts(rawPosts, { sort });
    if (limit) return ranked.slice(0, limit);
    return ranked;
  }, [rawPosts, sort, limit]);

  return { posts, rawPosts, loading, error, refetch: loadPosts };
}
