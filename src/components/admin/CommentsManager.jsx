import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, Trash2, ThumbsUp, Star, Loader2, Filter, Inbox } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useConfirm } from '../ui';
import toast from 'react-hot-toast';

const SORT_OPTIONS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'oldest', label: 'En Eski' },
  { value: 'most_likes', label: 'En Beğenilen' },
  { value: 'highest_rating', label: 'En Yüksek Puan' },
  { value: 'testimonial', label: 'Ana Sayfada Olanlar' },
];

function CommentsManager({ games }) {
  const [allComments, setAllComments] = useState([]);
  const [selectedGame, setSelectedGame] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();

  const countReplies = (replies) => {
    let count = replies.length;
    replies.forEach((reply) => {
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

      const formattedComments = data.map((comment) => {
        const game = games.find((g) => g.id === comment.game_id);
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
          avatarUrl: comment.avatar_url,
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
    const ok = await confirm({
      type: 'danger',
      title: 'Yorumu sil',
      description: 'Bu yorum ve tüm yanıtları kalıcı olarak silinecek. Bu işlem geri alınamaz.',
      confirmText: 'Evet, Sil',
      cancelText: 'Vazgeç',
    });
    if (!ok) return;
    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);
      if (error) throw error;
      toast.success('Yorum silindi');
      loadAllComments();
    } catch (error) {
      console.error('Error deleting comment from Supabase:', error);
      toast.error('Yorum silinemedi');
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    const ok = await confirm({
      type: 'danger',
      title: 'Yanıtı sil',
      description: 'Bu yanıt kalıcı olarak silinecek.',
      confirmText: 'Evet, Sil',
      cancelText: 'Vazgeç',
    });
    if (!ok) return;
    try {
      const { data: comment, error: fetchError } = await supabase
        .from('comments')
        .select('replies')
        .eq('id', commentId)
        .single();

      if (fetchError) throw fetchError;

      const deleteReplyRecursive = (replies) => {
        return replies.filter((r) => {
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
      toast.success('Yanıt silindi');
      loadAllComments();
    } catch (error) {
      console.error('Error deleting reply from Supabase:', error);
      toast.error('Yanıt silinemedi');
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
    let list =
      selectedGame === 'all'
        ? [...allComments]
        : allComments.filter((c) => c.gameId === parseInt(selectedGame));

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

  const testimonialCount = allComments.filter((c) => c.isTestimonial).length;
  const avgRating =
    allComments.length > 0
      ? (allComments.reduce((sum, c) => sum + (c.rating || 0), 0) / allComments.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-5">
      {/* Üst bar */}
      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-charcoal-900">
              <MessageCircle size={20} className="text-orange-600" />
              Yorum Yönetimi
            </h2>
            <p className="mt-0.5 text-sm text-warm-500">
              {allComments.length} yorum · {testimonialCount} ana sayfada · Ortalama puan {avgRating}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="overflow-x-auto">
            <div className="inline-flex rounded-xl border border-warm-200 bg-cream-50 p-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSortBy(opt.value)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    sortBy === opt.value
                      ? 'bg-white text-charcoal-900 shadow-soft'
                      : 'text-warm-500 hover:text-charcoal-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-1 items-center gap-2 lg:justify-end">
            <Filter size={14} className="hidden text-warm-400 lg:block" />
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full rounded-xl border border-warm-200 bg-cream-50 px-3 py-2 text-sm font-semibold text-warm-800 transition-colors focus:border-orange-400 focus:bg-white focus:outline-none lg:w-auto lg:min-w-[220px]"
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
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-warm-200/60 bg-white p-20 shadow-soft">
          <Loader2 size={28} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComments.length === 0 ? (
            <div className="rounded-2xl border border-warm-200/60 bg-white p-16 text-center shadow-soft">
              <Inbox size={32} className="mx-auto mb-2 text-warm-400" />
              <p className="text-sm font-semibold text-warm-700">
                {sortBy === 'testimonial'
                  ? 'Ana sayfada gösterilen yorum yok'
                  : 'Henüz yorum yok'}
              </p>
              <p className="mt-1 text-xs text-warm-500">
                Yorumlar geldikçe burada listelenecek.
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={`${comment.gameId}-${comment.id}`}
                className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft transition-all hover:border-warm-300/70 hover:shadow-soft-md"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  {comment.avatarUrl ? (
                    <img
                      src={comment.avatarUrl}
                      alt={comment.name}
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-warm-200"
                    />
                  ) : (
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-sm font-bold text-white shadow-soft">
                      {comment.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-sm font-bold text-charcoal-900">{comment.name}</span>
                      <span className="text-[11px] font-medium text-warm-500">{comment.date}</span>
                      <div className="inline-flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < comment.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-warm-200'
                            }
                          />
                        ))}
                      </div>
                      {comment.isTestimonial && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          <Star size={10} className="fill-emerald-600" />
                          Ana sayfada
                        </span>
                      )}
                    </div>
                    <span className="mt-1 inline-block rounded-md bg-orange-100 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700">
                      {comment.gameName}
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-warm-700">{comment.comment}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-warm-500">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <ThumbsUp size={12} />
                        {comment.likes} beğeni
                      </span>
                      {comment.totalReplies > 0 && (
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <MessageCircle size={12} />
                          {comment.totalReplies} yanıt
                        </span>
                      )}
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-2.5 border-l-2 border-warm-200 pl-4">
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

                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleTestimonial(comment.id, !comment.isTestimonial)
                      }
                      className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${
                        comment.isTestimonial
                          ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                          : 'text-warm-500 hover:bg-warm-100 hover:text-warm-700'
                      }`}
                      title={
                        comment.isTestimonial
                          ? 'Ana Sayfadan Kaldır'
                          : 'Ana Sayfada Göster'
                      }
                    >
                      <Star
                        size={16}
                        className={comment.isTestimonial ? 'fill-emerald-600' : ''}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50"
                      title="Yorumu Sil"
                    >
                      <Trash2 size={16} />
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
    <div className={`space-y-2.5 ${depth > 0 ? 'ml-4' : ''}`}>
      <div className="rounded-xl border border-warm-200/60 bg-cream-50 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              {reply.avatar ? (
                <img
                  src={reply.avatar}
                  alt={reply.name}
                  loading="lazy"
                  className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-warm-200"
                />
              ) : (
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-[10px] font-bold text-white">
                  {reply.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-bold text-charcoal-900">{reply.name}</span>
              <span className="text-[10px] font-medium text-warm-500">
                {reply.date} {reply.time}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-warm-700">{reply.text}</p>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-warm-500">
              <span className="inline-flex items-center gap-1 font-semibold">
                <ThumbsUp size={11} />
                {reply.likes || 0} beğeni
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDelete(commentId, reply.id)}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50"
            title="Yanıtı Sil"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {reply.replies && reply.replies.length > 0 && (
        <div className="space-y-2.5 border-l-2 border-warm-200 pl-3">
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
