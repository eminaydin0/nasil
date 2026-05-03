import { useEffect, useMemo, useState } from 'react';
import { Gamepad2, Eye, MessageCircle, Star, Activity } from 'lucide-react';
import { MetricCard, Sparkline } from './charts';
import { supabase } from '../../lib/supabase';

// Son 7 gunun tarih anahtarlarini olustur
function buildLast7Days() {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(now.getDate() - i);
    days.push({
      key: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
    });
  }
  return days;
}

function AdminStats({ stats }) {
  const [trends, setTrends] = useState({
    views: [],
    comments: [],
    games: [],
    rating: [],
  });

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const days = buildLast7Days();
        const start = new Date(days[0].key + 'T00:00:00');

        const [viewsRes, commentsRes, gamesRes] = await Promise.all([
          supabase
            .from('analytics_events')
            .select('created_at')
            .eq('event_type', 'game_view')
            .gte('created_at', start.toISOString()),
          supabase
            .from('comments')
            .select('created_at, rating')
            .gte('created_at', start.toISOString()),
          supabase
            .from('games')
            .select('created_at')
            .gte('created_at', start.toISOString()),
        ]);

        const viewsByDay = days.map((d) => ({ ...d, count: 0 }));
        const commentsByDay = days.map((d) => ({ ...d, count: 0, ratingSum: 0 }));
        const gamesByDay = days.map((d) => ({ ...d, count: 0 }));

        const bucket = (arr, item, addRating) => {
          const dateKey = new Date(item.created_at).toISOString().split('T')[0];
          const idx = arr.findIndex((d) => d.key === dateKey);
          if (idx >= 0) {
            arr[idx].count += 1;
            if (addRating && typeof item.rating === 'number') {
              arr[idx].ratingSum = (arr[idx].ratingSum || 0) + item.rating;
            }
          }
        };

        (viewsRes.data || []).forEach((v) => bucket(viewsByDay, v));
        (commentsRes.data || []).forEach((c) => bucket(commentsByDay, c, true));
        (gamesRes.data || []).forEach((g) => bucket(gamesByDay, g));

        setTrends({
          views: viewsByDay.map((d) => d.count),
          comments: commentsByDay.map((d) => d.count),
          games: gamesByDay.map((d) => d.count),
          rating: commentsByDay.map((d) => (d.count > 0 ? d.ratingSum / d.count : 0)),
        });
      } catch (err) {
        // Tablo bulunamazsa veya RLS engellerse fallback - sessiz duser
        if (import.meta.env.DEV) {
          console.warn('Stats trend fetch failed:', err.message);
        }
      }
    };
    loadTrends();
  }, []);

  // Engagement skoru
  const engagementScore = useMemo(() => {
    if (!stats || !stats.totalViews) return 0;
    const commentRatio = stats.totalComments / Math.max(stats.totalViews, 1);
    const commentScore = Math.min(commentRatio * 100, 20);
    const ratingScore = (parseFloat(stats.avgRating || 0) / 5) * 30;
    const activityScore = Math.min((stats.totalViews / 1000) * 30, 30);
    const gamesScore = Math.min((stats.totalGames / 50) * 20, 20);
    return Math.round(commentScore + ratingScore + activityScore + gamesScore);
  }, [stats]);

  // Delta hesapla: son gun vs onceki ortalamasi (basit yuzde)
  const calcDelta = (arr) => {
    if (!arr || arr.length < 2) return null;
    const last = arr[arr.length - 1];
    const prevAvg = arr.slice(0, -1).reduce((a, b) => a + b, 0) / Math.max(arr.length - 1, 1);
    if (prevAvg === 0) return last > 0 ? 100 : 0;
    return Math.round(((last - prevAvg) / prevAvg) * 100);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={Gamepad2}
        label="Toplam Oyun"
        value={stats.totalGames || 0}
        hint="Yayında"
        delta={trends.games.length > 0 ? calcDelta(trends.games) : null}
        spark={trends.games}
        tone="blue"
      />
      <MetricCard
        icon={Eye}
        label="Görüntülenme"
        value={stats.totalViews || 0}
        hint="7 günlük trend"
        delta={trends.views.length > 0 ? calcDelta(trends.views) : null}
        spark={trends.views}
        tone="emerald"
      />
      <MetricCard
        icon={MessageCircle}
        label="Toplam Yorum"
        value={stats.totalComments || 0}
        hint="7 günlük trend"
        delta={trends.comments.length > 0 ? calcDelta(trends.comments) : null}
        spark={trends.comments}
        tone="purple"
      />
      <MetricCard
        icon={Star}
        label="Ortalama Puan"
        value={`${stats.avgRating || '0.0'}`}
        hint="5 üzerinden"
        spark={trends.rating}
        tone="amber"
        format="raw"
      />

      {/* Engagement - tam genislik */}
      <div className="relative col-span-1 overflow-hidden rounded-2xl border border-orange-300/40 bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 p-5 text-white shadow-warm-glow sm:col-span-2 xl:col-span-4">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-10 left-1/3 h-40 w-40 rounded-full bg-amber-200/20 blur-3xl" />

        <div className="relative z-10 grid items-center gap-5 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Activity size={18} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
                Engagement Skoru
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">{engagementScore}</span>
              <span className="text-base font-semibold opacity-80">/100</span>
            </div>
            <p className="mt-1 text-xs opacity-80">
              Yorum oranı, puan, aktivite ve içerik hacmine göre hesaplanır.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-200 to-white transition-all duration-700 ease-spring"
                style={{ width: `${Math.min(engagementScore, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Yorum', value: stats.totalComments || 0 },
                { label: 'Görüntülenme', value: (stats.totalViews || 0).toLocaleString('tr-TR') },
                { label: 'Oyun', value: stats.totalGames || 0 },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-white/15 bg-white/10 px-2 py-3 backdrop-blur-sm"
                >
                  <div className="text-lg font-bold">{m.value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            {trends.views.length > 0 && (
              <div className="mt-3 rounded-xl border border-white/15 bg-white/10 p-2 backdrop-blur-sm">
                <Sparkline
                  data={trends.views}
                  stroke="#fef3c7"
                  fill="#fef3c755"
                  height={36}
                  showDot={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
