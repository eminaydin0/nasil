import { useState, useEffect, useMemo } from 'react';
import {
  MessageCircle,
  Trash2,
  ThumbsUp,
  Loader2,
  Filter,
  Inbox,
  Smile,
  ExternalLink,
  Newspaper,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useConfirm } from '../ui';
import toast from 'react-hot-toast';
import { NEWS_REACTIONS, aggregateReactionCounts } from '../../constants/newsEngagement';

const SORT_OPTIONS = [
  { value: 'newest', label: 'En yeni' },
  { value: 'oldest', label: 'En eski' },
  { value: 'most_likes', label: 'En beğenilen' },
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function NewsEngagementManager() {
  const confirm = useConfirm();
  const [activeView, setActiveView] = useState('comments');
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const loadData = async () => {
    setLoading(true);
    try {
      const [commentsRes, postsRes, reactionsRes] = await Promise.all([
        supabase
          .from('news_comments')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('news_posts')
          .select('id, slug, title, is_published')
          .order('title'),
        supabase.from('news_reactions').select('news_post_id, emoji'),
      ]);

      if (commentsRes.error) throw commentsRes.error;
      if (postsRes.error) throw postsRes.error;
      if (reactionsRes.error) throw reactionsRes.error;

      const postsMap = Object.fromEntries((postsRes.data || []).map((p) => [p.id, p]));

      setPosts(postsRes.data || []);
      setComments(
        (commentsRes.data || []).map((c) => ({
          id: c.id,
          name: c.author_name,
          content: c.content,
          likes: c.likes || 0,
          createdAt: c.created_at,
          postId: c.news_post_id,
          postTitle: postsMap[c.news_post_id]?.title || 'Silinmiş haber',
          postSlug: postsMap[c.news_post_id]?.slug,
          isPublished: postsMap[c.news_post_id]?.is_published,
          avatarUrl: c.avatar_url,
        }))
      );

      const reactionGroups = {};
      (reactionsRes.data || []).forEach((r) => {
        if (!reactionGroups[r.news_post_id]) {
          reactionGroups[r.news_post_id] = [];
        }
        reactionGroups[r.news_post_id].push({ emoji: r.emoji });
      });

      setReactions(
        Object.entries(reactionGroups)
          .map(([postId, rows]) => {
            const post = postsMap[Number(postId)];
            const counts = aggregateReactionCounts(rows);
            const total = Object.values(counts).reduce((s, n) => s + n, 0);
            return {
              postId: Number(postId),
              postTitle: post?.title || 'Silinmiş haber',
              postSlug: post?.slug,
              isPublished: post?.is_published,
              counts,
              total,
            };
          })
          .sort((a, b) => b.total - a.total)
      );
    } catch (err) {
      console.error('Error loading news engagement:', err);
      toast.error('Haber etkileşimleri yüklenemedi');
      setComments([]);
      setReactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredComments = useMemo(() => {
    let list = [...comments];
    if (selectedPost !== 'all') {
      list = list.filter((c) => String(c.postId) === selectedPost);
    }
    switch (sortBy) {
      case 'oldest':
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'most_likes':
        list.sort((a, b) => b.likes - a.likes);
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [comments, selectedPost, sortBy]);

  const handleDelete = async (commentId) => {
    const ok = await confirm({
      type: 'danger',
      title: 'Yorumu sil',
      description: 'Bu haber yorumu kalıcı olarak silinecek.',
      confirmText: 'Sil',
      cancelText: 'Vazgeç',
    });
    if (!ok) return;

    try {
      const { error } = await supabase.from('news_comments').delete().eq('id', commentId);
      if (error) throw error;
      toast.success('Yorum silindi');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Yorum silinemedi');
    }
  };

  const totalComments = comments.length;
  const totalReactions = reactions.reduce((s, r) => s + r.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-warm-900">Haber Etkileşimleri</h2>
          <p className="text-sm text-warm-600">
            Haber yorumlarını moderasyon et, emoji reaksiyonlarını incele
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="rounded-full bg-orange-50 px-3 py-1 font-bold text-orange-700">
            {totalComments} yorum
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
            {totalReactions} reaksiyon
          </span>
        </div>
      </div>

      <div className="flex gap-2 border-b border-warm-200">
        <button
          type="button"
          onClick={() => setActiveView('comments')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
            activeView === 'comments'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-warm-500 hover:text-warm-800'
          }`}
        >
          <MessageCircle size={16} />
          Yorumlar
        </button>
        <button
          type="button"
          onClick={() => setActiveView('reactions')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
            activeView === 'reactions'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-warm-500 hover:text-warm-800'
          }`}
        >
          <Smile size={16} />
          Emoji reaksiyonları
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      ) : activeView === 'comments' ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-warm-700">
              <Filter size={16} className="text-warm-400" />
              Filtre
            </div>
            <select
              value={selectedPost}
              onChange={(e) => setSelectedPost(e.target.value)}
              className="rounded-lg border border-warm-200 px-3 py-2 text-sm"
            >
              <option value="all">Tüm haberler</option>
              {posts.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.title}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-warm-200 px-3 py-2 text-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {filteredComments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-warm-200 bg-white py-16 text-center">
              <Inbox className="mx-auto mb-3 text-warm-300" size={40} />
              <p className="font-semibold text-warm-700">Henüz haber yorumu yok</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComments.map((c) => (
                <article
                  key={c.id}
                  className="rounded-xl border border-warm-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-warm-900">{c.name}</p>
                      <p className="text-xs text-warm-500">{formatDate(c.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.likes > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                          <ThumbsUp size={12} />
                          {c.likes}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        aria-label="Yorumu sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-warm-700">
                    {c.content}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-xs font-bold text-orange-800">
                      <Newspaper size={12} />
                      {c.postTitle}
                    </span>
                    {c.postSlug && c.isPublished && (
                      <Link
                        to={`/haberler/${c.postSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
                      >
                        Haberi aç
                        <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      ) : reactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-warm-200 bg-white py-16 text-center">
          <Smile className="mx-auto mb-3 text-warm-300" size={40} />
          <p className="font-semibold text-warm-700">Henüz emoji reaksiyonu yok</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-warm-100 bg-cream-50 text-xs font-bold uppercase tracking-wide text-warm-500">
                <tr>
                  <th className="px-4 py-3">Haber</th>
                  {NEWS_REACTIONS.map((r) => (
                    <th key={r.emoji} className="px-2 py-3 text-center" title={r.label}>
                      {r.emoji}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {reactions.map((row) => (
                  <tr key={row.postId} className="hover:bg-cream-50/80">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-warm-900 line-clamp-1">{row.postTitle}</p>
                      {row.postSlug && row.isPublished && (
                        <Link
                          to={`/haberler/${row.postSlug}`}
                          target="_blank"
                          className="text-xs text-orange-600 hover:underline"
                        >
                          /haberler/{row.postSlug}
                        </Link>
                      )}
                    </td>
                    {NEWS_REACTIONS.map((r) => (
                      <td key={r.emoji} className="px-2 py-3 text-center font-bold text-warm-700">
                        {row.counts[r.emoji] || '—'}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right font-black text-orange-600">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsEngagementManager;

/** Son 7 gündeki haber yorumu sayısı (sidebar badge için) */
export async function fetchRecentNewsCommentCount(days = 7) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { count, error } = await supabase
      .from('news_comments')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', since.toISOString());
    if (error) throw error;
    return count || 0;
  } catch {
    return 0;
  }
}

export async function fetchNewsDashboardStats() {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [postsRes, commentsRes, commentCountRes] = await Promise.all([
      supabase
        .from('news_posts')
        .select('id, slug, title, is_published, is_featured, view_count, published_at, created_at')
        .order('view_count', { ascending: false }),
      supabase
        .from('news_comments')
        .select('id, author_name, content, likes, created_at, news_post_id')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('news_comments').select('id', { count: 'exact', head: true }),
    ]);

    if (postsRes.error) throw postsRes.error;

    const posts = postsRes.data || [];
    const published = posts.filter((p) => p.is_published);
    const drafts = posts.filter((p) => !p.is_published);
    const totalViews = posts.reduce((s, p) => s + (p.view_count || 0), 0);
    const viewsLast7Days = published.filter((p) => {
      const d = new Date(p.published_at || p.created_at);
      return d >= weekAgo;
    }).length;

    const topPosts = [...published].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5);

    const postTitles = Object.fromEntries(posts.map((p) => [p.id, p.title]));

    return {
      total: posts.length,
      published: published.length,
      drafts: drafts.length,
      featured: posts.filter((p) => p.is_featured).length,
      totalViews,
      recentlyPublished: viewsLast7Days,
      topPosts,
      recentComments: (commentsRes.data || []).map((c) => ({
        id: c.id,
        name: c.author_name,
        content:
          c.content?.substring(0, 80) + (c.content?.length > 80 ? '…' : ''),
        likes: c.likes || 0,
        postTitle: postTitles[c.news_post_id] || 'Haber',
        date: new Date(c.created_at).toLocaleDateString('tr-TR'),
      })),
      commentCount: commentCountRes.count || 0,
    };
  } catch (err) {
    console.error('fetchNewsDashboardStats:', err);
    return null;
  }
}
