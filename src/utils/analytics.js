// Supabase Analytics Integration
import { supabase } from '../lib/supabase';

// Session Management
let sessionId = null;
let analyticsInitialized = false;

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
  }
};

// Initialize Analytics (single entry point — safe to call once)
export const initAnalytics = () => {
  if (typeof window === 'undefined' || analyticsInitialized) return;
  analyticsInitialized = true;

  getSessionId();
  const sessionStart = Date.now();
  sessionStorage.setItem('session_start', sessionStart.toString());

  trackDeviceType();
  trackTrafficSource();
  trackPageView(window.location.pathname);

  trackToSupabase('session_activity', {
    duration: 0,
    timestamp: new Date().toISOString(),
  });

  window.addEventListener('beforeunload', updateSessionDuration);
  setInterval(updateSessionDuration, 30000);
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
export const updateSessionDuration = () => {
  if (typeof window !== 'undefined') {
    const sessionStart = parseInt(sessionStorage.getItem('session_start') || Date.now());
    const duration = Math.round((Date.now() - sessionStart) / 1000); // seconds
    
    // Save session data locally for admin dashboard
    const sessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
    const currentSessionIndex = sessions.findIndex(s => s.start === sessionStart);
    
    if (currentSessionIndex >= 0) {
      sessions[currentSessionIndex].duration = duration;
    } else {
      sessions.push({ start: sessionStart, duration: duration });
    }
    
    // Keep only last 50 sessions
    if (sessions.length > 50) {
      sessions.shift();
    }
    
    localStorage.setItem('user_sessions', JSON.stringify(sessions));
    
    // Track to Supabase
    trackToSupabase('session_duration', {
      duration: duration,
      timestamp: new Date().toISOString()
    });
  }
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
