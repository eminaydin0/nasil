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
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import { exportAnalyticsData } from '../../../utils/analytics';

const TIME_RANGES = [
  { value: '24hours', label: 'Son 24 Saat' },
  { value: '7days', label: 'Son 7 Gün' },
  { value: '30days', label: 'Son 30 Gün' },
  { value: 'all', label: 'Tüm Zamanlar' },
];

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

      // RPC ile verileri çek
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
          trafficSources: rpcStats.trafficSources || { direct: 0, search: 0, social: 0, referral: 0 },
          avgPagePerSession:
            rpcStats.uniqueSessions > 0
              ? ((rpcStats.totalPageViews || 0) / rpcStats.uniqueSessions).toFixed(1)
              : 0,
        };
      } else {
        // Fallback: localStorage verileri
        const localData = getLocalStorageData();
        newAnalytics = localData;
      }

      // Top Games (view'dan sıralı gelir)
      const { data: topGamesData } = await supabase
        .from('top_games_weekly')
        .select('*')
        .order('views', { ascending: false })
        .limit(5);
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

      // Recent Activity
      const { data: recentData } = await supabase
        .from('recent_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      const recentActivity = (recentData || []).map((a) => {
        const game = games.find((g) => g.id === a.game_id);
        const displayName =
          game?.name || a.event_data?.page || a.event_data?.search_term || (a.game_id ? `Oyun #${a.game_id}` : 'Sayfa');
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
      const totalDevice = (deviceVisits.desktop || 0) + (deviceVisits.mobile || 0) + (deviceVisits.tablet || 0);
      const totalTraffic =
        (trafficSources.direct || 0) + (trafficSources.search || 0) + (trafficSources.social || 0) + (trafficSources.referral || 0);
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

  // Engagement Score
  const engagementScore = useMemo(() => {
    const commentRatio = (stats.totalComments || 0) / Math.max(stats.totalViews || 1, 1);
    const commentScore = Math.min(commentRatio * 100 * 0.2, 20);
    const ratingScore = (parseFloat(stats.avgRating || 0) / 5) * 30;
    const activityScore = Math.min(((stats.totalViews || 0) / 1000) * 30, 30);
    const gamesScore = Math.min(((stats.totalGames || 0) / 50) * 20, 20);
    return Math.round(Math.min(commentScore + ratingScore + activityScore + gamesScore, 100));
  }, [stats]);

  const maxTopGameViews = analytics.topGames[0]?.views || 1;

  return (
    <div className="space-y-6">
      {/* Başlık + Zaman Filtresi + Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Site Analitiği</h2>
          <p className="text-sm text-gray-500 mt-0.5">Ziyaretçi ve etkileşim verileri</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TIME_RANGES.map((tr) => (
            <button
              key={tr.value}
              onClick={() => setTimeRange(tr.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeRange === tr.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tr.label}
            </button>
          ))}
          <button
            onClick={() => {
              exportAnalyticsData();
              toast.success('Veriler dışa aktarıldı!', { icon: '📊' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium ml-1"
          >
            <Download size={16} />
            İndir
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          {/* Ana Metrikler - 5 Kart */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard icon={Eye} label="Görüntülenme" value={analytics.totalPageViews} color="bg-green-50 text-green-600" />
            <MetricCard icon={Users} label="Ziyaretçi" value={analytics.uniqueSessions} color="bg-blue-50 text-blue-600" />
            <MetricCard icon={MessageCircle} label="Yorum" value={analytics.totalComments} color="bg-purple-50 text-purple-600" />
            <MetricCard icon={Search} label="Arama" value={analytics.totalSearches} color="bg-amber-50 text-amber-600" />
            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl p-5 text-white shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} />
                <span className="text-sm font-medium opacity-90">Engagement</span>
              </div>
              <div className="text-3xl font-bold">{engagementScore}/100</div>
              <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${engagementScore}%` }} />
              </div>
            </div>
          </div>

          {/* Etkileşim Kartları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <EngagementCard icon={Clock} label="Ort. Süre" value={`${analytics.avgTimeOnSite}sn`} desc="Sitede kalma" />
            <EngagementCard
              icon={analytics.bounceRate > 50 ? TrendingDown : TrendingUp}
              label="Hemen Çıkma"
              value={`%${analytics.bounceRate}`}
              desc="5sn altı"
              warn={analytics.bounceRate > 50}
            />
            <EngagementCard icon={MousePointer} label="Sayfa/Oturum" value={analytics.avgPagePerSession} desc="Gezilen sayfa" />
            <EngagementCard icon={Share2} label="Paylaşım" value={analytics.totalShares} desc="Sosyal medya" />
          </div>

          {/* Ana Grid: Sol (Top Oyunlar + Aktivite) | Sağ (Cihaz + Trafik) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Sol - 8/12 */}
            <div className="lg:col-span-8 space-y-5">
              {/* Top Oyunlar */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-orange-500" />
                  En Popüler Oyunlar
                </h3>
                {analytics.topGames.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topGames.map((game, i) => (
                      <div
                        key={game.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50/50 transition-colors"
                      >
                        <span
                          className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold ${
                            i === 0
                              ? 'bg-yellow-100 text-yellow-700'
                              : i === 1
                                ? 'bg-gray-200 text-gray-600'
                                : i === 2
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <img src={game.image} alt={game.name} className="w-11 h-11 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{game.name}</div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye size={12} /> {game.views.toLocaleString('tr-TR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle size={12} /> {game.comments}
                            </span>
                          </div>
                        </div>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${(game.views / maxTopGameViews) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm py-6 text-center">Henüz veri yok</p>
                )}
              </div>

              {/* Son Aktiviteler */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-blue-500" />
                  Son Aktiviteler
                </h3>
                {analytics.recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.recentActivity.slice(0, 8).map((a, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl text-sm">
                        <ActivityIcon type={a.event_type} />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-800 truncate block">
                            {a.event_type === 'game_view' && 'Görüntülendi: '}
                            {a.event_type === 'comment_submit' && 'Yorum: '}
                            {a.event_type === 'share_click' && 'Paylaşıldı: '}
                            {a.event_type === 'search' && 'Arama: '}
                            {a.game_name || a.event_data?.search_term || '-'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">
                          {new Date(a.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm py-6 text-center">Henüz aktivite yok</p>
                )}
              </div>
            </div>

            {/* Sağ - 4/12 */}
            <div className="lg:col-span-4 space-y-5">
              {/* Cihaz Dağılımı */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Monitor size={20} className="text-indigo-500" />
                  Cihaz Dağılımı
                </h3>
                <div className="space-y-4">
                  <DeviceBar icon={Monitor} label="Masaüstü" value={analytics.deviceStats.desktop} color="bg-indigo-500" />
                  <DeviceBar icon={Smartphone} label="Mobil" value={analytics.deviceStats.mobile} color="bg-emerald-500" />
                  <DeviceBar icon={Tablet} label="Tablet" value={analytics.deviceStats.tablet} color="bg-amber-500" />
                </div>
              </div>

              {/* Trafik Kaynakları */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe size={20} className="text-cyan-500" />
                  Trafik Kaynakları
                </h3>
                <div className="space-y-4">
                  <TrafficBar label="Doğrudan" value={analytics.trafficSources.direct} color="bg-cyan-500" />
                  <TrafficBar label="Arama (Google)" value={analytics.trafficSources.search} color="bg-green-500" />
                  <TrafficBar label="Sosyal Medya" value={analytics.trafficSources.social} color="bg-pink-500" />
                  <TrafficBar label="Referral" value={analytics.trafficSources.referral} color="bg-orange-500" />
                </div>
              </div>

              {/* Bilgi Kutusu */}
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <p className="text-orange-800 text-xs leading-relaxed">
                  <strong className="text-orange-900">Not:</strong> Veriler{' '}
                  {timeRange === '24hours'
                    ? 'son 24 saat'
                    : timeRange === '7days'
                      ? 'son 7 gün'
                      : timeRange === '30days'
                        ? 'son 30 gün'
                        : 'tüm zamanlar'}
                  {' '}içindeki etkileşimlere dayanmaktadır.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Alt Bileşenler
function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString('tr-TR') : value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function EngagementCard({ icon: Icon, label, value, desc, warn }) {
  return (
    <div className={`rounded-2xl p-4 sm:p-5 border ${warn ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={18} className={warn ? 'text-red-500' : 'text-gray-500'} />
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className={`text-xl sm:text-2xl font-bold ${warn ? 'text-red-600' : 'text-gray-900'}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
    </div>
  );
}

function DeviceBar({ icon: Icon, label, value, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900">%{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function TrafficBar({ label, value, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">%{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ActivityIcon({ type }) {
  const base = 'w-8 h-8 rounded-lg flex items-center justify-center shrink-0';
  switch (type) {
    case 'game_view':
      return (
        <div className={`${base} bg-green-100`}>
          <Eye size={16} className="text-green-600" />
        </div>
      );
    case 'comment_submit':
      return (
        <div className={`${base} bg-purple-100`}>
          <MessageCircle size={16} className="text-purple-600" />
        </div>
      );
    case 'share_click':
      return (
        <div className={`${base} bg-pink-100`}>
          <Share2 size={16} className="text-pink-600" />
        </div>
      );
    case 'search':
      return (
        <div className={`${base} bg-amber-100`}>
          <Search size={16} className="text-amber-600" />
        </div>
      );
    default:
      return (
        <div className={`${base} bg-gray-100`}>
          <Activity size={16} className="text-gray-500" />
        </div>
      );
  }
}
