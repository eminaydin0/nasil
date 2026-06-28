import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Send, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import {
  NEWS_COMMENT_MIN_LENGTH,
  NEWS_COMMENT_MAX_LENGTH,
} from '../../constants/newsEngagement';
import { trackNewsComment } from '../../utils/analytics';

const getAvatarColor = (name) => {
  const colors = [
    'bg-orange-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500',
    'bg-cyan-500', 'bg-violet-500', 'bg-pink-500', 'bg-blue-500',
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name) => {
  if (!name) return 'M';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

const getOrCreateGuestName = () => {
  if (typeof window === 'undefined') return 'Misafir';
  let name = sessionStorage.getItem('guest_display_name');
  if (!name) {
    name = `Misafir ${Math.floor(1000 + Math.random() * 9000)}`;
    sessionStorage.setItem('guest_display_name', name);
  }
  return name;
};

const formatRelativeTime = (dateObj) => {
  if (!dateObj || Number.isNaN(dateObj.getTime())) return '';
  const diffSec = Math.floor((Date.now() - dateObj.getTime()) / 1000);
  if (diffSec < 60) return 'Az önce';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} dk önce`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} saat önce`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} gün önce`;
  return dateObj.toLocaleDateString('tr-TR');
};

function NewsCommentSection({ newsPostId, newsTitle }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [likedIds, setLikedIds] = useState(new Set());

  const authorName = user?.user_metadata?.full_name || getOrCreateGuestName();
  const authorAvatar = user?.user_metadata?.avatar_url || null;

  const loadComments = useCallback(async () => {
    if (!newsPostId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news_comments')
        .select('*')
        .eq('news_post_id', newsPostId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComments(
        (data || []).map((c) => ({
          id: c.id,
          name: c.author_name,
          avatar: c.avatar_url,
          content: c.content,
          likes: c.likes || 0,
          dateObj: new Date(c.created_at),
        }))
      );
    } catch (err) {
      console.error('Error loading news comments:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [newsPostId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('liked_news_comments') || '[]');
    setLikedIds(new Set(stored));
  }, [newsPostId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (trimmed.length < NEWS_COMMENT_MIN_LENGTH) {
      toast.error(`Yorum en az ${NEWS_COMMENT_MIN_LENGTH} karakter olmalı.`);
      return;
    }
    if (trimmed.length > NEWS_COMMENT_MAX_LENGTH) {
      toast.error(`Yorum en fazla ${NEWS_COMMENT_MAX_LENGTH} karakter olabilir.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        news_post_id: newsPostId,
        author_name: authorName,
        avatar_url: authorAvatar,
        content: trimmed,
        likes: 0,
        ...(user?.id && { author_user_id: user.id }),
      };

      const { data, error } = await supabase
        .from('news_comments')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      setComments((prev) => [
        {
          id: data.id,
          name: data.author_name,
          avatar: data.avatar_url,
          content: data.content,
          likes: 0,
          dateObj: new Date(data.created_at),
        },
        ...prev,
      ]);
      setText('');
      trackNewsComment(newsTitle, newsPostId);
      toast.success('Yorumun yayınlandı!');
    } catch (err) {
      console.error('Error posting news comment:', err);
      toast.error('Yorum gönderilemedi. SQL migration çalıştırıldı mı?');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId, currentLikes) => {
    if (likedIds.has(commentId)) {
      toast('Bu yorumu zaten beğendin.', { icon: '👍' });
      return;
    }

    const newLikes = currentLikes + 1;
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: newLikes } : c))
    );

    const nextLiked = new Set(likedIds);
    nextLiked.add(commentId);
    setLikedIds(nextLiked);
    localStorage.setItem('liked_news_comments', JSON.stringify([...nextLiked]));

    const { error } = await supabase
      .from('news_comments')
      .update({ likes: newLikes })
      .eq('id', commentId);

    if (error) {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, likes: currentLikes } : c))
      );
      nextLiked.delete(commentId);
      setLikedIds(new Set(nextLiked));
      localStorage.setItem('liked_news_comments', JSON.stringify([...nextLiked]));
    }
  };

  return (
    <section className="news-comments" aria-labelledby="news-comments-title">
      <div className="news-comments-head">
        <MessageCircle size={18} className="text-orange-600" aria-hidden />
        <div>
          <h2 id="news-comments-title" className="news-comments-title">
            Yorumlar
          </h2>
          <p className="news-comments-sub">
            {comments.length > 0
              ? `${comments.length} yorum`
              : 'İlk yorumu sen yaz'}
          </p>
        </div>
      </div>

      <form className="news-comment-form" onSubmit={handleSubmit}>
        <div className="news-comment-form-row">
          <div
            className={`news-comment-avatar ${!authorAvatar ? getAvatarColor(authorName) : ''}`}
          >
            {authorAvatar ? (
              <img src={authorAvatar} alt="" />
            ) : (
              getInitials(authorName)
            )}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bu haber hakkında ne düşünüyorsun?"
            rows={3}
            maxLength={NEWS_COMMENT_MAX_LENGTH}
            className="news-comment-input"
          />
        </div>
        <div className="news-comment-form-actions">
          <span className="news-comment-char-count">
            {text.length}/{NEWS_COMMENT_MAX_LENGTH}
          </span>
          <button
            type="submit"
            disabled={submitting || text.trim().length < NEWS_COMMENT_MIN_LENGTH}
            className="news-comment-submit"
          >
            <Send size={16} aria-hidden />
            {submitting ? 'Gönderiliyor…' : 'Yorum yap'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="news-comments-skeleton">
          {[1, 2].map((i) => (
            <div key={i} className="news-comment-skeleton" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="news-comments-empty">Henüz yorum yok. Düşünceni paylaş!</p>
      ) : (
        <ul className="news-comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="news-comment-item">
              <div
                className={`news-comment-avatar news-comment-avatar-sm ${
                  !comment.avatar ? getAvatarColor(comment.name) : ''
                }`}
              >
                {comment.avatar ? (
                  <img src={comment.avatar} alt="" />
                ) : (
                  getInitials(comment.name)
                )}
              </div>
              <div className="news-comment-body">
                <div className="news-comment-meta">
                  <span className="news-comment-author">{comment.name}</span>
                  <time dateTime={comment.dateObj.toISOString()}>
                    {formatRelativeTime(comment.dateObj)}
                  </time>
                </div>
                <p className="news-comment-text">{comment.content}</p>
                <button
                  type="button"
                  onClick={() => handleLike(comment.id, comment.likes)}
                  className={`news-comment-like ${likedIds.has(comment.id) ? 'news-comment-like-active' : ''}`}
                  aria-pressed={likedIds.has(comment.id)}
                >
                  <ThumbsUp size={14} aria-hidden />
                  {comment.likes > 0 && comment.likes}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default NewsCommentSection;
