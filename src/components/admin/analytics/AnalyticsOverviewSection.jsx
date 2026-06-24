import { useMemo } from 'react';
import {
  Eye,
  Users,
  MessageCircle,
  Search,
  Clock,
  TrendingUp,
  TrendingDown,
  MousePointer,
  Share2,
  Activity,
  Radio,
} from 'lucide-react';
import { MetricCard } from '../charts';
import EngagementCard from './EngagementCard';

export default function AnalyticsOverviewSection({ analytics, stats }) {
  const spark = useMemo(() => analytics.chartData?.map((d) => d.views) || [], [analytics.chartData]);
  const comparison = analytics.comparison || {};

  const engagementScore = useMemo(() => {
    const commentRatio = (stats.totalComments || 0) / Math.max(stats.totalViews || 1, 1);
    const commentScore = Math.min(commentRatio * 100 * 0.2, 20);
    const ratingScore = (parseFloat(stats.avgRating || 0) / 5) * 30;
    const activityScore = Math.min(((stats.totalViews || 0) / 1000) * 30, 30);
    const gamesScore = Math.min(((stats.totalGames || 0) / 50) * 20, 20);
    return Math.round(Math.min(commentScore + ratingScore + activityScore + gamesScore, 100));
  }, [stats]);

  return (
    <div className="space-y-5">
      {analytics.liveVisitors > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-4 py-3">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-emerald-500 text-white">
            <Radio size={14} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-white" />
          </span>
          <div>
            <p className="text-sm font-bold text-emerald-800">
              {analytics.liveVisitors} aktif ziyaretçi
            </p>
            <p className="text-[11px] text-emerald-600">Son 5 dakika içinde sitede</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Eye}
          label="Görüntülenme"
          value={analytics.totalPageViews}
          hint="Sayfa görüntüleme"
          tone="emerald"
          delta={comparison.pageViews}
          spark={spark}
        />
        <MetricCard
          icon={Users}
          label="Ziyaretçi"
          value={analytics.uniqueSessions}
          hint="Tekil oturum"
          tone="blue"
          delta={comparison.sessions}
        />
        <MetricCard
          icon={MessageCircle}
          label="Yorum"
          value={analytics.totalComments}
          hint="Etkileşim"
          tone="purple"
          delta={comparison.comments}
        />
        <MetricCard
          icon={Search}
          label="Arama"
          value={analytics.totalSearches}
          hint="Yapılan aramalar"
          tone="amber"
          delta={comparison.searches}
        />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-orange-300/40 bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 p-6 text-white shadow-warm-glow">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-12 left-1/3 h-44 w-44 rounded-full bg-amber-200/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Activity size={18} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
                Genel Etkileşim Skoru
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">{engagementScore}</span>
              <span className="text-base font-semibold opacity-80">/100</span>
            </div>
            <p className="mt-1 max-w-md text-xs opacity-80">
              Yorum oranı, ortalama puan, aktivite ve içerik hacmi temel alınarak hesaplandı.
            </p>
          </div>
          <div className="w-full space-y-3 md:w-72">
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase opacity-80">Ana Sayfa → Oyun</p>
              <p className="text-lg font-bold">%{analytics.funnel?.homeToGame || 0}</p>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-200 to-white transition-all duration-700 ease-spring"
                style={{ width: `${engagementScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <EngagementCard
          icon={Clock}
          label="Ort. Süre"
          value={`${analytics.avgTimeOnSite}sn`}
          desc="Sitede kalma"
        />
        <EngagementCard
          icon={analytics.bounceRate > 50 ? TrendingDown : TrendingUp}
          label="Hemen Çıkma"
          value={`%${analytics.bounceRate}`}
          desc="5sn altı"
          warn={analytics.bounceRate > 50}
        />
        <EngagementCard
          icon={MousePointer}
          label="Sayfa/Oturum"
          value={analytics.avgPagePerSession}
          desc="Gezilen sayfa"
        />
        <EngagementCard
          icon={Share2}
          label="Paylaşım"
          value={analytics.totalShares}
          desc="Sosyal medya"
        />
      </div>
    </div>
  );
}
