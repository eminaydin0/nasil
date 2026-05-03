import { useState, useEffect, useMemo } from 'react';
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
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Activity,
  BarChart3,
  Download,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import { exportAnalyticsData } from '../../../utils/analytics';
import { Donut, BarChart, MetricCard } from '../charts';

const TIME_RANGES = [
  { value: '24hours', label: 'Son 24 Saat' },
  { value: '7days', label: 'Son 7 Gün' },
  { value: '30days', label: 'Son 30 Gün' },
  { value: 'all', label: 'Tüm Zamanlar' },
];

function ActivityIcon({ type }) {
  const base = 'grid h-9 w-9 shrink-0 place-items-center rounded-xl';
  switch (type) {
    case 'game_view':
      return (
        <div className={`${base} bg-emerald-100 text-emerald-600`}>
          <Eye size={16} />
        </div>
      );
    case 'comment_submit':
      return (
        <div className={`${base} bg-purple-100 text-purple-600`}>
          <MessageCircle size={16} />
        </div>
      );
    case 'share_click':
      return (
        <div className={`${base} bg-pink-100 text-pink-600`}>
          <Share2 size={16} />
        </div>
      );
    case 'search':
      return (
        <div className={`${base} bg-amber-100 text-amber-600`}>
          <Search size={16} />
        </div>
      );
    default:
      return (
        <div className={`${base} bg-warm-100 text-warm-500`}>
          <Activity size={16} />
        </div>
      );
  }
}

