import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MessageCircle, ThumbsUp, Reply, Star, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StarRating from '../common/StarRating';
import { supabase } from '../../lib/supabase';
import { trackCommentSubmit } from '../../utils/analytics';
import { useAuth } from '../../context/AuthContext';

// Helper to generate consistent colors from names
const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 
    'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 
    'bg-pink-500', 'bg-rose-500'
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
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

// Misafir kullanıcı için otomatik isim (oturum boyunca aynı kalır)
const getOrCreateGuestName = () => {
  if (typeof window === 'undefined') return 'Misafir';
  let name = sessionStorage.getItem('guest_display_name');
  if (!name) {
    const num = Math.floor(1000 + Math.random() * 9000); // 1000-9999 arası
    name = `Misafir ${num}`;
    sessionStorage.setItem('guest_display_name', name);
  }
  return name;
};

const COMMENT_MIN_LENGTH = 10;
const COMMENT_MAX_LENGTH = 1000;
const INITIAL_COMMENTS_SHOW = 15;

function CommentSection({ gameId, gameName }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [likedComments, setLikedComments] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(INITIAL_COMMENTS_SHOW);
  const [submitting, setSubmitting] = useState(false);
  const [replyingSubmitting, setReplyingSubmitting] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToComment, setReplyingToComment] = useState(null);
  const [replyText, setReplyText] = useState('');

  const currentUserName = user?.user_metadata?.full_name || getOrCreateGuestName();
  const currentUserAvatar = user?.user_metadata?.avatar_url || null;

  const [newComment, setNewComment] = useState({ rating: 0, comment: '' });
  const [showForm, setShowForm] = useState(false);
  const newCommentRef = useRef(null);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('game_id', gameId);
      
      if (error) throw error;
      
      const formattedComments = data.map(c => ({
        id: c.id,
        name: c.author_name,
        avatar: c.avatar_url,
        rating: c.rating,
        comment: c.content,
        // Converting to date object for sorting
        dateObj: new Date(c.created_at), 
        date: new Date(c.created_at).toLocaleDateString('tr-TR'),
        likes: c.likes || 0,
        replies: c.replies || [],
        isTestimonial: c.is_testimonial || false
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
    setReplyingToComment(null);
    setReplyText('');
  }, [gameId]);

  // Load liked comments from localStorage and DB
  useEffect(() => {
    // 1. Load from localStorage (Guest/Fallback)
    const storedLikes = JSON.parse(localStorage.getItem('liked_comments') || '[]');
    const likesSet = new Set(storedLikes);
    setLikedComments(likesSet);

    // 2. If logged in, sync with DB
    const syncLikes = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id);

        if (!error && data) {
          const dbLikes = data.map(l => l.comment_id);
          // Merge with localStorage
          const newSet = new Set([...likesSet, ...dbLikes]);
          setLikedComments(newSet);
          
          // Optionally update localStorage to match
          localStorage.setItem('liked_comments', JSON.stringify([...newSet]));
        }
      } catch (err) {
        console.error('Error syncing likes:', err);
      }
    };

    syncLikes();
  }, [user]);

  // Derived sorted comments
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
        return sorted.sort((a, b) => b.likes - a.likes);
      default:
        return sorted;
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
        is_testimonial: false
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
        isTestimonial: false
      };

      setComments([formattedComment, ...comments]);
      setNewComment({ rating: 0, comment: '' });
      setShowForm(false);
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

  const handleReplySubmit = async (commentId, parentReplyId = null) => {
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
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      name: currentUserName,
      avatar: currentUserAvatar,
      likes: 0,
      replies: []
    };

    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        if (parentReplyId) {
          // Recursive update for nested replies
          const addReplyToNested = (replies) => {
            return replies.map(r => {
              if (r.id === parentReplyId) {
                return { ...r, replies: [...(r.replies || []), reply] };
              }
              if (r.replies?.length) {
                return { ...r, replies: addReplyToNested(r.replies) };
              }
              return r;
            });
          };
          
          return { ...c, replies: addReplyToNested(c.replies || []) };
        } else {
          // Top level reply to comment
          return { ...c, replies: [...(c.replies || []), reply] };
        }
      }
      return c;
    });

    setComments(updatedComments);
    
    try {
      const targetComment = updatedComments.find(c => c.id === commentId);
      await supabase
        .from('comments')
        .update({ replies: targetComment.replies })
        .eq('id', commentId);
        
      setReplyText('');
      setReplyingTo(null);
      setReplyingToComment(null);
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
    
    // Optimistic Update
    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1 } : c
    );
    setComments(updatedComments);
    
    // Update Local State & Storage
    const newLikedSet = new Set(likedComments);
    if (isLiked) {
      newLikedSet.delete(commentId);
    } else {
      newLikedSet.add(commentId);
    }
    setLikedComments(newLikedSet);
    localStorage.setItem('liked_comments', JSON.stringify([...newLikedSet]));

    try {
      // 1. Interact with database based on user login status
      if (user) {
        if (isLiked) {
           await supabase
            .from('comment_likes')
            .delete()
            .eq('user_id', user.id)
            .eq('comment_id', commentId);
        } else {
           await supabase
            .from('comment_likes')
            .insert({
              user_id: user.id,
              comment_id: commentId
            });
        }
      }

      // 2. Update likes count in public.comments table
      const targetComment = updatedComments.find(c => c.id === commentId);
      await supabase
        .from('comments')
        .update({ likes: targetComment.likes })
        .eq('id', commentId);
        
      if (!isLiked) toast.success('Beğenildi');
    } catch (error) {
       console.error('Like error:', error);
       // Revert in case of total failure? usually fine to leave optimistic state 
       // unless strict consistency is needed.
    }
  };

  // Stats
  const averageRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: comments.filter(c => c.rating === star).length,
    percentage: comments.length ? (comments.filter(c => c.rating === star).length / comments.length) * 100 : 0
  }));

  // Avatar colors for current user form
  const myAvatarColor = getAvatarColor(currentUserName);
  const myInitials = getInitials(currentUserName);

  const formRef = useRef(null);

  const handleOpenForm = () => {
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleCloseForm = () => setShowForm(false);

  const visibleComments = useMemo(
    () => sortedComments.slice(0, visibleCount),
    [sortedComments, visibleCount]
  );
  const hasMoreComments = sortedComments.length > visibleCount;

  const sortOptions = [
    { value: 'newest', label: 'En Yeniler' },
    { value: 'popular', label: 'En Popüler' },
    { value: 'highest', label: 'En Yüksek Puan' },
    { value: 'oldest', label: 'En Eskiler' },
    { value: 'lowest', label: 'En Düşük Puan' },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden w-full">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5" />
        <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
            {/* Sol: Başlık + Özet */}
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-2.5 bg-orange-100 rounded-xl shrink-0">
                  <MessageCircle className="text-orange-600" size={24} />
                </div>
                <span className="truncate">Oyuncu Yorumları</span>
              </h2>
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-4xl sm:text-5xl font-black text-gray-900">{averageRating}</span>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={`shrink-0 ${s <= Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">{comments.length} değerlendirme</span>
                </div>
              </div>
            </div>

            {/* Sağ: Rating dağılımı */}
            {comments.length > 0 && (
              <div className="flex-1 w-full min-w-0 max-w-xs space-y-1.5 sm:space-y-2">
                {ratingCounts.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-2 sm:gap-3">
                    <span className="flex items-center gap-0.5 w-6 sm:w-8 text-xs sm:text-sm font-medium text-gray-600 shrink-0">
                      {star}
                      <Star size={10} className="text-amber-400 fill-amber-400 hidden sm:block" />
                    </span>
                    <div className="flex-1 min-w-0 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-4 sm:w-6 text-right text-xs text-gray-400 font-medium shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-8">
        {/* Yorum Yaz */}
        <div ref={formRef} className="mb-8 sm:mb-10">
          {!showForm ? (
            <button
              type="button"
              onClick={handleOpenForm}
              className="w-full py-4 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-50/80 hover:to-amber-50/50 transition-all duration-300 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 group"
            >
              <div className="flex items-center gap-3 sm:gap-4 sm:flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-orange-100 flex items-center justify-center shrink-0 group-hover:bg-orange-200 group-hover:scale-105 transition-all duration-300">
                  <MessageCircle className="text-orange-600" size={24} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-bold text-gray-900 text-base sm:text-lg">Deneyimini paylaş</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate sm:whitespace-normal">Bu oyun hakkında ne düşünüyorsun?</p>
                </div>
              </div>
              <span className="px-4 sm:px-5 py-2.5 bg-orange-600 text-white rounded-xl font-semibold text-sm text-center group-hover:bg-orange-700 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all shrink-0">
                Yorum Yaz
              </span>
            </button>
          ) : (
            <div className="rounded-xl sm:rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/30 overflow-hidden shadow-sm">
              <div className="p-3 sm:p-5 bg-white/80 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Yorumunu yaz</h3>
                <button type="button" onClick={handleCloseForm} className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 font-medium px-2 py-1.5 sm:px-3 hover:bg-gray-100 rounded-lg transition-colors">
                  Vazgeç
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold overflow-hidden shrink-0 ${!currentUserAvatar && myAvatarColor} ring-2 ring-white shadow-md`}>
                    {currentUserAvatar ? (
                      <img src={currentUserAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(currentUserName)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">Yorum Yapan</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{currentUserName}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Puanın</label>
                    <div className="p-3 sm:p-4 bg-white rounded-xl border border-gray-200">
                      <StarRating
                        rating={newComment.rating}
                        onRatingChange={(r) => setNewComment({ ...newComment, rating: r })}
                        size={24}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Yorumun
                      <span className="ml-1 sm:ml-2 text-gray-400 font-normal text-xs">
                        ({newComment.comment.trim().length}/{COMMENT_MAX_LENGTH})
                      </span>
                    </label>
                    <textarea
                      value={newComment.comment}
                      onChange={(e) => setNewComment({ ...newComment, comment: e.target.value.slice(0, COMMENT_MAX_LENGTH) })}
                      rows="4"
                      maxLength={COMMENT_MAX_LENGTH}
                      className="w-full p-3 sm:p-4 bg-white border border-gray-200 rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none transition-all placeholder:text-gray-400"
                      placeholder="Oyun hakkında ne düşünüyorsun? (en az 10 karakter)"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-orange-600 text-white text-sm sm:text-base rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Sıralama */}
        {comments.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-gray-100">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              <span className="font-bold text-gray-900">{comments.length}</span> topluluk yorumu
            </p>
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 sm:mx-0 scrollbar-hide">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    sortBy === opt.value
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Yorum listesi */}
        <div ref={newCommentRef} className="space-y-4 sm:space-y-6">
          {comments.length === 0 && !loading ? (
            <div className="text-center py-10 sm:py-16 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gray-50/80 border-2 border-dashed border-gray-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MessageCircle size={28} className="text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">Henüz yorum yok</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-sm mx-auto">Bu oyun hakkında ilk görüş bildiren sen ol!</p>
              <button
                type="button"
                onClick={handleOpenForm}
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/25"
              >
                <MessageCircle size={18} />
                Yorum Yazmaya Başla
              </button>
            </div>
          ) : (
            <>
              {visibleComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  handleLike={handleLike}
                  replyingTo={replyingTo}
                  setReplyingTo={(id) => {
                    setReplyingTo(id);
                    setReplyingToComment(id ? comment : null);
                  }}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  handleReplySubmit={handleReplySubmit}
                  currentUserIdentity={currentUserName}
                  currentUserAvatar={currentUserAvatar}
                  isLoggedIn={!!user}
                  likedComments={likedComments}
                  replyingSubmitting={replyingSubmitting}
                />
              ))}
              {hasMoreComments && (
                <div className="text-center pt-3 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + INITIAL_COMMENTS_SHOW)}
                    className="px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-colors"
                  >
                    Daha fazla yorum göster ({sortedComments.length - visibleCount} kaldı)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment, handleLike, replyingTo, setReplyingTo, replyText, setReplyText, handleReplySubmit, currentUserIdentity, currentUserAvatar, isLoggedIn, likedComments, replyingSubmitting }) {
  const isReplying = replyingTo === comment.id;
  const avatarColor = getAvatarColor(comment.name);
  const initials = getInitials(comment.name);
  const myReplyColor = getAvatarColor(currentUserIdentity);
  const myReplyInitials = getInitials(currentUserIdentity);
  const isLiked = likedComments?.has(comment.id);

  return (
    <article className="group rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50/80 transition-colors duration-300 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white overflow-hidden ${!comment.avatar && avatarColor}`}>
            {comment.avatar ? (
              <img src={comment.avatar} alt={comment.name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <div className="flex-1 min-w-0 overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 text-sm sm:text-base flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="truncate max-w-[140px] sm:max-w-none">{comment.name}</span>
                  {comment.isTestimonial && (
                    <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] sm:text-xs font-semibold rounded-md sm:rounded-lg shrink-0">
                      <CheckCircle2 size={10} /> Onaylı
                    </span>
                  )}
                </h4>
                <span className="text-[11px] sm:text-xs text-gray-500 font-medium">{comment.date}</span>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={`shrink-0 ${s <= comment.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
            </div>

            {/* İçerik */}
            <p className="text-gray-700 leading-relaxed text-sm sm:text-[15px] mb-3 sm:mb-4 break-words">
              {comment.comment}
            </p>

            {/* Aksiyonlar */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => handleLike(comment.id)}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isLiked ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <ThumbsUp size={14} className={`shrink-0 ${isLiked ? 'fill-orange-600' : ''}`} />
                <span>{comment.likes > 0 ? comment.likes : 'Beğen'}</span>
              </button>
              <button
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                <Reply size={14} className="shrink-0" />
                Yanıtla
              </button>
            </div>

            {/* Yanıt formu - MOBİL */}
            {isReplying && (
              <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-orange-50/50 sm:bg-white rounded-lg sm:rounded-xl border border-orange-200 sm:border-gray-200 shadow-sm w-full max-w-full overflow-hidden">
                <p className="text-xs sm:text-sm text-gray-700 mb-2 break-words">
                  <Reply size={12} className="inline mr-1 text-orange-600" />
                  <span className="font-semibold text-orange-600">@{comment.name}</span> kullanıcısına
                </p>
                <textarea
                  placeholder="Yanıtınızı yazın..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="3"
                  maxLength={COMMENT_MAX_LENGTH}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none mb-2"
                />
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm font-semibold text-gray-600 bg-white sm:bg-gray-100 border border-gray-200 sm:border-0 rounded-lg hover:bg-gray-50 sm:hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReplySubmit(comment.id)}
                    disabled={replyingSubmitting || !replyText.trim()}
                    className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {replyingSubmitting ? '⏳' : 'Gönder'}
                  </button>
                </div>
              </div>
            )}

            {/* Yanıtlar - MOBİL TASARIM */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-3 w-full max-w-full overflow-hidden">
                {comment.replies.map((reply) => (
                  <ReplyItem
                    key={reply.id}
                    reply={reply}
                    commentId={comment.id}
                    handleReplySubmit={handleReplySubmit}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    currentUserIdentity={currentUserIdentity}
                    currentUserAvatar={currentUserAvatar}
                    isLoggedIn={isLoggedIn}
                    replyingSubmitting={replyingSubmitting}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ReplyItem({ reply, commentId, handleReplySubmit, replyingTo, setReplyingTo, replyText, setReplyText, currentUserIdentity, currentUserAvatar, isLoggedIn, replyingSubmitting }) {
  const isReplying = replyingTo === reply.id;
  const avatarColor = getAvatarColor(reply.name);
  const initials = getInitials(reply.name);

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* MOBİL: Yanıt kartı - yatay scroll önleme */}
      <div className="bg-gradient-to-r from-orange-50/30 to-transparent border-l-4 border-orange-400/50 pl-3 pr-2 py-2.5 sm:py-3 rounded-r-lg w-full">
        <div className="flex items-start gap-2 mb-1.5 min-w-0">
          <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm overflow-hidden ${!reply.avatar && avatarColor}`}>
            {reply.avatar ? (
              <img src={reply.avatar} alt={reply.name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-0.5">
              <h5 className="font-bold text-gray-900 text-xs truncate">{reply.name}</h5>
              <span className="text-[10px] text-gray-400 shrink-0">{reply.time}</span>
            </div>
            <p className="text-gray-700 text-xs leading-relaxed break-words overflow-hidden">{reply.text}</p>
          </div>
        </div>
        
        <button
          onClick={() => setReplyingTo(isReplying ? null : reply.id)}
          className="ml-9 text-[10px] font-semibold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
        >
          <Reply size={10} />
          Yanıtla
        </button>
      </div>

      {/* Yanıt formu - iç içe yanıt */}
      {isReplying && (
        <div className="mt-2 ml-2 p-2.5 bg-orange-50/50 rounded-lg border border-orange-200 w-full max-w-full overflow-hidden">
          <p className="text-[10px] text-gray-600 mb-2 break-words">
            <Reply size={10} className="inline mr-0.5" />
            <span className="font-semibold text-orange-600">@{reply.name}</span>
          </p>
          <textarea
            placeholder="Yanıtınız..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows="2"
            className="w-full mb-2 px-2.5 py-2 bg-white border border-gray-200 rounded text-xs focus:ring-2 focus:ring-orange-500 outline-none resize-none"
          />
          <div className="flex gap-1.5">
            <button 
              type="button" 
              onClick={() => setReplyingTo(null)} 
              className="flex-1 px-2 py-1.5 text-[10px] font-semibold bg-white border border-gray-200 rounded hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={() => handleReplySubmit(commentId, reply.id)}
              disabled={replyingSubmitting || !replyText.trim()}
              className="flex-1 px-2 py-1.5 text-[10px] font-semibold bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {replyingSubmitting ? '⏳' : 'Gönder'}
            </button>
          </div>
        </div>
      )}

      {/* İç içe yanıtlar */}
      {reply.replies && reply.replies.length > 0 && (
        <div className="ml-4 mt-2 space-y-2 w-full max-w-full overflow-hidden">
          {reply.replies.map((nestedReply) => (
            <ReplyItem
              key={nestedReply.id}
              reply={nestedReply}
              commentId={commentId}
              handleReplySubmit={handleReplySubmit}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              currentUserIdentity={currentUserIdentity}
              currentUserAvatar={currentUserAvatar}
              isLoggedIn={isLoggedIn}
              replyingSubmitting={replyingSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentSection;
