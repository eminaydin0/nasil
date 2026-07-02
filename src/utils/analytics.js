// Supabase + Google Analytics 4
import { supabase } from '../lib/supabase';
import {
  initGoogleAnalytics,
  isGoogleAnalyticsConfigured,
  mirrorSupabaseEventToGoogle,
} from '../lib/googleAnalytics';

// Session Management
let sessionId = null;
let analyticsInitialized = false;
let lastDurationSentAt = 0;
const DURATION_SEND_INTERVAL_MS = 60_000;

export { isGoogleAnalyticsConfigured, getGoogleAnalyticsMeasurementId } from '../lib/googleAnalytics';

export const hasAnalyticsConsent = () => {
  if (typeof window === 'undefined') return false;
  try {
    const consent = JSON.parse(localStorage.getItem('cookie_consent') || 'null');
    return consent?.analytics === true;
  } catch {
    return false;
  }
};

// Generate or get session ID
const getSessionId = () => {
  if (sessionId) return sessionId;
  
  // Check if session exists in sessionStorage (lasts for browser tab)
  sessionId = sessionStorage.getItem('analytics_session_id');
  
  if (!sessionId) {
    // Create new session ID
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
    sessionStorage.setItem('session_start', Date.now().toString());
  }
  
  return sessionId;
};

// Track analytics event to Supabase
const trackToSupabase = async (eventType, eventData = {}, gameId = null) => {
  if (!hasAnalyticsConsent()) return;

  try {
    const sessionId = getSessionId();
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || null;
    
    // Insert event to Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        event_type: eventType,
        event_data: eventData,
        game_id: gameId,
        session_id: sessionId,
        user_agent: userAgent,
        referrer: referrer
      }]);
    
    if (error) {
      console.error('Analytics tracking error:', error);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  } finally {
    mirrorSupabaseEventToGoogle(eventType, eventData, gameId);
  }
};

// Initialize Analytics (single entry point — safe to call once)
export const initAnalytics = () => {
  if (typeof window === 'undefined' || analyticsInitialized || !hasAnalyticsConsent()) return;
  analyticsInitialized = true;

  if (isGoogleAnalyticsConfigured()) {
    initGoogleAnalytics();
  }

  getSessionId();
  const sessionStart = Date.now();
  sessionStorage.setItem('session_start', sessionStart.toString());

  trackDeviceType();
  trackTrafficSource();

  trackToSupabase('session_activity', {
    duration: 0,
    timestamp: new Date().toISOString(),
  });

  window.addEventListener('beforeunload', () => updateSessionDuration(true));
  setInterval(() => updateSessionDuration(false), DURATION_SEND_INTERVAL_MS);
};

/** @deprecated Use initAnalytics() */
export const initGA = () => initAnalytics();

// Track page views
export const trackPageView = (url) => {
  trackToSupabase('page_view', { 
    page: url,
    timestamp: new Date().toISOString()
  });
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  trackToSupabase(action, {
    category,
    label,
    value
  });
};

// Specific tracking functions
export const trackNewsView = (title, newsId, category) => {
  trackToSupabase(
    'news_view',
    {
      news_title: title,
      category,
      timestamp: new Date().toISOString(),
    },
    newsId
  );
};

export const trackNewsReaction = (title, newsId, emoji) => {
  trackToSupabase(
    'news_reaction',
    {
      news_title: title,
      emoji,
      timestamp: new Date().toISOString(),
    },
    newsId
  );
};

export const trackNewsComment = (title, newsId) => {
  trackToSupabase(
    'news_comment',
    {
      news_title: title,
      timestamp: new Date().toISOString(),
    },
    newsId
  );
};

export const trackGameView = (gameName, gameId) => {
  trackToSupabase('game_view', {
    game_name: gameName,
    timestamp: new Date().toISOString()
  }, gameId);
};

export const trackGameSearch = (searchTerm) => {
  trackToSupabase('search', {
    search_term: searchTerm,
    timestamp: new Date().toISOString()
  });
};

export const trackCommentSubmit = (gameName, gameId, rating = null) => {
  trackToSupabase('comment_submit', {
    game_name: gameName,
    rating: rating,
    timestamp: new Date().toISOString()
  }, gameId);
};

export const trackShare = (platform, gameName, gameId = null) => {
  trackToSupabase('share_click', {
    platform: platform,
    game_name: gameName,
    timestamp: new Date().toISOString()
  }, gameId);
};