function EngagementCard({ icon: Icon, label, value, desc, warn }) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-soft sm:p-5 ${
        warn ? 'border-rose-200/60 bg-rose-50/50' : 'border-warm-200/60 bg-white'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`grid h-8 w-8 place-items-center rounded-lg ${
            warn ? 'bg-rose-100 text-rose-600' : 'bg-warm-100 text-warm-600'
          }`}
        >
          <Icon size={15} />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-warm-600">
          {label}
        </span>
      </div>
      <div
        className={`text-xl font-bold tracking-tight sm:text-2xl ${
          warn ? 'text-rose-600' : 'text-charcoal-900'
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] font-medium text-warm-500">{desc}</div>
    </div>
  );
}

export default function AdminAnalyticsTab({ games, stats }) {
  const [analytics, setAnalytics] = useState({
    totalPageViews: 0,
    totalComments: 0,
    totalShares: 0,
    totalSearches: 0,
    uniqueSessions: 0,
    avgTimeOnSite: 0,
    bounceRate: 0,
    avgPagePerSession: 0,
    deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
    trafficSources: { direct: 0, search: 0, social: 0, referral: 0 },
    topGames: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      let startDate = new Date();
      switch (timeRange) {
        case '24hours':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7days':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'all':
          startDate = new Date(0);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const { data: rpcStats, error: rpcError } = await supabase.rpc('get_dashboard_stats', {
        p_start_date: startDate.toISOString(),
      });

      let newAnalytics = {};

      if (!rpcError && rpcStats) {
        newAnalytics = {
          totalPageViews: rpcStats.totalPageViews || 0,
          totalComments: rpcStats.totalComments || 0,
          totalShares: rpcStats.totalShares || 0,
          totalSearches: rpcStats.totalSearches || 0,
          uniqueSessions: rpcStats.uniqueSessions || 0,
          avgTimeOnSite: rpcStats.avgTimeOnSite || 0,
          bounceRate: rpcStats.bounceRate || 0,
          deviceStats: rpcStats.deviceStats || { desktop: 0, mobile: 0, tablet: 0 },
          trafficSources:
            rpcStats.trafficSources || { direct: 0, search: 0, social: 0, referral: 0 },
          avgPagePerSession:
            rpcStats.uniqueSessions > 0
              ? ((rpcStats.totalPageViews || 0) / rpcStats.uniqueSessions).toFixed(1)
              : 0,
        };
      } else {
        newAnalytics = getLocalStorageData();
      }

      const { data: topGamesData } = await supabase
        .from('top_games_weekly')
        .select('*')
        .order('views', { ascending: false })
        .limit(6);
      const topGames = (topGamesData || []).map((gd) => {
        const game = games.find((g) => g.id === gd.game_id);
        return {
          id: gd.game_id,
          name: game?.name || `Oyun #${gd.game_id}`,
          image: game?.image || '',
          views: gd.views || 0,
          comments: gd.comments || 0,
        };
      });

      const { data: recentData } = await supabase
        .from('recent_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      const recentActivity = (recentData || []).map((a) => {
        const game = games.find((g) => g.id === a.game_id);
        const displayName =
          game?.name ||
          a.event_data?.page ||
          a.event_data?.search_term ||
          (a.game_id ? `Oyun #${a.game_id}` : 'Sayfa');
        return { ...a, game_name: displayName };
      });

      setAnalytics((prev) => ({ ...prev, ...newAnalytics, topGames, recentActivity }));
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLocalStorageData = () => {
    try {
      const deviceVisits = JSON.parse(localStorage.getItem('device_visits') || '{}');
      const trafficSources = JSON.parse(localStorage.getItem('traffic_sources') || '{}');
      const totalDevice =
        (deviceVisits.desktop || 0) + (deviceVisits.mobile || 0) + (deviceVisits.tablet || 0);
      const totalTraffic =
        (trafficSources.direct || 0) +
        (trafficSources.search || 0) +
        (trafficSources.social || 0) +
        (trafficSources.referral || 0);
      return {
        totalPageViews: 0,
        totalComments: 0,
        totalShares: 0,
        totalSearches: 0,
        uniqueSessions: 0,
        avgTimeOnSite: 0,
        bounceRate: 0,
        avgPagePerSession: 0,
        deviceStats:
          totalDevice > 0
            ? {
                desktop: Math.round(((deviceVisits.desktop || 0) / totalDevice) * 100),
                mobile: Math.round(((deviceVisits.mobile || 0) / totalDevice) * 100),
                tablet: Math.round(((deviceVisits.tablet || 0) / totalDevice) * 100),
              }
            : { desktop: 0, mobile: 0, tablet: 0 },
        trafficSources:
          totalTraffic > 0
            ? {
                direct: Math.round(((trafficSources.direct || 0) / totalTraffic) * 100),
                search: Math.round(((trafficSources.search || 0) / totalTraffic) * 100),
                social: Math.round(((trafficSources.social || 0) / totalTraffic) * 100),
                referral: Math.round(((trafficSources.referral || 0) / totalTraffic) * 100),
              }
            : { direct: 0, search: 0, social: 0, referral: 0 },
      };
    } catch {
      return {};
    }
  };

  const engagementScore = useMemo(() => {
    const commentRatio = (stats.totalComments || 0) / Math.max(stats.totalViews || 1, 1);
    const commentScore = Math.min(commentRatio * 100 * 0.2, 20);
    const ratingScore = (parseFloat(stats.avgRating || 0) / 5) * 30;
    const activityScore = Math.min(((stats.totalViews || 0) / 1000) * 30, 30);
    const gamesScore = Math.min(((stats.totalGames || 0) / 50) * 20, 20);
    return Math.round(Math.min(commentScore + ratingScore + activityScore + gamesScore, 100));
  }, [stats]);

  const deviceData = useMemo(
    () => [
      { label: 'Masaüstü', value: analytics.deviceStats.desktop, color: '#6366f1' },
      { label: 'Mobil', value: analytics.deviceStats.mobile, color: '#10b981' },
      { label: 'Tablet', value: analytics.deviceStats.tablet, color: '#f59e0b' },
    ],
    [analytics.deviceStats]
  );

  const trafficData = useMemo(
    () => [
      { label: 'Doğrudan', value: analytics.trafficSources.direct, color: '#06b6d4' },
      { label: 'Arama', value: analytics.trafficSources.search, color: '#10b981' },
      { label: 'Sosyal Medya', value: analytics.trafficSources.social, color: '#ec4899' },
      { label: 'Referral', value: analytics.trafficSources.referral, color: '#f97316' },
    ],
    [analytics.trafficSources]
  );

  const maxTopGameViews = analytics.topGames[0]?.views || 1;

  return (
    <div className="space-y-6">
      {/* Filtre Bari */}
      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-charcoal-900">Site Analitiği</h2>
            <p className="mt-0.5 text-sm text-warm-500">
              Ziyaretçi davranışları ve etkileşim metrikleri
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex rounded-xl border border-warm-200 bg-cream-50 p-1">
              {TIME_RANGES.map((tr) => (
                <button
                  key={tr.value}
                  type="button"
                  onClick={() => setTimeRange(tr.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    timeRange === tr.value
                      ? 'bg-white text-charcoal-900 shadow-soft'
                      : 'text-warm-500 hover:text-charcoal-900'
                  }`}
                >
                  {tr.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                exportAnalyticsData();
                toast.success('Veriler dışa aktarıldı!', { icon: '📊' });
              }}
              className="ml-1 inline-flex items-center gap-1.5 rounded-xl bg-charcoal-900 px-3.5 py-2 text-xs font-semibold text-cream-50 transition-all hover:-translate-y-0.5 hover:bg-charcoal-800"
            >
              <Download size={14} />
              İndir
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          {/* Ana Metrikler */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Eye}
              label="Görüntülenme"
              value={analytics.totalPageViews}
              hint="Sayfa görüntüleme"
              tone="emerald"
            />
            <MetricCard
              icon={Users}
              label="Ziyaretçi"
              value={analytics.uniqueSessions}
              hint="Tekil oturum"
              tone="blue"
            />
            <MetricCard
              icon={MessageCircle}
              label="Yorum"
              value={analytics.totalComments}
              hint="Etkileşim"
              tone="purple"
            />
            <MetricCard
              icon={Search}
              label="Arama"
              value={analytics.totalSearches}
              hint="Yapılan aramalar"
              tone="amber"
            />
          </div>

          {/* Engagement banner */}
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
              <div className="w-full md:w-72">
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-200 to-white transition-all duration-700 ease-spring"
                    style={{ width: `${engagementScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Etkileşim Kartları */}
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

          {/* Ana Grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Sol */}
            <div className="space-y-5 lg:col-span-8">
              {/* Top Oyunlar BarChart */}
              <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
                  <BarChart3 size={18} className="text-orange-600" />
                  En Popüler Oyunlar
                </h3>
                {analytics.topGames.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topGames.map((game, i) => (
                      <div
                        key={game.id}
                        className="flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-colors hover:border-warm-200/70 hover:bg-cream-50"
                      >
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold ${
                            i === 0
                              ? 'bg-amber-400 text-white'
                              : i === 1
                                ? 'bg-warm-300 text-white'
                                : i === 2
                                  ? 'bg-orange-400 text-white'
                                  : 'bg-warm-100 text-warm-500'
                          }`}
                        >
                          {i + 1}
                        </span>
                        {game.image && (
                          <img
                            src={game.image}
                            alt={game.name}
                            loading="lazy"
                            className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-warm-200/60"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-charcoal-900">
                            {game.name}
                          </div>
                          <div className="mt-0.5 flex items-center gap-3 text-[11px] text-warm-500">
                            <span className="inline-flex items-center gap-1">
                              <Eye size={11} /> {game.views.toLocaleString('tr-TR')}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle size={11} /> {game.comments}
                            </span>
                          </div>
                        </div>
                        <div className="hidden h-2 w-24 overflow-hidden rounded-full bg-warm-100 sm:block">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700 ease-spring"
                            style={{ width: `${(game.views / maxTopGameViews) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-warm-500">Henüz veri yok</p>
                )}
              </div>

              {/* Son Aktiviteler */}
              <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
                  <Activity size={18} className="text-blue-600" />
                  Son Aktiviteler
                </h3>
                {analytics.recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.recentActivity.slice(0, 8).map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-warm-200/60 bg-cream-50 p-2.5 text-sm transition-colors hover:border-warm-300"
                      >
                        <ActivityIcon type={a.event_type} />
                        <div className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-charcoal-900">
                            {a.event_type === 'game_view' && 'Görüntülendi: '}
                            {a.event_type === 'comment_submit' && 'Yorum: '}
                            {a.event_type === 'share_click' && 'Paylaşıldı: '}
                            {a.event_type === 'search' && 'Arama: '}
                            {a.game_name || a.event_data?.search_term || '-'}
                          </span>
                        </div>
                        <span className="shrink-0 text-[11px] font-medium text-warm-500">
                          {new Date(a.created_at).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-warm-500">Henüz aktivite yok</p>
                )}
              </div>
            </div>

            {/* Sağ */}
            <div className="space-y-5 lg:col-span-4">
              <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
                  <Monitor size={18} className="text-indigo-600" />
                  Cihaz Dağılımı
                </h3>
                {deviceData.some((d) => d.value > 0) ? (
                  <Donut data={deviceData} size={150} thickness={18} centerLabel="Cihaz" />
                ) : (
                  <BarChart
                    data={[
                      { label: 'Masaüstü', value: 0, color: '#6366f1' },
                      { label: 'Mobil', value: 0, color: '#10b981' },
                      { label: 'Tablet', value: 0, color: '#f59e0b' },
                    ]}
                    formatter={(v) => `%${v}`}
                  />
                )}
              </div>

              <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
                  <Globe size={18} className="text-cyan-600" />
                  Trafik Kaynakları
                </h3>
                <BarChart data={trafficData} formatter={(v) => `%${v}`} />
              </div>

              <div className="rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-amber-50 p-4 text-xs leading-relaxed text-orange-900">
                <strong className="block text-orange-700">Not</strong>
                Veriler{' '}
                {timeRange === '24hours'
                  ? 'son 24 saat'
                  : timeRange === '7days'
                    ? 'son 7 gün'
                    : timeRange === '30days'
                      ? 'son 30 gün'
                      : 'tüm zamanlar'}{' '}
                içindeki etkileşimlere dayanmaktadır.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
