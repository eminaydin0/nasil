import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, MessageCircle, Clock, MousePointer, Share2, Monitor, Smartphone, Tablet, Activity, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function AnalyticsDashboard({ games }) {
  const [analytics, setAnalytics] = useState({
    totalPageViews: 0,
    totalComments: 0,
    totalShares: 0,
    totalSearches: 0,
    avgTimeOnSite: 0,
    topGames: [],
    recentActivity: [],
    deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
    trafficSources: { direct: 0, search: 0, social: 0, referral: 0 },
    userSessions: [],
    bounceRate: 0,
    avgPagePerSession: 0,
    uniqueSessions: 0,
    hourlyData: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days'); // 24hours, 7days, 30days

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Calculate date range
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
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      // Fetch all events from analytics_events
      const { data: events, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (eventsError) {
        console.error('Error loading events:', eventsError);
        throw eventsError;
      }

      // Calculate stats from events
      const totalPageViews = events?.filter(e => e.event_type === 'page_view').length || 0;
      const totalComments = events?.filter(e => e.event_type === 'comment_submit').length || 0;
      const totalShares = events?.filter(e => e.event_type === 'share_click').length || 0;
      const totalSearches = events?.filter(e => e.event_type === 'search').length || 0;
      const uniqueSessions = new Set(events?.map(e => e.session_id)).size;

      // Calculate device stats
      const deviceEvents = events?.filter(e => e.event_type === 'device_info') || [];
      const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
      deviceEvents.forEach(e => {
        const deviceType = e.event_data?.device_type;
        if (deviceType && Object.prototype.hasOwnProperty.call(deviceCounts, deviceType)) {
          deviceCounts[deviceType]++;
        }
      });
      const totalDevices = Object.values(deviceCounts).reduce((a, b) => a + b, 0);
      const deviceStats = totalDevices > 0 ? {
        desktop: Math.round((deviceCounts.desktop / totalDevices) * 100),
        mobile: Math.round((deviceCounts.mobile / totalDevices) * 100),
        tablet: Math.round((deviceCounts.tablet / totalDevices) * 100)
      } : { desktop: 0, mobile: 0, tablet: 0 };

      // Calculate traffic sources
      const trafficEvents = events?.filter(e => e.event_type === 'traffic_source') || [];
      const trafficCounts = { direct: 0, search: 0, social: 0, referral: 0 };
      trafficEvents.forEach(e => {
        const source = e.event_data?.source;
        if (source && Object.prototype.hasOwnProperty.call(trafficCounts, source)) {
          trafficCounts[source]++;
        }
      });
      const totalTraffic = Object.values(trafficCounts).reduce((a, b) => a + b, 0);
      const trafficSources = totalTraffic > 0 ? {
        direct: Math.round((trafficCounts.direct / totalTraffic) * 100),
        search: Math.round((trafficCounts.search / totalTraffic) * 100),
        social: Math.round((trafficCounts.social / totalTraffic) * 100),
        referral: Math.round((trafficCounts.referral / totalTraffic) * 100)
      } : { direct: 0, search: 0, social: 0, referral: 0 };

      // Calculate average session duration
      const durationEvents = events?.filter(e => e.event_type === 'session_duration') || [];
      const avgTime = durationEvents.length > 0
        ? Math.round(durationEvents.reduce((sum, e) => sum + (e.event_data?.duration || 0), 0) / durationEvents.length)
        : 0;

      // Get top games from game_analytics view
      const { data: topGamesData } = await supabase
        .from('top_games_weekly')
        .select('*')
        .limit(5);

      const topGames = (topGamesData || []).map(gameData => {
        const game = games.find(g => g.id === gameData.game_id);
        return {
          id: gameData.game_id,
          name: game?.name || `Oyun #${gameData.game_id}`,
          slug: game?.slug || '',
          views: gameData.views || 0,
          comments: gameData.comments || 0,
          shares: gameData.shares || 0,
          image: game?.image || '/default-game.png',
          engagementScore: gameData.engagement_score || 0
        };
      });

      // Get recent activity
      const { data: recentActivityData } = await supabase
        .from('recent_activity')
        .select('*')
        .limit(20);

      const recentActivity = (recentActivityData || []).map(activity => {
        const game = games.find(g => g.id === activity.game_id);
        return {
          ...activity,
          game_name: game?.name || `Oyun #${activity.game_id}`,
          game_slug: game?.slug || ''
        };
      });

      // Get hourly traffic
      const { data: hourlyData } = await supabase
        .from('hourly_traffic')
        .select('*')
        .limit(24);

      // Calculate bounce rate (sessions < 5 seconds)
      const shortSessions = durationEvents.filter(e => (e.event_data?.duration || 0) < 5).length;
      const bounceRate = durationEvents.length > 0 
        ? Math.round((shortSessions / durationEvents.length) * 100)
        : 0;

      // Calculate pages per session
      const avgPagePerSession = uniqueSessions > 0 
        ? (totalPageViews / uniqueSessions).toFixed(1)
        : 0;

      setAnalytics({
        totalPageViews,
        totalComments,
        totalShares,
        totalSearches,
        avgTimeOnSite: avgTime,
        topGames,
        recentActivity,
        deviceStats,
        trafficSources,
        userSessions: durationEvents,
        bounceRate,
        avgPagePerSession,
        uniqueSessions,
        hourlyData: hourlyData || []
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Fallback to localStorage data
      const localData = syncLocalStorageData();
      setAnalytics(prev => ({
        ...prev,
        ...localData
      }));
    } finally {
      setLoading(false);
    }
  };

  const syncLocalStorageData = () => {
    // localStorage'dan gerçek kullanıcı verilerini al (fallback için)
    const deviceVisits = JSON.parse(localStorage.getItem('device_visits') || '{"desktop": 0, "mobile": 0, "tablet": 0}');
    const trafficSources = JSON.parse(localStorage.getItem('traffic_sources') || '{"direct": 0, "search": 0, "social": 0, "referral": 0}');
    const userSessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
    
    const totalDeviceVisits = deviceVisits.desktop + deviceVisits.mobile + deviceVisits.tablet;
    const deviceStats = totalDeviceVisits > 0 ? {
      desktop: Math.round((deviceVisits.desktop / totalDeviceVisits) * 100),
      mobile: Math.round((deviceVisits.mobile / totalDeviceVisits) * 100),
      tablet: Math.round((deviceVisits.tablet / totalDeviceVisits) * 100)
    } : { desktop: 0, mobile: 0, tablet: 0 };
    
    const totalTraffic = trafficSources.direct + trafficSources.search + trafficSources.social + trafficSources.referral;
    const trafficStats = totalTraffic > 0 ? {
      direct: Math.round((trafficSources.direct / totalTraffic) * 100),
      search: Math.round((trafficSources.search / totalTraffic) * 100),
      social: Math.round((trafficSources.social / totalTraffic) * 100),
      referral: Math.round((trafficSources.referral / totalTraffic) * 100)
    } : { direct: 0, search: 0, social: 0, referral: 0 };
    
    const avgTime = userSessions.length > 0 
      ? Math.round(userSessions.reduce((sum, s) => sum + s.duration, 0) / userSessions.length)
      : 0;
    
    const bounceCount = userSessions.filter(s => s.duration < 5).length;
    const bounceRate = userSessions.length > 0 
      ? Math.round((bounceCount / userSessions.length) * 100)
      : 0;
    
    return { 
      deviceStats, 
      trafficSources: trafficStats, 
      avgTimeOnSite: avgTime, 
      bounceRate, 
      userSessions 
    };
  };

  const StatCard = ({ icon: Icon, label, value, color, suffix = '' }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{typeof value === 'number' ? value.toLocaleString('tr-TR') : value}{suffix}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Analytics Dashboard</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('24hours')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === '24hours'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Son 24 Saat
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === '7days'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Son 7 Gün
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === '30days'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Son 30 Gün
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={Eye}
              label="Toplam Görüntülenme"
              value={analytics.totalPageViews}
              color="bg-orange-500"
              suffix=""
            />
            <StatCard 
              icon={Users}
              label="Benzersiz Ziyaretçi"
              value={analytics.uniqueSessions}
              color="bg-orange-600"
              suffix=""
            />
            <StatCard 
              icon={MessageCircle}
              label="Toplam Yorum"
              value={analytics.totalComments}
              color="bg-amber-500"
              suffix=""
            />
            <StatCard 
              icon={Search}
              label="Yapılan Aramalar"
              value={analytics.totalSearches}
              color="bg-red-500"
              suffix=""
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Engagement & Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Engagement Stats */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Activity className="text-orange-600" size={20} />
                  Etkileşim Analizi
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-orange-600" size={18} />
                      <span className="text-sm font-medium text-gray-600">Ort. Süre</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{analytics.avgTimeOnSite}sn</div>
                    <div className="text-xs text-gray-500 mt-1">Sitede geçirilen süre</div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="text-red-600" size={18} />
                      <span className="text-sm font-medium text-gray-600">Hemen Çıkma</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">%{analytics.bounceRate}</div>
                    <div className="text-xs text-gray-500 mt-1">5sn altı ziyaretler</div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointer className="text-amber-600" size={18} />
                      <span className="text-sm font-medium text-gray-600">Sayfa/Oturum</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{analytics.avgPagePerSession}</div>
                    <div className="text-xs text-gray-500 mt-1">Gezilen sayfa sayısı</div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="text-orange-600" size={18} />
                      <span className="text-sm font-medium text-gray-600">Paylaşımlar</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{analytics.totalShares}</div>
                    <div className="text-xs text-gray-500 mt-1">Sosyal medya</div>
                  </div>
                </div>
              </div>

              {/* Top Games */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="text-orange-600" size={20} />
                    En Popüler Oyunlar
                  </h3>
                </div>
                <div className="space-y-4">
                  {analytics.topGames.length > 0 ? (
                    analytics.topGames.map((game, index) => (
                      <div key={game.id} className="flex items-center gap-4 p-3 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-200 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          #{index + 1}
                        </div>
                        <img src={game.image} alt={game.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{game.name}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye size={14} /> {game.views.toLocaleString('tr-TR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle size={14} /> {game.comments}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-24 bg-gray-100 rounded-full h-2 mb-1">
                            <div 
                              className="bg-orange-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((game.views / (analytics.topGames[0]?.views || 1)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">Henüz veri yok</div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="text-orange-600" size={20} />
                  Son Aktiviteler
                </h3>
                <div className="space-y-3">
                  {analytics.recentActivity.length > 0 ? (
                    analytics.recentActivity.slice(0, 8).map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          activity.event_type === 'game_view' ? 'bg-orange-100' :
                          activity.event_type === 'comment_submit' ? 'bg-amber-100' :
                          activity.event_type === 'share_click' ? 'bg-red-100' :
                          activity.event_type === 'search' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          {activity.event_type === 'game_view' && <Eye className="text-orange-600" size={18} />}
                          {activity.event_type === 'comment_submit' && <MessageCircle className="text-amber-600" size={18} />}
                          {activity.event_type === 'share_click' && <Share2 className="text-red-600" size={18} />}
                          {activity.event_type === 'search' && <Search className="text-yellow-600" size={18} />}
                          {!['game_view', 'comment_submit', 'share_click', 'search'].includes(activity.event_type) && (
                            <Activity className="text-gray-600" size={18} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {activity.event_type === 'game_view' && <span className="text-orange-700">Oyun Görüntülendi:</span>}
                            {activity.event_type === 'comment_submit' && <span className="text-amber-700">Yeni Yorum:</span>}
                            {activity.event_type === 'share_click' && <span className="text-red-700">Paylaşım:</span>}
                            {activity.event_type === 'search' && <span className="text-yellow-700">Arama:</span>}
                            {' '}
                            <span className="text-gray-700">
                              {activity.game_name || activity.event_data?.search_term || activity.event_data?.page || 'Bilinmeyen'}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(activity.created_at).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">Henüz aktivite yok</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Audience Stats */}
            <div className="space-y-6">
              
              {/* Device Stats */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Monitor className="text-orange-600" size={20} />
                  Cihaz Dağılımı
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Monitor size={18} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Masaüstü</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">%{analytics.deviceStats.desktop}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analytics.deviceStats.desktop}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Smartphone size={18} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Mobil</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">%{analytics.deviceStats.mobile}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analytics.deviceStats.mobile}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Tablet size={18} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Tablet</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">%{analytics.deviceStats.tablet}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analytics.deviceStats.tablet}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Share2 className="text-orange-600" size={20} />
                  Trafik Kaynakları
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Doğrudan (Direct)</span>
                      <span className="text-sm font-bold text-gray-900">%{analytics.trafficSources.direct}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analytics.trafficSources.direct}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Arama (Google)</span>
                      <span className="text-sm font-bold text-gray-900">%{analytics.trafficSources.search}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analytics.trafficSources.search}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Sosyal Medya</span>
                      <span className="text-sm font-bold text-gray-900">%{analytics.trafficSources.social}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analytics.trafficSources.social}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Diğer (Referral)</span>
                      <span className="text-sm font-bold text-gray-900">%{analytics.trafficSources.referral}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analytics.trafficSources.referral}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                <h4 className="font-bold text-orange-900 mb-2 text-sm">Bilgilendirme</h4>
                <p className="text-orange-800 text-xs leading-relaxed">
                  Veriler son {timeRange === '24hours' ? '24 saat' : timeRange === '7days' ? '7 gün' : '30 gün'} içindeki kullanıcı etkileşimlerine dayanmaktadır. 
                  İstatistikler her sayfa yenilendiğinde güncellenir.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
