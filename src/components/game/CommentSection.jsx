import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import StarRating from '../common/StarRating';
import { supabase } from '../../lib/supabase';
import { trackCommentSubmit } from '../../utils/analytics';
import { useAuth } from '../../context/AuthContext';

const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500',
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
    'bg-pink-500', 'bg-rose-500',
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
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

const getOrCreateGuestName = () => {
  if (typeof window === 'undefined') return 'Misafir';
  let name = sessionStorage.getItem('guest_display_name');
  if (!name) {
    const num = Math.floor(1000 + Math.random() * 9000);
    name = `Misafir ${num}`;
    sessionStorage.setItem('guest_display_name', name);
  }
  return name;
};

const formatRelativeTime = (dateObj) => {
  if (!dateObj || Number.isNaN(dateObj.getTime())) return '';
  const diffSec = Math.floor((Date.now() - dateObj.getTime()) / 1000);
  if (diffSec < 60) return 'Az önce';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} dakika önce`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} saat önce`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} gün önce`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `${diffWeek} hafta önce`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} ay önce`;
  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} yıl önce`;
};

const COMMENT_MIN_LENGTH = 10;
const COMMENT_MAX_LENGTH = 1000;
const INITIAL_COMMENTS_SHOW = 15;
const INITIAL_REPLIES_SHOW = 2;

function Avatar({ name, avatarUrl, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-10 h-10 text-sm';
  const color = getAvatarColor(name);

  return (
    <div
      className={`${sizeClass} shrink-0 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden ${!avatarUrl ? color : ''}`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}

function CommentSection({ gameId, gameName, gameSlug }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [likedComments, setLikedComments] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(INITIAL_COMMENTS_SHOW);
  const [submitting, setSubmitting] = useState(false);
  const [replyingSubmitting, setReplyingSubmitting] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const currentUserName = user?.user_metadata?.full_name || getOrCreateGuestName();
  const currentUserAvatar = user?.user_metadata?.avatar_url || null;

  const [newComment, setNewComment] = useState({ rating: 0, comment: '' });
  const [composerOpen, setComposerOpen] = useState(false);
  const newCommentRef = useRef(null);
  const composerRef = useRef(null);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('game_id', gameId);

      if (error) throw error;

      const formattedComments = data.map((c) => ({
        id: c.id,
        name: c.author_name,
        avatar: c.avatar_url,
        rating: c.rating,
        comment: c.content,
        author_user_id: c.author_user_id || null,
        dateObj: new Date(c.created_at),
        date: new Date(c.created_at).toLocaleDateString('tr-TR'),
        likes: c.likes || 0,
        replies: c.replies || [],
        isTestimonial: c.is_testimonial || false,
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Yorumlar yüklenirken bir sorun oluştu.');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    setVisibleCount(INITIAL_COMMENTS_SHOW);
    setReplyingTo(null);
    setReplyText('');
    setComposerOpen(false);
  }, [gameId]);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('liked_comments') || '[]');
    const likesSet = new Set(storedLikes);
    setLikedComments(likesSet);

    const syncLikes = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id);

        if (!error && data) {
          const dbLikes = data.map((l) => l.comment_id);
          const newSet = new Set([...likesSet, ...dbLikes]);
          setLikedComments(newSet);
          localStorage.setItem('liked_comments', JSON.stringify([...newSet]));
        }
      } catch (err) {
        console.error('Error syncing likes:', err);
      }
    };

    syncLikes();
  }, [user]);

  const sortedComments = useMemo(() => {
    const sorted = [...comments];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => b.dateObj - a.dateObj);
      case 'oldest':
        return sorted.sort((a, b) => a.dateObj - b.dateObj);
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'popular':
      default:
        return sorted.sort((a, b) => b.likes - a.likes);
    }
  }, [comments, sortBy]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = newComment.comment.trim();

    if (!trimmed || newComment.rating === 0) {
      toast.error('Lütfen puan verin ve yorumunuzu yazın.');
      return;
    }
    if (trimmed.length < COMMENT_MIN_LENGTH) {
      toast.error(`Yorum en az ${COMMENT_MIN_LENGTH} karakter olmalıdır.`);
      return;
    }
    if (trimmed.length > COMMENT_MAX_LENGTH) {
      toast.error(`Yorum en fazla ${COMMENT_MAX_LENGTH} karakter olabilir.`);
      return;
    }

    setSubmitting(true);
    try {
      const commentData = {
        game_id: gameId,
        author_name: currentUserName,
        avatar_url: currentUserAvatar,
        content: trimmed,
        rating: newComment.rating,
        likes: 0,
        replies: [],
        is_testimonial: false,
        ...(user?.id && { author_user_id: user.id }),
      };

      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select()
        .single();

      if (error) throw error;

      const formattedComment = {
        id: data.id,
        name: data.author_name,
        avatar: data.avatar_url,
        rating: data.rating,
        comment: data.content,
        dateObj: new Date(data.created_at),
        date: new Date(data.created_at).toLocaleDateString('tr-TR'),
        likes: 0,
        replies: [],
        isTestimonial: false,
      };

      setComments([formattedComment, ...comments]);
      setNewComment({ rating: 0, comment: '' });
      setComposerOpen(false);
      setVisibleCount((c) => c + 1);

      trackCommentSubmit(gameName || 'Unknown', gameId, newComment.rating);
      toast.success('Yorumunuz paylaşıldı!');

      setTimeout(() => {
        newCommentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (error) {
      console.error('Error saving comment:', error);
      toast.error('Yorum kaydedilemedi. Tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (commentId, parentReplyId = null, mentionName = null) => {
    const trimmed = replyText.trim();
    if (!trimmed) {
      toast.error('Lütfen yanıtınızı yazın.');
      return;
    }
    if (trimmed.length > COMMENT_MAX_LENGTH) {
      toast.error(`Yanıt en fazla ${COMMENT_MAX_LENGTH} karakter olabilir.`);
      return;
    }
    setReplyingSubmitting(true);

    const reply = {
      id: Date.now(),
      text: trimmed,
      date: new Date().toLocaleDateString('tr-TR'),
      dateObj: new Date(),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      name: currentUserName,
      avatar: currentUserAvatar,
      mentionName: mentionName || null,
      likes: 0,
      replies: [],
    };

    const updatedComments = comments.map((c) => {
      if (c.id === commentId) {
        if (parentReplyId) {
          const addReplyToNested = (replies) =>
            replies.map((r) => {
              if (r.id === parentReplyId) {
                return { ...r, replies: [...(r.replies || []), reply] };
              }
              if (r.replies?.length) {
                return { ...r, replies: addReplyToNested(r.replies) };
              }
              return r;
            });

          return { ...c, replies: addReplyToNested(c.replies || []) };
        }
        return { ...c, replies: [...(c.replies || []), reply] };
      }
      return c;
    });

    setComments(updatedComments);

    try {
      const targetComment = updatedComments.find((c) => c.id === commentId);
      await supabase.from('comments').update({ replies: targetComment.replies }).eq('id', commentId);

      const commentRepliedTo = comments.find((c) => c.id === commentId);
      if (user?.id && commentRepliedTo?.author_user_id && commentRepliedTo.author_user_id !== user.id) {
        const link = gameSlug ? `/oyun/${gameSlug}` : '#yorumlar';
        await supabase.from('notifications').insert({
          user_id: commentRepliedTo.author_user_id,
          type: 'comment_reply',
          title: 'Yorumuna yanıt verildi',
          content: `${currentUserName} yorumuna yanıt yazdı: ${trimmed.slice(0, 60)}${trimmed.length > 60 ? '…' : ''}`,
          link,
          icon: '💬',
        });
      }

      setReplyText('');
      setReplyingTo(null);
      toast.success('Yanıtınız eklendi.');
    } catch (error) {
      console.error('Reply error:', error);
      toast.error('Yanıt kaydedilemedi. Tekrar deneyin.');
    } finally {
      setReplyingSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    const isLiked = likedComments.has(commentId);

    const updatedComments = comments.map((c) =>
      c.id === commentId ? { ...c, likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1 } : c
    );
    setComments(updatedComments);

    const newLikedSet = new Set(likedComments);
    if (isLiked) {
      newLikedSet.delete(commentId);
    } else {
      newLikedSet.add(commentId);
    }
    setLikedComments(newLikedSet);
    localStorage.setItem('liked_comments', JSON.stringify([...newLikedSet]));

    try {
      if (user) {
        if (isLiked) {
          await supabase.from('comment_likes').delete().eq('user_id', user.id).eq('comment_id', commentId);
        } else {
          await supabase.from('comment_likes').insert({ user_id: user.id, comment_id: commentId });
        }
      }

      const targetComment = updatedComments.find((c) => c.id === commentId);
      await supabase.from('comments').update({ likes: targetComment.likes }).eq('id', commentId);

      if (!isLiked && user) {
        const commentLiked = comments.find((c) => c.id === commentId);
        if (commentLiked?.author_user_id && commentLiked.author_user_id !== user.id) {
          const link = gameSlug ? `/oyun/${gameSlug}` : '#yorumlar';
          await supabase.from('notifications').insert({
            user_id: commentLiked.author_user_id,
            type: 'comment_like',
            title: 'Yorumun beğenildi',
            content: `${currentUserName} yorumunu beğendi.`,
            link,
            icon: '❤️',
          });
        }
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const visibleComments = useMemo(
    () => sortedComments.slice(0, visibleCount),
    [sortedComments, visibleCount]
  );
  const hasMoreComments = sortedComments.length > visibleCount;

  const sortOptions = [
    { value: 'popular', label: 'En popüler' },
    { value: 'newest', label: 'En yeni' },
    { value: 'oldest', label: 'En eski' },
    { value: 'highest', label: 'En yüksek puan' },
    { value: 'lowest', label: 'En düşük puan' },
  ];

  return (
    <section id="yorumlar" className="bg-white rounded-2xl border border-warm-200/80 overflow-hidden w-full">
      {/* Başlık — YouTube tarzı */}
      <div className="px-4 sm:px-6 pt-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-warm-900 tabular-nums">
          {loading ? '…' : `${comments.length} yorum`}
        </h2>
        {comments.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-warm-600 shrink-0">
            <span className="font-medium whitespace-nowrap">Sıralama ölçütü:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-warm-900 border-none outline-none cursor-pointer pr-1"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="px-4 sm:px-6 pb-6">
        {/* Yorum yaz — YouTube tarzı composer */}
        <div ref={composerRef} className="flex gap-3 sm:gap-4 mb-8">
          <Avatar name={currentUserName} avatarUrl={currentUserAvatar} />
          <div className="flex-1 min-w-0">
            {!composerOpen ? (
              <button
                type="button"
                onClick={() => setComposerOpen(true)}
                className="w-full text-left pb-2 border-b border-warm-300 text-sm text-warm-500 hover:border-charcoal-900 transition-colors"
              >
                Yorum ekleyin…
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-2 pb-1">
                  <span className="text-xs text-warm-500 font-medium">Puanın:</span>
                  <StarRating
                    rating={newComment.rating}
                    onRatingChange={(r) => setNewComment({ ...newComment, rating: r })}
                    size={22}
                  />
                </div>
                <textarea
                  autoFocus
                  value={newComment.comment}
                  onChange={(e) =>
                    setNewComment({ ...newComment, comment: e.target.value.slice(0, COMMENT_MAX_LENGTH) })
                  }
                  rows={3}
                  maxLength={COMMENT_MAX_LENGTH}
                  placeholder="Oyun hakkında ne düşünüyorsun?"
                  className="w-full bg-transparent border-b border-warm-300 pb-2 text-sm text-warm-900 placeholder:text-warm-500 focus:border-charcoal-900 outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setComposerOpen(false);
                      setNewComment({ rating: 0, comment: '' });
                    }}
                    className="px-4 py-2 text-sm font-semibold text-warm-700 rounded-full hover:bg-warm-100 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-semibold text-white bg-charcoal-900 rounded-full hover:bg-charcoal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Gönderiliyor…' : 'Yorum yap'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Yorum listesi */}
        <div ref={newCommentRef} className="space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-warm-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-warm-200 rounded w-1/4" />
                    <div className="h-3 bg-warm-200 rounded w-full" />
                    <div className="h-3 bg-warm-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-warm-500 py-4">Henüz yorum yok. İlk yorumu sen yaz!</p>
          ) : (
            <>
              {visibleComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  handleLike={handleLike}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  handleReplySubmit={handleReplySubmit}
                  currentUserName={currentUserName}
                  currentUserAvatar={currentUserAvatar}
                  likedComments={likedComments}
                  replyingSubmitting={replyingSubmitting}
                />
              ))}
              {hasMoreComments && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + INITIAL_COMMENTS_SHOW)}
                  className="flex items-center gap-2 text-sm font-semibold text-warm-700 hover:text-warm-900 py-2"
                >
                  <ChevronDown size={18} />
                  Daha fazla yorum göster ({sortedComments.length - visibleCount})
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ActionBar({ likeCount, isLiked, onLike, onReply, replyLabel = 'Yanıtla' }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <button
        type="button"
        onClick={onLike}
        className={`group flex items-center gap-1.5 p-2 rounded-full hover:bg-warm-100 transition-colors ${isLiked ? 'text-warm-900' : 'text-warm-600'}`}
        aria-label="Beğen"
      >
        <ThumbsUp size={16} className={isLiked ? 'fill-current' : ''} />
        {likeCount > 0 && <span className="text-xs font-medium tabular-nums">{likeCount}</span>}
      </button>
      <button
        type="button"
        className="p-2 rounded-full text-warm-600 hover:bg-warm-100 transition-colors"
        aria-label="Beğenme"
        tabIndex={-1}
      >
        <ThumbsDown size={16} />
      </button>
      <button
        type="button"
        onClick={onReply}
        className="px-3 py-2 text-xs font-semibold text-warm-600 hover:bg-warm-100 rounded-full transition-colors"
      >
        {replyLabel}
      </button>
    </div>
  );
}

function ReplyForm({
  mentionName,
  replyText,
  setReplyText,
  onCancel,
  onSubmit,
  submitting,
  currentUserName,
  currentUserAvatar,
}) {
  return (
    <div className="flex gap-3 mt-3">
      <Avatar name={currentUserName} avatarUrl={currentUserAvatar} size="sm" />
      <div className="flex-1 min-w-0">
        {mentionName && (
          <p className="text-xs text-warm-500 mb-1">
            <span className="text-orange-600 font-medium">{mentionName}</span> yanıtlanıyor
          </p>
        )}
        <textarea
          autoFocus
          value={replyText}
          onChange={(e) => setReplyText(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
          rows={2}
          placeholder="Yanıt ekle…"
          className="w-full bg-transparent border-b border-warm-300 pb-2 text-sm text-warm-900 placeholder:text-warm-500 focus:border-charcoal-900 outline-none resize-none"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-semibold text-warm-700 rounded-full hover:bg-warm-100"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || !replyText.trim()}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-charcoal-900 rounded-full hover:bg-charcoal-800 disabled:opacity-50"
          >
            {submitting ? '…' : 'Yanıtla'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  handleLike,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  handleReplySubmit,
  currentUserName,
  currentUserAvatar,
  likedComments,
  replyingSubmitting,
}) {
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const [visibleReplyCount, setVisibleReplyCount] = useState(INITIAL_REPLIES_SHOW);
  const isReplying = replyingTo === comment.id;
  const isLiked = likedComments?.has(comment.id);
  const replyCount = comment.replies?.length || 0;
  const visibleReplies = repliesExpanded
    ? comment.replies?.slice(0, visibleReplyCount) || []
    : [];

  return (
    <article className="flex gap-3 sm:gap-4">
      <Avatar name={comment.name} avatarUrl={comment.avatar} />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-warm-900">{comment.name}</span>
          {comment.isTestimonial && (
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">Onaylı</span>
          )}
          <span className="text-xs text-warm-500">{formatRelativeTime(comment.dateObj)}</span>
          {comment.rating > 0 && (
            <span className="text-xs text-amber-600 font-medium">★ {comment.rating}/5</span>
          )}
        </div>

        <p className="text-sm text-warm-900 leading-relaxed mt-1 break-words whitespace-pre-wrap">
          {comment.comment}
        </p>

        <ActionBar
          likeCount={comment.likes}
          isLiked={isLiked}
          onLike={() => handleLike(comment.id)}
          onReply={() => setReplyingTo(isReplying ? null : comment.id)}
        />

        {isReplying && (
          <ReplyForm
            mentionName={comment.name}
            replyText={replyText}
            setReplyText={setReplyText}
            onCancel={() => setReplyingTo(null)}
            onSubmit={() => handleReplySubmit(comment.id, null, comment.name)}
            submitting={replyingSubmitting}
            currentUserName={currentUserName}
            currentUserAvatar={currentUserAvatar}
          />
        )}

        {replyCount > 0 && !repliesExpanded && (
          <button
            type="button"
            onClick={() => setRepliesExpanded(true)}
            className="flex items-center gap-2 mt-2 ml-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            <ChevronDown size={18} />
            {replyCount} yanıt
          </button>
        )}

        {repliesExpanded && replyCount > 0 && (
          <div className="mt-3 space-y-4 pl-1 border-l-2 border-warm-200 ml-3">
            {visibleReplies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                commentId={comment.id}
                parentName={comment.name}
                handleReplySubmit={handleReplySubmit}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                currentUserName={currentUserName}
                currentUserAvatar={currentUserAvatar}
                replyingSubmitting={replyingSubmitting}
              />
            ))}

            {visibleReplyCount < replyCount && (
              <button
                type="button"
                onClick={() => setVisibleReplyCount((c) => c + INITIAL_REPLIES_SHOW)}
                className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 ml-12"
              >
                <ChevronDown size={18} />
                Daha fazla yanıt göster
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setRepliesExpanded(false);
                setVisibleReplyCount(INITIAL_REPLIES_SHOW);
              }}
              className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 ml-12"
            >
              <ChevronUp size={18} />
              Yanıtları gizle
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function ReplyItem({
  reply,
  commentId,
  parentName,
  handleReplySubmit,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  currentUserName,
  currentUserAvatar,
  replyingSubmitting,
}) {
  const [nestedExpanded, setNestedExpanded] = useState(false);
  const isReplying = replyingTo === reply.id;
  const nestedCount = reply.replies?.length || 0;

  return (
    <div className="flex gap-3 ml-2">
      <Avatar name={reply.name} avatarUrl={reply.avatar} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-xs font-semibold text-warm-900">{reply.name}</span>
          <span className="text-[11px] text-warm-500">
            {reply.dateObj ? formatRelativeTime(reply.dateObj) : reply.time || reply.date}
          </span>
        </div>

        <p className="text-sm text-warm-900 leading-relaxed mt-0.5 break-words">
          {(reply.mentionName || parentName) && (
            <span className="text-orange-600 font-medium mr-1">
              {reply.mentionName || parentName}
            </span>
          )}
          {reply.text}
        </p>

        <button
          type="button"
          onClick={() => setReplyingTo(isReplying ? null : reply.id)}
          className="mt-1 px-2 py-1 text-xs font-semibold text-warm-600 hover:bg-warm-100 rounded-full transition-colors"
        >
          Yanıtla
        </button>

        {isReplying && (
          <ReplyForm
            mentionName={reply.name}
            replyText={replyText}
            setReplyText={setReplyText}
            onCancel={() => setReplyingTo(null)}
            onSubmit={() => handleReplySubmit(commentId, reply.id, reply.name)}
            submitting={replyingSubmitting}
            currentUserName={currentUserName}
            currentUserAvatar={currentUserAvatar}
          />
        )}

        {nestedCount > 0 && !nestedExpanded && (
          <button
            type="button"
            onClick={() => setNestedExpanded(true)}
            className="flex items-center gap-1 mt-2 text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            <ChevronDown size={16} />
            {nestedCount} yanıt
          </button>
        )}

        {nestedExpanded && nestedCount > 0 && (
          <div className="mt-2 space-y-3 pl-1 border-l-2 border-warm-200 ml-1">
            {reply.replies.map((nested) => (
              <ReplyItem
                key={nested.id}
                reply={nested}
                commentId={commentId}
                parentName={reply.name}
                handleReplySubmit={handleReplySubmit}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                currentUserName={currentUserName}
                currentUserAvatar={currentUserAvatar}
                replyingSubmitting={replyingSubmitting}
              />
            ))}
            <button
              type="button"
              onClick={() => setNestedExpanded(false)}
              className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 ml-8"
            >
              <ChevronUp size={16} />
              Yanıtları gizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
