import { useState, useEffect, useCallback } from 'react';
import { Smile } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import {
  NEWS_REACTIONS,
  getNewsVisitorKey,
  aggregateReactionCounts,
} from '../../constants/newsEngagement';
import { trackNewsReaction } from '../../utils/analytics';

function NewsReactionBar({ newsPostId, newsTitle }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState(() =>
    Object.fromEntries(NEWS_REACTIONS.map((r) => [r.emoji, 0]))
  );
  const [myEmoji, setMyEmoji] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const visitorKey = getNewsVisitorKey(user?.id);

  const loadReactions = useCallback(async () => {
    if (!newsPostId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news_reactions')
        .select('emoji, visitor_key')
        .eq('news_post_id', newsPostId);

      if (error) throw error;

      setCounts(aggregateReactionCounts(data));
      const mine = (data || []).find((row) => row.visitor_key === visitorKey);
      setMyEmoji(mine?.emoji || null);
    } catch (err) {
      console.error('Error loading news reactions:', err);
    } finally {
      setLoading(false);
    }
  }, [newsPostId, visitorKey]);

  useEffect(() => {
    loadReactions();
  }, [loadReactions]);

  const handleReaction = async (emoji) => {
    if (!newsPostId || submitting) return;

    setSubmitting(true);
    const previousEmoji = myEmoji;
    const previousCounts = { ...counts };

    try {
      if (myEmoji === emoji) {
        setMyEmoji(null);
        setCounts((prev) => ({ ...prev, [emoji]: Math.max(0, (prev[emoji] || 0) - 1) }));

        const { error } = await supabase
          .from('news_reactions')
          .delete()
          .eq('news_post_id', newsPostId)
          .eq('visitor_key', visitorKey);

        if (error) throw error;
      } else {
        setMyEmoji(emoji);
        setCounts((prev) => {
          const next = { ...prev };
          if (previousEmoji) next[previousEmoji] = Math.max(0, (next[previousEmoji] || 0) - 1);
          next[emoji] = (next[emoji] || 0) + 1;
          return next;
        });

        const { error } = await supabase
          .from('news_reactions')
          .upsert(
            {
              news_post_id: newsPostId,
              emoji,
              visitor_key: visitorKey,
              visitor_type: user?.id ? 'user' : 'guest',
            },
            { onConflict: 'news_post_id,visitor_key' }
          );

        if (error) throw error;
        trackNewsReaction(newsTitle, newsPostId, emoji);
      }
    } catch (err) {
      console.error('Error saving reaction:', err);
      setMyEmoji(previousEmoji);
      setCounts(previousCounts);
      toast.error('Reaksiyon kaydedilemedi. SQL migration çalıştırıldı mı?');
    } finally {
      setSubmitting(false);
    }
  };

  const totalReactions = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <section className="news-reactions" aria-label="Haber reaksiyonları">
      <div className="news-reactions-head">
        <Smile size={18} className="text-orange-600" aria-hidden />
        <div>
          <h2 className="news-reactions-title">Tepkin ne?</h2>
          <p className="news-reactions-sub">
            {totalReactions > 0
              ? `${totalReactions.toLocaleString('tr-TR')} reaksiyon`
              : 'İlk emoji bırakan sen ol'}
          </p>
        </div>
      </div>

      <div className={`news-reactions-grid ${loading ? 'news-reactions-loading' : ''}`}>
        {NEWS_REACTIONS.map(({ emoji, label }) => {
          const active = myEmoji === emoji;
          const count = counts[emoji] || 0;

          return (
            <button
              key={emoji}
              type="button"
              disabled={submitting}
              onClick={() => handleReaction(emoji)}
              className={`news-reaction-btn ${active ? 'news-reaction-btn-active' : ''}`}
              aria-pressed={active}
              aria-label={`${label}${count ? `, ${count} kişi` : ''}`}
            >
              <span className="news-reaction-emoji" aria-hidden>
                {emoji}
              </span>
              <span className="news-reaction-label">{label}</span>
              {count > 0 && <span className="news-reaction-count">{count}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default NewsReactionBar;
