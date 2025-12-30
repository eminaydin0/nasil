import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, User, Calendar, ThumbsUp, Reply } from 'lucide-react';
import toast from 'react-hot-toast';
import StarRating from '../common/StarRating';
import { supabase } from '../../lib/supabase';
import { trackCommentSubmit } from '../../utils/analytics';

function CommentSection({ gameId, gameName }) {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');

  const [newComment, setNewComment] = useState({
    name: '',
    rating: 0,
    comment: ''
  });

  const [showForm, setShowForm] = useState(false);

  // Load comments specific to this game when component mounts or gameId changes
  const loadComments = useCallback(async () => {
    console.log('🔄 Loading comments for game:', gameId);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false });
      
      console.log('📊 Supabase response:', { data, error });
      
      if (error) throw error;
      
      // Format comments to match UI structure
      const formattedComments = data.map(c => ({
        id: c.id,
        name: c.author_name,
        rating: c.rating,
        comment: c.content,
        date: new Date(c.created_at).toLocaleDateString('tr-TR'),
        likes: c.likes || 0,
        replies: c.replies || [],
        isTestimonial: c.is_testimonial || false
      }));
      
      console.log('✅ Formatted comments:', formattedComments);
      setComments(formattedComments);
    } catch (error) {
      console.error('❌ Error loading comments from Supabase:', error);
      setComments([]);
    }
  }, [gameId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.name || !newComment.comment || newComment.rating === 0) {
      toast.error('Lütfen tüm alanları doldurun ve puan verin!');
      return;
    }

    console.log('💾 Submitting comment for game:', gameId, newComment);

    try {
      const commentData = {
        game_id: gameId,
        author_name: newComment.name,
        content: newComment.comment,
        rating: newComment.rating,
        likes: 0,
        replies: [],
        is_testimonial: false
      };
      
      console.log('📤 Sending to Supabase:', commentData);
      
      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select()
        .single();
      
      console.log('📥 Supabase response:', { data, error });
      
      if (error) throw error;
      
      // Add new comment to list
      const formattedComment = {
        id: data.id,
        name: data.author_name,
        rating: data.rating,
        comment: data.content,
        date: new Date(data.created_at).toLocaleDateString('tr-TR'),
        likes: 0,
        replies: [],
        isTestimonial: false
      };
      
      console.log('✅ Comment added successfully:', formattedComment);
      setComments([formattedComment, ...comments]);
      setNewComment({ name: '', rating: 0, comment: '' });
      setShowForm(false);
      
      // Track comment submission
      trackCommentSubmit(gameName || 'Unknown', gameId, newComment.rating);
      
      toast.success('Yorumunuz başarıyla kaydedildi!', {
        icon: '✅',
      });
    } catch (error) {
      console.error('❌ Error saving comment to Supabase:', error);
      toast.error(`Yorum kaydedilirken hata oluştu: ${error.message}`);
    }
  };

  const handleReplySubmit = async (commentId, parentReplyId = null) => {
    if (!replyText.trim() || !replyName.trim()) {
      toast.error('Lütfen isminizi ve yanıtınızı yazın!');
      return;
    }

    const reply = {
      id: Date.now(),
      text: replyText,
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      name: replyName,
      likes: 0,
      replies: []
    };

    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        if (parentReplyId) {
          // Yanıta yanıt veriliyor
          const addReplyToNested = (replies) => {
            return replies.map(r => {
              if (r.id === parentReplyId) {
                return {
                  ...r,
                  replies: [...(r.replies || []), reply]
                };
              }
              if (r.replies && r.replies.length > 0) {
                return {
                  ...r,
                  replies: addReplyToNested(r.replies)
                };
              }
              return r;
            });
          };
          
          return {
            ...c,
            replies: addReplyToNested(c.replies || [])
          };
        } else {
          // Ana yoruma yanıt veriliyor
          return {
            ...c,
            replies: [...(c.replies || []), reply]
          };
        }
      }
      return c;
    });

    setComments(updatedComments);
    
    // Update in Supabase
    try {
      const targetComment = updatedComments.find(c => c.id === commentId);
      await supabase
        .from('comments')
        .update({ replies: targetComment.replies })
        .eq('id', commentId);
    } catch (error) {
      console.error('Error saving reply to Supabase:', error);
      toast.error('Yanıt kaydedilirken hata oluştu!');
    }
    
    setReplyText('');
    setReplyName('');
    setReplyingTo(null);
    toast.success('Yanıtınız başarıyla eklendi!', {
      icon: '💬',
    });
  };

  const handleReplyLike = async (commentId, replyId) => {
    const likeReplyInNested = (replies) => {
      return replies.map(r => {
        if (r.id === replyId) {
          return { ...r, likes: r.likes + 1 };
        }
        if (r.replies && r.replies.length > 0) {
          return {
            ...r,
            replies: likeReplyInNested(r.replies)
          };
        }
        return r;
      });
    };

    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: likeReplyInNested(c.replies || [])
        };
      }
      return c;
    });

    setComments(updatedComments);
    
    // Update in Supabase
    try {
      const targetComment = updatedComments.find(c => c.id === commentId);
      await supabase
        .from('comments')
        .update({ replies: targetComment.replies })
        .eq('id', commentId);
    } catch (error) {
      console.error('Error updating reply likes in Supabase:', error);
    }
  };

  const handleLike = async (commentId) => {
    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    );
    setComments(updatedComments);
    
    toast.success('Beğendiniz!', {
      icon: '👍',
      duration: 2000,
    });
    
    // Update in Supabase
    try {
      const targetComment = updatedComments.find(c => c.id === commentId);
      await supabase
        .from('comments')
        .update({ likes: targetComment.likes })
        .eq('id', commentId);
    } catch (error) {
      console.error('Error updating likes in Supabase:', error);
    }
  };

  const averageRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="mr-2 text-orange-600" size={28} />
            Yorumlar ve Değerlendirmeler
          </h2>
          {comments.length > 0 && (
            <div className="flex items-center mt-2 space-x-3">
              <StarRating rating={Math.round(averageRating)} readOnly />
              <span className="text-lg font-semibold text-gray-700">
                {averageRating} / 5
              </span>
              <span className="text-sm text-gray-500">
                ({comments.length} değerlendirme)
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-md hover:shadow-lg"
        >
          {showForm ? 'İptal' : 'Yorum Yap'}
        </button>
      </div>

      {/* Comment Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              İsminiz
            </label>
            <input
              type="text"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Adınız"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Puanınız
            </label>
            <StarRating
              rating={newComment.rating}
              onRatingChange={(rating) => setNewComment({ ...newComment, rating })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Yorumunuz
            </label>
            <textarea
              value={newComment.comment}
              onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              placeholder="Bu oyun hakkında düşüncelerinizi paylaşın..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
          >
            Yorumu Gönder
          </button>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Henüz yorum yapılmamış.</p>
            <p className="text-sm">İlk yorumu siz yapın!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>{comment.date}</span>
                    </div>
                  </div>
                </div>
                <StarRating rating={comment.rating} readOnly />
              </div>

              <p className="text-gray-700 mb-3 leading-relaxed">{comment.comment}</p>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <ThumbsUp size={16} />
                  <span>Beğen ({comment.likes})</span>
                </button>

                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <Reply size={16} />
                  <span>Yanıtla</span>
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="mt-4 ml-8 p-4 bg-white rounded-lg border border-gray-200">
                  <input
                    type="text"
                    value={replyName}
                    onChange={(e) => setReplyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm mb-2"
                    placeholder="İsminiz"
                  />
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
                    placeholder="Yanıtınızı yazın..."
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => handleReplySubmit(comment.id, null)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
                    >
                      Gönder
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                        setReplyName('');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}

              {/* Replies List - Recursive */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-8 space-y-3">
                  {comment.replies.map((reply) => (
                    <ReplyItem 
                      key={reply.id} 
                      reply={reply} 
                      commentId={comment.id}
                      replyingTo={replyingTo}
                      setReplyingTo={setReplyingTo}
                      replyName={replyName}
                      setReplyName={setReplyName}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      handleReplySubmit={handleReplySubmit}
                      handleReplyLike={handleReplyLike}
                      depth={0}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Recursive Reply Component
function ReplyItem({ reply, commentId, replyingTo, setReplyingTo, replyName, setReplyName, replyText, setReplyText, handleReplySubmit, handleReplyLike, depth }) {
  return (
    <div className="space-y-3">
      <div className={`p-4 bg-white rounded-lg border border-gray-200 ${depth > 0 ? 'ml-8' : ''}`}>
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 text-sm">{reply.name}</h5>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{reply.date} {reply.time}</span>
            </div>
          </div>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-2">{reply.text}</p>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleReplyLike(commentId, reply.id)}
            className="flex items-center space-x-1 text-xs text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ThumbsUp size={14} />
            <span>Beğen ({reply.likes || 0})</span>
          </button>
          
          <button
            onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
            className="flex items-center space-x-1 text-xs text-gray-600 hover:text-orange-600 transition-colors"
          >
            <Reply size={14} />
            <span>Yanıtla</span>
          </button>
        </div>

        {/* Nested Reply Form */}
        {replyingTo === reply.id && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="text"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm mb-2"
              placeholder="İsminiz"
            />
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
              placeholder="Yanıtınızı yazın..."
            />
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => handleReplySubmit(commentId, reply.id)}
                className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs font-semibold"
              >
                Gönder
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText('');
                  setReplyName('');
                }}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs font-semibold"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {reply.replies && reply.replies.length > 0 && (
        <div className="space-y-3">
          {reply.replies.map((nestedReply) => (
            <ReplyItem
              key={nestedReply.id}
              reply={nestedReply}
              commentId={commentId}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyName={replyName}
              setReplyName={setReplyName}
              replyText={replyText}
              setReplyText={setReplyText}
              handleReplySubmit={handleReplySubmit}
              handleReplyLike={handleReplyLike}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentSection;
