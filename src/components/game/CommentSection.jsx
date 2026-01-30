import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MessageCircle, User, ThumbsUp, Reply, ArrowDownWideNarrow, Star, CheckCircle2 } from 'lucide-react';
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

function CommentSection({ gameId, gameName }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); 
  const [likedComments, setLikedComments] = useState(new Set());
  
  // Reply states
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Identity logic
  const currentUserName = user?.user_metadata?.full_name || 'Misafir Kullanıcı';
  const currentUserAvatar = user?.user_metadata?.avatar_url || null;

  // New Comment state
  const [newComment, setNewComment] = useState({
    rating: 0,
    comment: ''
  });

  const [showForm, setShowForm] = useState(false);

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
    
    // Validate
    if (!newComment.comment || newComment.rating === 0) {
      toast.error('Lütfen yorumunuzu yazın ve puan verin!');
      return;
    }

    try {
      const commentData = {
        game_id: gameId,
        author_name: currentUserName, // Force current identity
        avatar_url: currentUserAvatar,
        content: newComment.comment,
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
      
      trackCommentSubmit(gameName || 'Unknown', gameId, newComment.rating);
      
      toast.success('Yorumunuz başarıyla paylaşıldı!');
    } catch (error) {
      console.error('Error saving comment:', error);
      toast.error('Yorum kaydedilemedi.');
    }
  };

  const handleReplySubmit = async (commentId, parentReplyId = null) => {
    if (!replyText.trim()) {
      toast.error('Lütfen bir yanıt yazın');
      return;
    }

    const reply = {
      id: Date.now(),
      text: replyText,
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      name: currentUserName, // Force current identity
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
      toast.success('Yanıtınız eklendi');
    } catch (error) {
      console.error('Reply error:', error);
      toast.error('Yanıt kaydedilemedi');
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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header Section - Sadece başlık ve istatistikler */}
      <div className="p-8 bg-gradient-to-br from-orange-50 to-white border-b border-orange-100">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
             <MessageCircle className="mr-3 text-orange-600 fill-orange-100" size={32} />
             Oyuncu Yorumları
           </h2>
           <div className="flex items-center space-x-4">
             <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-gray-900">{averageRating}</span>
                <span className="text-gray-500 font-medium">/ 5</span>
             </div>
             <div className="h-8 w-px bg-gray-300"></div>
             <div className="flex flex-col">
                <StarRating rating={Math.round(averageRating)} readOnly size={18} />
                <span className="text-sm text-gray-500 mt-1">{comments.length} değerlendirme</span>
             </div>
           </div>
        </div>

        {/* Rating Bars */}
        {comments.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-2 max-w-md">
            {ratingCounts.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center text-sm">
                 <span className="flex items-center w-12 font-medium text-gray-600">
                    {star} <Star size={12} className="ml-1 text-orange-400 fill-orange-400"/>
                 </span>
                 <div className="flex-1 h-2 bg-gray-100 rounded-full mx-3 overflow-hidden">
                    <div 
                      className="h-full bg-orange-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                 </div>
                 <span className="w-8 text-right text-gray-400 text-xs">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Comment Area - Buton ve form aynı blokta */}
      <div className="p-8">
        
        {/* Yorum Yaz Bloğu - Buton ve form bir arada */}
        <div ref={formRef} className="mb-8">
          {!showForm ? (
            <button
              type="button"
              onClick={handleOpenForm}
              className="w-full py-4 px-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all flex items-center justify-center gap-3 group text-left"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <MessageCircle className="text-orange-600" size={24} />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-gray-900 block">Deneyimini paylaş</span>
                <span className="text-sm text-gray-500">Bu oyun hakkında ne düşünüyorsun?</span>
              </div>
              <span className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium text-sm group-hover:bg-orange-700 transition-colors">
                Yorum Yaz
              </span>
            </button>
          ) : (
            <div className="animate-fade-in rounded-xl border-2 border-orange-200 bg-orange-50/30 overflow-hidden">
              <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Yorumunu yaz</h3>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Vazgeç
                </button>
              </div>
              <div className="p-6">
               {/* Identity Display */}
               <div className="flex items-center gap-3 mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold overflow-hidden ${!currentUserAvatar && myAvatarColor} shadow-sm border border-gray-100`}>
                     {currentUserAvatar ? (
                       <img src={currentUserAvatar} alt="Profile" className="w-full h-full object-cover" />
                     ) : myInitials}
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Yorum Yapan Hesabı</span>
                     <span className="font-bold text-gray-900">{currentUserName}</span>
                  </div>
                  {!user && (
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                           Misafir Modu
                        </span>
                      </div>
                  )}
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Puanın</label>
                      <div className="h-[46px] flex items-center px-4 bg-white border border-gray-200 rounded-xl">
                        <StarRating 
                          rating={newComment.rating} 
                          onRatingChange={(r) => setNewComment({...newComment, rating: r})} 
                          size={24}
                        />
                      </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yorumun</label>
                    <textarea
                      value={newComment.comment}
                      onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                      rows="4"
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-all"
                      placeholder="Oyun hakkında ne düşünüyorsun? İpuçları var mı?"
                    />
                 </div>

                 <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-bold shadow-lg shadow-orange-200"
                    >
                      Gönder
                    </button>
                 </div>
               </form>
              </div>
            </div>
          )}
        </div>

        {/* Filter / Sort Bar */}
        {comments.length > 0 && (
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="text-gray-500 text-sm font-medium">Topluluk Görüşleri ({comments.length})</div>
            <div className="flex items-center gap-2">
               <ArrowDownWideNarrow size={16} className="text-gray-400" />
               <div className="relative">
                 <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer hover:text-orange-600 pr-4"
                 >
                   <option value="newest">En Yeniler</option>
                   <option value="oldest">En Eskiler</option>
                   <option value="popular">En Popüler</option>
                   <option value="highest">En Yüksek Puan</option>
                   <option value="lowest">En Düşük Puan</option>
                 </select>
               </div>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-8">
          {comments.length === 0 && !loading ? (
             <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Henüz yorum yok</h3>
                <p className="text-gray-500 mb-6">Bu oyun hakkında ilk görüş bildiren sen ol!</p>
                <button type="button" onClick={handleOpenForm} className="text-orange-600 font-semibold hover:underline">
                   Yorum Yazmaya Başla
                </button>
             </div>
          ) : (
            sortedComments.map((comment) => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                handleLike={handleLike}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                handleReplySubmit={handleReplySubmit}
                currentUserIdentity={currentUserName}
                currentUserAvatar={currentUserAvatar}
                isLoggedIn={!!user}
                likedComments={likedComments}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Extracted Comment Item for cleaner code
function CommentItem({ comment, handleLike, replyingTo, setReplyingTo, replyText, setReplyText, handleReplySubmit, currentUserIdentity, currentUserAvatar, isLoggedIn, likedComments }) {
  const isReplying = replyingTo === comment.id;
  const avatarColor = getAvatarColor(comment.name);
  const initials = getInitials(comment.name);
  
  // Current user avatar helpers for reply
  const myReplyColor = getAvatarColor(currentUserIdentity);
  const myReplyInitials = getInitials(currentUserIdentity);


  return (
    <div className="group animate-fade-in">
       <div className="flex gap-4">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-4 ring-gray-50 overflow-hidden ${!comment.avatar && avatarColor}`}>
             {comment.avatar ? (
                <img src={comment.avatar} alt={comment.name} className="w-full h-full object-cover" />
             ) : initials}
          </div>

          <div className="flex-1">
             {/* Header */}
             <div className="flex items-center justify-between mb-2">
                <div>
                   <h4 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                      {comment.name}
                      {comment.isTestimonial && <CheckCircle2 size={16} className="text-blue-500" title="Onaylı" />}
                   </h4>
                   <span className="text-xs text-gray-400 font-medium">{comment.date}</span>
                </div>
                <StarRating rating={comment.rating} readOnly size={14} />
             </div>

             {/* Content */}
             <p className="text-gray-700 leading-relaxed mb-4 text-[15px]">
                {comment.comment}
             </p>

             {/* Actions */}
             <div className="flex items-center gap-6 mb-4">
                <button 
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-2 text-sm transition-colors font-medium group/btn ${
                     likedComments?.has(comment.id) ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'
                  }`}
                >
                   <ThumbsUp size={16} className={`group-hover/btn:scale-110 transition-transform ${
                      likedComments?.has(comment.id) ? 'fill-orange-600' : ''
                   }`} />
                   <span>{comment.likes > 0 ? comment.likes : 'Beğen'}</span>
                </button>

                <button 
                  onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium"
                >
                   <Reply size={16} />
                   <span>Yanıtla</span>
                </button>
             </div>

             {/* Reply Form */}
             {isReplying && (
                <div className="mt-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-slide-down">
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold overflow-hidden ${!currentUserAvatar && myReplyColor}`}>
                            {currentUserAvatar ? (
                                <img src={currentUserAvatar} alt="Me" className="w-full h-full object-cover" />
                            ) : myReplyInitials}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{currentUserIdentity}</span>
                        {!isLoggedIn && <span className="text-[10px] text-gray-400">(Misafir)</span>}
                        <span className="text-xs text-gray-400 ml-auto">olarak yanıtlanıyor</span>
                    </div>

                   <textarea
                      placeholder="Yanıtınızı yazın..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 outline-none resize-none mb-3"
                   />
                   <div className="flex justify-end gap-2">
                      <button 
                         onClick={() => setReplyingTo(null)}
                         className="px-4 py-1.5 text-xs font-semibold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                         İptal
                      </button>
                      <button 
                         onClick={() => handleReplySubmit(comment.id)}
                         className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                         Gönder
                      </button>
                   </div>
                </div>
             )}

             {/* Nested Replies */}
             {comment.replies && comment.replies.length > 0 && (
                <div className="pl-4 border-l-2 border-gray-100 space-y-4">
                   {comment.replies.map(reply => (
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
                      />
                   ))}
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

function ReplyItem({ reply, commentId, handleReplySubmit, replyingTo, setReplyingTo, replyText, setReplyText, currentUserIdentity, currentUserAvatar, isLoggedIn }) {
  const isReplying = replyingTo === reply.id;
  const avatarColor = getAvatarColor(reply.name);
  const initials = getInitials(reply.name);

  // Current user avatar helpers for nested reply
  const myReplyColor = getAvatarColor(currentUserIdentity);
  const myReplyInitials = getInitials(currentUserIdentity);


  return (
    <div className="relative group">
       <div className="flex gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden ${!reply.avatar && avatarColor}`}>
             {reply.avatar ? (
                <img src={reply.avatar} alt={reply.name} className="w-full h-full object-cover" />
             ) : initials}
          </div>
          <div className="flex-1">
             <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-1">
                   <h5 className="font-bold text-gray-900 text-sm">{reply.name}</h5>
                   <span className="text-xs text-gray-400">{reply.date} {reply.time}</span>
                </div>
                <p className="text-gray-700 text-sm">{reply.text}</p>
             </div>
             
             <div className="flex items-center gap-4 mt-2 ml-1">
                <button 
                  onClick={() => setReplyingTo(isReplying ? null : reply.id)}
                  className="text-xs font-semibold text-gray-500 hover:text-orange-600 transition-colors"
                >
                   Yanıtla
                </button>
             </div>

             {isReplying && (
                <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                   
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold overflow-hidden ${!currentUserAvatar && myReplyColor}`}>
                            {currentUserAvatar ? (
                                <img src={currentUserAvatar} alt="Me" className="w-full h-full object-cover" />
                            ) : myReplyInitials}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{currentUserIdentity}</span>
                        {!isLoggedIn && <span className="text-[10px] text-gray-400">(Misafir)</span>}
                    </div>

                   <textarea
                      placeholder="Yanıtınız..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows="2"
                      className="w-full mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-orange-500 outline-none resize-none"
                   />
                   <div className="flex justify-end gap-2">
                       <button onClick={() => setReplyingTo(null)} className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">İptal</button>
                       <button onClick={() => handleReplySubmit(commentId, reply.id)} className="px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700">Gönder</button>
                   </div>
                </div>
             )}

             {/* Deep Nested Replies using recursion */}
             {reply.replies && reply.replies.length > 0 && (
                <div className="pl-3 border-l-2 border-gray-100 mt-3 space-y-3">
                   {reply.replies.map(nestedReply => (
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
                      />
                   ))}
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

export default CommentSection;
