import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, Trash2, ThumbsUp, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SORT_OPTIONS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'oldest', label: 'En Eski' },
  { value: 'most_likes', label: 'En Çok Beğenilen' },
  { value: 'highest_rating', label: 'En Yüksek Puanlı' },
  { value: 'testimonial', label: 'Ana Sayfada Gösterilen' },
];

function CommentsManager({ games }) {
  const [allComments, setAllComments] = useState([]);
  const [selectedGame, setSelectedGame] = useState('all');
  const [sortBy, setSortBy] = useState('most_likes');
  const [loading, setLoading] = useState(true);

  const countReplies = (replies) => {
    let count = replies.length;
    replies.forEach(reply => {
      if (reply.replies && reply.replies.length > 0) {
        count += countReplies(reply.replies);
      }
    });
    return count;
  };

  const loadAllComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedComments = data.map(comment => {
        const game = games.find(g => g.id === comment.game_id);
        return {
          id: comment.id,
          name: comment.author_name,
          comment: comment.content,
          rating: comment.rating,
          likes: comment.likes || 0,
          replies: comment.replies || [],
          isTestimonial: comment.is_testimonial || false,
          createdAt: comment.created_at,
          date: new Date(comment.created_at).toLocaleDateString('tr-TR'),
          gameId: comment.game_id,
          gameName: game?.name || 'Bilinmeyen Oyun',
          totalReplies: countReplies(comment.replies || []),
          avatarUrl: comment.avatar_url
        };
      });
      
      setAllComments(formattedComments);
    } catch (error) {
      console.error('Error loading comments from Supabase:', error);
      setAllComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (games.length > 0) {
      loadAllComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games]);

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Bu yorumu ve tüm yanıtlarını silmek istediğinizden emin misiniz?')) {
      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', commentId);
        
        if (error) throw error;
        
        loadAllComments();
      } catch (error) {
        console.error('Error deleting comment from Supabase:', error);
      }
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    if (window.confirm('Bu yanıtı silmek istediğinizden emin misiniz?')) {
      try {
        const { data: comment, error: fetchError } = await supabase
          .from('comments')
          .select('replies')
          .eq('id', commentId)
          .single();
        
        if (fetchError) throw fetchError;
        
        const deleteReplyRecursive = (replies) => {
          return replies.filter(r => {
            if (r.id === replyId) return false;
            if (r.replies && r.replies.length > 0) {
              r.replies = deleteReplyRecursive(r.replies);
            }
            return true;
          });
        };
        
        const updatedReplies = deleteReplyRecursive(comment.replies || []);
        
        const { error: updateError } = await supabase
          .from('comments')
          .update({ replies: updatedReplies })
          .eq('id', commentId);
        
        if (updateError) throw updateError;
        
        loadAllComments();
      } catch (error) {
        console.error('Error deleting reply from Supabase:', error);
      }
    }
  };

  const handleToggleTestimonial = async (commentId, isTestimonial) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_testimonial: isTestimonial })
        .eq('id', commentId);
      
      if (error) throw error;
      
      loadAllComments();
    } catch (error) {
      console.error('Error updating testimonial in Supabase:', error);
    }
  };

  const filteredComments = useMemo(() => {
    let list = selectedGame === 'all'
      ? [...allComments]
      : allComments.filter((c) => c.gameId === parseInt(selectedGame));

    // Sıralama
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'most_likes':
        list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'highest_rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'testimonial':
        list = list.filter((c) => c.isTestimonial);
        break;
      default:
        break;
    }
    return list;
  }, [allComments, selectedGame, sortBy]);

  const getCommentCountByGame = (gameId) => {
    return allComments.filter((c) => c.gameId === gameId).length;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Yorumlar</h2>
          <p className="text-gray-600">Toplam {allComments.length} yorum</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
            title="Sıralama"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          >
            <option value="all">Tüm Oyunlar ({allComments.length})</option>
            {games.map((game) => {
              const count = getCommentCountByGame(game.id);
              return count > 0 ? (
                <option key={game.id} value={game.id}>
                  {game.name} ({count})
                </option>
              ) : null;
            })}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Yorumlar yükleniyor...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Henüz yorum yok</p>
            </div>
          ) : (
            filteredComments.map(comment => (
              <div key={`${comment.gameId}-${comment.id}`} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-shrink-0">
                        {comment.avatarUrl ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={comment.avatarUrl}
                            alt={comment.name}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                            {comment.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">{comment.name}</span>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-orange-600 font-medium mb-2">{comment.gameName}</p>
                    <p className="text-gray-700">{comment.comment}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm text-gray-500 flex items-center">
                        <ThumbsUp size={14} className="mr-1" />
                        {comment.likes} beğeni
                      </span>
                      {comment.totalReplies > 0 && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <MessageCircle size={14} className="mr-1" />
                          {comment.totalReplies} yanıt
                        </span>
                      )}
                      {comment.isTestimonial && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ★ Ana Sayfada Gösteriliyor
                        </span>
                      )}
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-4 space-y-3">
                        {comment.replies.map((reply) => (
                          <ReplyDisplay 
                            key={reply.id}
                            reply={reply}
                            commentId={comment.id}
                            onDelete={handleDeleteReply}
                            depth={0}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleToggleTestimonial(comment.id, !comment.isTestimonial)}
                      className={`p-2 rounded-lg transition-colors ${
                        comment.isTestimonial 
                          ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title={comment.isTestimonial ? 'Ana Sayfadan Kaldır' : 'Ana Sayfada Göster'}
                    >
                      <Star size={18} className={comment.isTestimonial ? 'fill-green-600' : ''} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Yorumu Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ReplyDisplay({ reply, commentId, onDelete, depth }) {
  return (
    <div className={`space-y-3 ${depth > 0 ? 'ml-6' : ''}`}>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-shrink-0">
                {reply.avatar ? (
                  <img
                    className="h-6 w-6 rounded-full object-cover"
                    src={reply.avatar}
                    alt={reply.name}
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[10px]">
                    {reply.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="font-semibold text-gray-900 text-sm">{reply.name}</span>
              <span className="text-xs text-gray-500">{reply.date} {reply.time}</span>
            </div>
            <p className="text-gray-700 text-sm">{reply.text}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs text-gray-500 flex items-center">
                <ThumbsUp size={12} className="mr-1" />
                {reply.likes || 0} beğeni
              </span>
            </div>
          </div>
          <button
            onClick={() => onDelete(commentId, reply.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Yanıtı Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {reply.replies && reply.replies.length > 0 && (
        <div className="space-y-3">
          {reply.replies.map((nestedReply) => (
            <ReplyDisplay
              key={nestedReply.id}
              reply={nestedReply}
              commentId={commentId}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentsManager;