// Session tracking
export const trackSession = () => {
  const sessionStart = sessionStorage.getItem('session_start');
  const now = Date.now();
  
  if (!sessionStart) {
    sessionStorage.setItem('session_start', now.toString());
  } else {
    const sessionDuration = Math.round((now - parseInt(sessionStart)) / 1000); // seconds
    
    // Track session with duration
    trackToSupabase('session_activity', {
      duration: sessionDuration,
      timestamp: new Date().toISOString()
    });
  }
};

// Device tracking
export const trackDeviceType = () => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    let deviceType = 'desktop';
    
    if (width < 768) {
      deviceType = 'mobile';
    } else if (width >= 768 && width < 1024) {
      deviceType = 'tablet';
    }
    
    // Get current device stats for local display
    const deviceVisits = JSON.parse(localStorage.getItem('device_visits') || '{"desktop": 0, "mobile": 0, "tablet": 0}');
    deviceVisits[deviceType] = (deviceVisits[deviceType] || 0) + 1;
    localStorage.setItem('device_visits', JSON.stringify(deviceVisits));
    
    // Track to Supabase
    trackToSupabase('device_info', {
      device_type: deviceType,
      screen_width: width,
      screen_height: window.innerHeight
    });
    
    return deviceType;
  }
  return 'desktop';
};

// Traffic source tracking
export const trackTrafficSource = () => {
  if (typeof window !== 'undefined') {
    const referrer = document.referrer;
    const hostname = window.location.hostname;
    let source = 'direct';
    
    if (referrer && referrer !== '') {
      const referrerHostname = new URL(referrer).hostname;
      
      // Check if it's from the same site
      if (referrerHostname === hostname) {
        return; // Don't track internal navigation
      }
      
      // Check for search engines
      const searchEngines = ['google', 'bing', 'yahoo', 'yandex', 'duckduckgo', 'baidu'];
      if (searchEngines.some(engine => referrerHostname.includes(engine))) {
        source = 'search';
      }
      // Check for social media
      else if (['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest', 'reddit', 'tiktok', 'youtube'].some(social => referrerHostname.includes(social))) {
        source = 'social';
      }
      // Other referrals
      else {
        source = 'referral';
      }
    }
    
    // Check URL parameters for UTM source
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    if (utmSource) {
      if (utmSource.includes('google') || utmSource.includes('search')) {
        source = 'search';
      } else if (['facebook', 'twitter', 'instagram', 'linkedin'].includes(utmSource.toLowerCase())) {
        source = 'social';
      }
    }
    
    // Update traffic sources for local display
    const trafficSources = JSON.parse(localStorage.getItem('traffic_sources') || '{"direct": 0, "search": 0, "social": 0, "referral": 0}');
    trafficSources[source] = (trafficSources[source] || 0) + 1;
    localStorage.setItem('traffic_sources', JSON.stringify(trafficSources));
    
    // Track to Supabase
    trackToSupabase('traffic_source', {
      source: source,
      referrer: referrer || 'direct',
      utm_source: utmSource
    });
    
    return source;
  }
  return 'direct';
};

// Session duration tracking
export const updateSessionDuration = (force = false) => {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;

  const now = Date.now();
  if (!force && now - lastDurationSentAt < DURATION_SEND_INTERVAL_MS) return;
  lastDurationSentAt = now;

  const sessionStart = parseInt(sessionStorage.getItem('session_start') || now, 10);
  const duration = Math.round((now - sessionStart) / 1000);

  const sessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
  const currentSessionIndex = sessions.findIndex((s) => s.start === sessionStart);

  if (currentSessionIndex >= 0) {
    sessions[currentSessionIndex].duration = duration;
  } else {
    sessions.push({ start: sessionStart, duration });
  }

  if (sessions.length > 50) sessions.shift();
  localStorage.setItem('user_sessions', JSON.stringify(sessions));

  trackToSupabase('session_duration', {
    duration,
    timestamp: new Date().toISOString(),
  });
};

/** @deprecated Use initAnalytics() */
export const initSession = () => initAnalytics();

// Admin Analytics - Get all analytics data
export const getAnalyticsData = () => {
  if (typeof window === 'undefined') return null;
  
  return {
    deviceVisits: JSON.parse(localStorage.getItem('device_visits') || '{"desktop": 0, "mobile": 0, "tablet": 0}'),
    trafficSources: JSON.parse(localStorage.getItem('traffic_sources') || '{"direct": 0, "search": 0, "social": 0, "referral": 0}'),
    userSessions: JSON.parse(localStorage.getItem('user_sessions') || '[]'),
    currentSessionStart: localStorage.getItem('current_session_start'),
    sessionStart: localStorage.getItem('session_start')
  };
};

// Admin Analytics - Export analytics data as JSON
export const exportAnalyticsData = () => {
  const data = getAnalyticsData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Admin Analytics - Clear local analytics data (keep session ID)
export const clearAnalyticsData = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('device_visits');
  localStorage.removeItem('traffic_sources');
  localStorage.removeItem('user_sessions');
  // Don't clear sessionStorage as it's needed for current session
  
  console.log('Local analytics data cleared');
};

// Fetch analytics data from Supabase
export const getStartDateForTimeRange = (timeRange = '7days') => {
  const startDate = new Date();
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
      return new Date(0);
    default:
      startDate.setDate(startDate.getDate() - 7);
  }
  return startDate;
};

const STATIC_PAGE_LABELS = {
  '/': 'Ana Sayfa',
  '/oyunlar': 'Tüm Oyunlar',
  '/araclar': 'Oyun Araçları',
  '/hakkimizda': 'Hakkımızda',
  '/iletisim': 'İletişim',
  '/gizlilik': 'Gizlilik Politikası',
  '/kullanim-kosullari': 'Kullanım Koşulları',
  '/cerez-politikasi': 'Çerez Politikası',
  '/reklam-verin': 'Reklam Verin',
  '/auth': 'Giriş / Kayıt',
  '/profil': 'Profil',
};

/** Sayfa yolunu admin panelde okunabilir etikete çevirir */
export function resolvePageLabel(path, games = [], toolLinks = {}) {
  if (!path) return 'Bilinmeyen Sayfa';

  const [pathname, query = ''] = path.split('?');

  if (STATIC_PAGE_LABELS[pathname]) return STATIC_PAGE_LABELS[pathname];

  if (pathname === '/oyunlar' || (pathname.startsWith('/oyunlar') && query.includes('search='))) {
    const params = new URLSearchParams(query);
    const term = params.get('search');
    return term ? `Oyun Arama: "${term}"` : 'Tüm Oyunlar';
  }

  if (pathname.startsWith('/oyun/') && !pathname.includes('101-skor-tablosu')) {
    const slug = pathname.replace('/oyun/', '');
    const game = games.find((g) => g.slug === slug);
    return game ? `Oyun: ${game.name}` : `Oyun: ${slug}`;
  }

  if (pathname.includes('/101-skor-tablosu')) {
    const slug = pathname.replace('/oyun/', '').replace('/101-skor-tablosu', '');
    const game = games.find((g) => g.slug === slug);
    return game ? `101 Skor: ${game.name}` : `101 Skor Tablosu`;
  }

  if (pathname.startsWith('/kategori/')) {
    const category = decodeURIComponent(pathname.replace('/kategori/', ''));
    return `Kategori: ${category}`;
  }

  if (pathname.startsWith('/araclar/')) {
    const toolLabel = toolLinks[pathname];
    if (toolLabel) return toolLabel;
    return `Araç: ${pathname.replace('/araclar/', '')}`;
  }

  if (pathname.startsWith('/karsilastir/')) {
    const pair = pathname.replace('/karsilastir/', '').replace(/-/g, ' ');
    return `Karşılaştırma: ${pair}`;
  }

  if (pathname.startsWith('/hata-')) {
    return `Hata Sayfası (${pathname.replace('/hata-', '')})`;
  }

  return pathname;
}

/** Sayfa bazlı görüntülenme sayılarını döner (analytics_events.page_view) */
export const fetchPageViewStats = async (timeRange = '7days', games = [], toolLinks = {}) => {
  try {
    const startDate = getStartDateForTimeRange(timeRange);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('event_type', 'page_view')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const counts = {};
    for (const row of data || []) {
      const page = row.event_data?.page || '/';
      counts[page] = (counts[page] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([path, views]) => ({
        path,
        views,
        label: resolvePageLabel(path, games, toolLinks),
      }))
      .sort((a, b) => b.views - a.views);
  } catch (error) {
    console.error('Failed to fetch page view stats:', error);
    return [];
  }
};

export const fetchAnalyticsFromSupabase = async (timeRange = '7days') => {
  try {
    const startDate = getStartDateForTimeRange(timeRange);
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return events || [];
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return [];
  }
};

// Get top games from analytics
export const getTopGames = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('top_games_weekly')
      .select('*')
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch top games:', error);
    return [];
  }
};

// Get hourly traffic data
export const getHourlyTraffic = async () => {
  try {
    const { data, error } = await supabase
      .from('hourly_traffic')
      .select('*')
      .limit(24);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch hourly traffic:', error);
    return [];
  }
};

// Get recent activity
export const getRecentActivity = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('recent_activity')
      .select('*')
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch recent activity:', error);
    return [];
  }
};

// Get daily analytics
export const getDailyAnalytics = async (days = 7) => {
  try {
    const { data, error } = await supabase
      .from('daily_analytics')
      .select('*')
      .limit(days);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch daily analytics:', error);
    return [];
  }
};

function pctChange(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

async function countEventsInRange(eventType, start, end = null) {
  let query = supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', start.toISOString());

  if (end) query = query.lt('created_at', end.toISOString());
  if (eventType) query = query.eq('event_type', eventType);

  const { count, error } = await query;
  if (error) throw error;
  return count || 0;
}

async function countUniqueSessionsInRange(start, end = null) {
  let query = supabase
    .from('analytics_events')
    .select('session_id')
    .gte('created_at', start.toISOString())
    .not('session_id', 'is', null);

  if (end) query = query.lt('created_at', end.toISOString());

  const { data, error } = await query;
  if (error) throw error;
  return new Set((data || []).map((r) => r.session_id)).size;
}

/** Seçili döneme göre popüler oyunlar (game_view event'lerinden) */
export const fetchTopGamesByPeriod = async (timeRange = '7days', games = [], limit = 10) => {
  try {
    const startDate = getStartDateForTimeRange(timeRange);

    const { data: views, error: viewsError } = await supabase
      .from('analytics_events')
      .select('game_id')
      .eq('event_type', 'game_view')
      .gte('created_at', startDate.toISOString())
      .not('game_id', 'is', null);

    if (viewsError) throw viewsError;

    const { data: comments, error: commentsError } = await supabase
      .from('analytics_events')
      .select('game_id')
      .eq('event_type', 'comment_submit')
      .gte('created_at', startDate.toISOString())
      .not('game_id', 'is', null);

    if (commentsError) throw commentsError;

    const viewCounts = {};
    const commentCounts = {};

    for (const row of views || []) {
      viewCounts[row.game_id] = (viewCounts[row.game_id] || 0) + 1;
    }
    for (const row of comments || []) {
      commentCounts[row.game_id] = (commentCounts[row.game_id] || 0) + 1;
    }

    const gameIds = new Set([...Object.keys(viewCounts), ...Object.keys(commentCounts)]);

    return [...gameIds]
      .map((id) => {
        const gameId = Number(id);
        const game = games.find((g) => g.id === gameId);
        return {
          id: gameId,
          name: game?.name || `Oyun #${gameId}`,
          image: game?.image || '',
          views: viewCounts[gameId] || 0,
          comments: commentCounts[gameId] || 0,
        };
      })
      .sort((a, b) => b.views - a.views || b.comments - a.comments)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch top games by period:', error);
    return [];
  }
};

/** En çok aranan terimler */
export const fetchSearchStats = async (timeRange = '7days', limit = 15) => {
  try {
    const startDate = getStartDateForTimeRange(timeRange);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('event_type', 'search')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const counts = {};
    for (const row of data || []) {
      const term = (row.event_data?.search_term || '').trim().toLowerCase();
      if (!term || term.length < 2) continue;
      counts[term] = (counts[term] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch search stats:', error);
    return [];
  }
};

/** Zaman içinde görüntülenme trendi */
export const fetchChartData = async (timeRange = '7days') => {
  try {
    const startDate = getStartDateForTimeRange(timeRange);
    const interval = timeRange === '24hours' ? 'hour' : 'day';

    const { data, error } = await supabase.rpc('get_analytics_chart_data', {
      p_start_date: startDate.toISOString(),
      p_interval: interval,
    });

    if (!error && data?.length) {
      return data.map((row) => ({
        date: row.date_bucket,
        views: Number(row.view_count) || 0,
      }));
    }

    const { data: events, error: eventsError } = await supabase
      .from('analytics_events')
      .select('created_at')
      .eq('event_type', 'page_view')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (eventsError) throw eventsError;

    const buckets = {};
    for (const row of events || []) {
      const d = new Date(row.created_at);
      const key =
        interval === 'hour'
          ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`
          : `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      buckets[key] = (buckets[key] || 0) + 1;
    }

    return Object.entries(buckets).map(([key, views]) => ({
      date: key,
      views,
    }));
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    return [];
  }
};

/** Son 5 dakikadaki aktif oturum sayısı */
export const fetchLiveVisitors = async () => {
  try {
    const since = new Date(Date.now() - 5 * 60 * 1000);
    const { data, error } = await supabase
      .from('analytics_events')
      .select('session_id')
      .gte('created_at', since.toISOString())
      .not('session_id', 'is', null);

    if (error) throw error;
    return new Set((data || []).map((r) => r.session_id)).size;
  } catch (error) {
    console.error('Failed to fetch live visitors:', error);
    return 0;
  }
};

/** Dönüşüm hunisi: ana sayfa → oyun → yorum */
export const fetchFunnelStats = async (timeRange = '7days') => {
  try {
    const startDate = getStartDateForTimeRange(timeRange);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_type, event_data')
      .gte('created_at', startDate.toISOString())
      .in('event_type', ['page_view', 'game_view', 'comment_submit', 'share_click']);

    if (error) throw error;

    let homeViews = 0;
    let gameViews = 0;
    let comments = 0;
    let shares = 0;

    for (const row of data || []) {
      if (row.event_type === 'page_view') {
        const page = row.event_data?.page || '';
        if (page === '/' || page.startsWith('/?')) homeViews += 1;
      } else if (row.event_type === 'game_view') gameViews += 1;
      else if (row.event_type === 'comment_submit') comments += 1;
      else if (row.event_type === 'share_click') shares += 1;
    }

    return {
      homeViews,
      gameViews,
      comments,
      shares,
      homeToGame: homeViews ? Math.round((gameViews / homeViews) * 100) : 0,
      gameToComment: gameViews ? Math.round((comments / gameViews) * 100) : 0,
    };
  } catch (error) {
    console.error('Failed to fetch funnel stats:', error);
    return { homeViews: 0, gameViews: 0, comments: 0, shares: 0, homeToGame: 0, gameToComment: 0 };
  }
};

/** Platform bazlı paylaşım istatistikleri */
export const fetchShareStats = async (timeRange = '7days', limit = 8) => {
  try {
    const startDate = getStartDateForTimeRange(timeRange);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('event_type', 'share_click')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const counts = {};
    for (const row of data || []) {
      const platform = (row.event_data?.platform || 'bilinmeyen').toLowerCase();
      counts[platform] = (counts[platform] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch share stats:', error);
    return [];
  }
};

/** Önceki dönemle karşılaştırma (yüzde değişim) */
export const fetchPeriodComparison = async (timeRange = '7days') => {
  if (timeRange === 'all') {
    return { pageViews: null, sessions: null, comments: null, searches: null };
  }

  try {
    const now = new Date();
    const currentStart = getStartDateForTimeRange(timeRange);
    const duration = now.getTime() - currentStart.getTime();
    const previousStart = new Date(currentStart.getTime() - duration);

    const [
      curViews,
      prevViews,
      curSessions,
      prevSessions,
      curComments,
      prevComments,
      curSearches,
      prevSearches,
    ] = await Promise.all([
      countEventsInRange('page_view', currentStart),
      countEventsInRange('page_view', previousStart, currentStart),
      countUniqueSessionsInRange(currentStart),
      countUniqueSessionsInRange(previousStart, currentStart),
      countEventsInRange('comment_submit', currentStart),
      countEventsInRange('comment_submit', previousStart, currentStart),
      countEventsInRange('search', currentStart),
      countEventsInRange('search', previousStart, currentStart),
    ]);

    return {
      pageViews: pctChange(curViews, prevViews),
      sessions: pctChange(curSessions, prevSessions),
      comments: pctChange(curComments, prevComments),
      searches: pctChange(curSearches, prevSearches),
    };
  } catch (error) {
    console.error('Failed to fetch period comparison:', error);
    return { pageViews: null, sessions: null, comments: null, searches: null };
  }
};
