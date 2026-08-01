/**
 * Admin analytics — Supabase RPC öncelikli, paginated client fallback
 */
import { supabase } from '../lib/supabase';
import {
  getStartDateForTimeRange,
  resolvePageLabel,
} from './analytics';

const PAGE_SIZE = 1000;
const MAX_ROWS = 20000;

async function rpcJson(name, params) {
  const { data, error } = await supabase.rpc(name, params);
  if (error) throw error;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
}

/** Supabase 1000 satır limitini aşmak için sayfalı çekim */
export async function fetchEventsPaginated(buildQuery, { maxRows = MAX_ROWS } = {}) {
  const rows = [];
  let from = 0;

  while (from < maxRows) {
    const to = Math.min(from + PAGE_SIZE - 1, maxRows - 1);
    const { data, error } = await buildQuery().range(from, to);
    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

function parseReferrerHost(referrer) {
  if (!referrer || referrer === 'direct') return 'direct';
  try {
    return new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return referrer;
  }
}

function detectDeviceFromUa(ua = '') {
  const s = ua.toLowerCase();
  if (/ipad|tablet/.test(s)) return 'tablet';
  if (/mobi|iphone|android/.test(s)) return 'mobile';
  return 'desktop';
}

function detectSourceFromReferrer(referrer) {
  if (!referrer) return 'direct';
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (['google', 'bing', 'yahoo', 'yandex', 'duckduckgo', 'baidu'].some((e) => host.includes(e))) {
      return 'search';
    }
    if (
      ['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest', 'reddit', 'tiktok', 'youtube', 't.co', 'x.com'].some(
        (s) => host.includes(s)
      )
    ) {
      return 'social';
    }
    return 'referral';
  } catch {
    return 'direct';
  }
}

function dayKeyIstanbul(iso) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));
}

function hourIstanbul(iso) {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Istanbul',
      hour: 'numeric',
      hour12: false,
    }).format(new Date(iso))
  );
}

function buildSessionsFromEvents(events) {
  const map = new Map();

  for (const e of events) {
    if (!e.session_id) continue;
    let s = map.get(e.session_id);
    if (!s) {
      s = {
        id: e.session_id,
        startedAt: e.created_at,
        lastAt: e.created_at,
        landingPage: null,
        exitPage: null,
        pages: [],
        pageViews: 0,
        gameViews: 0,
        searches: 0,
        comments: 0,
        referrer: e.referrer || null,
        device: null,
        source: null,
        duration: 0,
        userId: null,
        userEmail: null,
        userAgent: e.user_agent || null,
        utmSource: null,
        bounced: false,
      };
      map.set(e.session_id, s);
    }

    if (new Date(e.created_at) < new Date(s.startedAt)) s.startedAt = e.created_at;
    if (new Date(e.created_at) > new Date(s.lastAt)) s.lastAt = e.created_at;
    if (e.referrer && !s.referrer) s.referrer = e.referrer;
    if (e.user_agent && !s.userAgent) s.userAgent = e.user_agent;

    const data = e.event_data || {};
    if (data.user_id && !s.userId) s.userId = data.user_id;
    if (data.user_email && !s.userEmail) s.userEmail = data.user_email;
    if (data.utm_source && !s.utmSource) s.utmSource = data.utm_source;

    if (e.event_type === 'page_view') {
      const page = data.page || '/';
      s.pageViews += 1;
      if (!s.landingPage) s.landingPage = page;
      s.exitPage = page;
      if (!s.pages.includes(page) && s.pages.length < 12) s.pages.push(page);
    } else if (e.event_type === 'game_view') {
      s.gameViews += 1;
    } else if (e.event_type === 'search') {
      s.searches += 1;
    } else if (e.event_type === 'comment_submit') {
      s.comments += 1;
    } else if (e.event_type === 'device_info' && data.device_type) {
      if (!s.device) s.device = data.device_type;
    } else if (e.event_type === 'traffic_source' && data.source) {
      if (!s.source) s.source = data.source;
    } else if (e.event_type === 'session_start') {
      if (data.device_type && !s.device) s.device = data.device_type;
      if (data.source && !s.source) s.source = data.source;
      if (data.landing_page && !s.landingPage) s.landingPage = data.landing_page;
    } else if (e.event_type === 'session_duration') {
      const d = Number(data.duration) || 0;
      if (d > s.duration) s.duration = d;
    }
  }

  return [...map.values()].map((s) => {
    if (!s.device) s.device = detectDeviceFromUa(s.userAgent || '');
    if (!s.source) s.source = detectSourceFromReferrer(s.referrer);
    if (!s.referrer) s.referrer = 'direct';
    s.bounced = s.pageViews <= 1;
    return s;
  });
}

function computeCoreFromSessions(sessions, events) {
  const totalPageViews = events.filter((e) => e.event_type === 'page_view').length;
  const totalComments = events.filter((e) => e.event_type === 'comment_submit').length;
  const totalShares = events.filter((e) => e.event_type === 'share_click').length;
  const totalSearches = events.filter((e) => e.event_type === 'search').length;
  const uniqueSessions = sessions.length;

  const withDuration = sessions.filter((s) => s.duration > 0);
  const avgTimeOnSite = withDuration.length
    ? Math.round(withDuration.reduce((a, s) => a + s.duration, 0) / withDuration.length)
    : 0;
  const bounceRate = uniqueSessions
    ? Math.round((sessions.filter((s) => s.bounced).length / uniqueSessions) * 100)
    : 0;

  const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
  const sourceCounts = { direct: 0, search: 0, social: 0, referral: 0 };
  for (const s of sessions) {
    if (deviceCounts[s.device] != null) deviceCounts[s.device] += 1;
    else deviceCounts.desktop += 1;
    if (sourceCounts[s.source] != null) sourceCounts[s.source] += 1;
    else sourceCounts.direct += 1;
  }
  const deviceTotal = Object.values(deviceCounts).reduce((a, b) => a + b, 0) || 1;
  const sourceTotal = Object.values(sourceCounts).reduce((a, b) => a + b, 0) || 1;

  return {
    totalPageViews,
    totalComments,
    totalShares,
    totalSearches,
    uniqueSessions,
    avgTimeOnSite,
    bounceRate,
    avgPagePerSession: uniqueSessions ? (totalPageViews / uniqueSessions).toFixed(1) : 0,
    deviceStats: {
      desktop: Math.round((deviceCounts.desktop / deviceTotal) * 100),
      mobile: Math.round((deviceCounts.mobile / deviceTotal) * 100),
      tablet: Math.round((deviceCounts.tablet / deviceTotal) * 100),
    },
    trafficSources: {
      direct: Math.round((sourceCounts.direct / sourceTotal) * 100),
      search: Math.round((sourceCounts.search / sourceTotal) * 100),
      social: Math.round((sourceCounts.social / sourceTotal) * 100),
      referral: Math.round((sourceCounts.referral / sourceTotal) * 100),
    },
  };
}

let bundleCache = { key: null, promise: null };

/** Tek seferde event çek → tüm detay metrikleri üret (RPC yoksa). Aynı timeRange için cache. */
async function loadEventsBundle(timeRange) {
  if (bundleCache.key === timeRange && bundleCache.promise) return bundleCache.promise;

  const promise = (async () => {
    const startDate = getStartDateForTimeRange(timeRange);
    const events = await fetchEventsPaginated(() =>
      supabase
        .from('analytics_events')
        .select('session_id, event_type, event_data, referrer, user_agent, created_at, game_id')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })
    );
    const sessions = buildSessionsFromEvents(events);
    return { events, sessions, startDate };
  })();

  bundleCache = { key: timeRange, promise };
  promise.finally(() => {
    setTimeout(() => {
      if (bundleCache.promise === promise) bundleCache = { key: null, promise: null };
    }, 8000);
  });

  return promise;
}

export async function fetchDashboardCore(timeRange) {
  const startDate = getStartDateForTimeRange(timeRange);
  try {
    const stats = await rpcJson('get_dashboard_stats', { p_start_date: startDate.toISOString() });
    if (stats && typeof stats === 'object') {
      return {
        totalPageViews: stats.totalPageViews || 0,
        totalComments: stats.totalComments || 0,
        totalShares: stats.totalShares || 0,
        totalSearches: stats.totalSearches || 0,
        uniqueSessions: stats.uniqueSessions || 0,
        avgTimeOnSite: stats.avgTimeOnSite || 0,
        bounceRate: stats.bounceRate || 0,
        deviceStats: stats.deviceStats || { desktop: 0, mobile: 0, tablet: 0 },
        trafficSources: stats.trafficSources || { direct: 0, search: 0, social: 0, referral: 0 },
        avgPagePerSession:
          stats.uniqueSessions > 0
            ? ((stats.totalPageViews || 0) / stats.uniqueSessions).toFixed(1)
            : 0,
        source: 'rpc',
      };
    }
  } catch {
    /* fallback */
  }

  const { events, sessions } = await loadEventsBundle(timeRange);
  return { ...computeCoreFromSessions(sessions, events), source: 'client' };
}

export async function fetchDailyStats(timeRange) {
  const startDate = getStartDateForTimeRange(timeRange);
  try {
    const data = await rpcJson('get_analytics_daily_stats', {
      p_start_date: startDate.toISOString(),
    });
    if (Array.isArray(data)) {
      return data.map((row) => ({
        date: row.date,
        pageViews: Number(row.pageViews) || 0,
        sessions: Number(row.sessions) || 0,
        comments: Number(row.comments) || 0,
        searches: Number(row.searches) || 0,
        shares: Number(row.shares) || 0,
        bounceRate: Number(row.bounceRate) || 0,
        avgDuration: Number(row.avgDuration) || 0,
      }));
    }
  } catch {
    /* fallback */
  }

  const { events, sessions } = await loadEventsBundle(timeRange);
  const byDay = {};

  for (const e of events) {
    const key = dayKeyIstanbul(e.created_at);
    if (!byDay[key]) {
      byDay[key] = {
        date: key,
        pageViews: 0,
        sessions: 0,
        comments: 0,
        searches: 0,
        shares: 0,
        bounceRate: 0,
        avgDuration: 0,
        _sessionIds: new Set(),
      };
    }
    const row = byDay[key];
    if (e.event_type === 'page_view') row.pageViews += 1;
    if (e.event_type === 'comment_submit') row.comments += 1;
    if (e.event_type === 'search') row.searches += 1;
    if (e.event_type === 'share_click') row.shares += 1;
    if (e.session_id) row._sessionIds.add(e.session_id);
  }

  const sessionsByDay = {};
  for (const s of sessions) {
    const key = dayKeyIstanbul(s.startedAt);
    if (!sessionsByDay[key]) sessionsByDay[key] = [];
    sessionsByDay[key].push(s);
  }

  return Object.keys(byDay)
    .sort()
    .map((key) => {
      const row = byDay[key];
      const daySessions = sessionsByDay[key] || [];
      const bounced = daySessions.filter((s) => s.bounced).length;
      const withDur = daySessions.filter((s) => s.duration > 0);
      return {
        date: key,
        pageViews: row.pageViews,
        sessions: daySessions.length || row._sessionIds.size,
        comments: row.comments,
        searches: row.searches,
        shares: row.shares,
        bounceRate: daySessions.length ? Math.round((bounced / daySessions.length) * 100) : 0,
        avgDuration: withDur.length
          ? Math.round(withDur.reduce((a, s) => a + s.duration, 0) / withDur.length)
          : 0,
      };
    });
}

export async function fetchHourlyStats(timeRange) {
  const startDate = getStartDateForTimeRange(timeRange);
  try {
    const data = await rpcJson('get_analytics_hourly_stats', {
      p_start_date: startDate.toISOString(),
    });
    if (Array.isArray(data) && data.length) {
      return data.map((row) => ({
        hour: Number(row.hour),
        pageViews: Number(row.pageViews) || 0,
        sessions: Number(row.sessions) || 0,
      }));
    }
  } catch {
    /* fallback */
  }

  const { events } = await loadEventsBundle(timeRange);
  const hours = Array.from({ length: 24 }, (_, hour) => ({ hour, pageViews: 0, sessions: new Set() }));
  for (const e of events) {
    const h = hourIstanbul(e.created_at);
    if (e.event_type === 'page_view') hours[h].pageViews += 1;
    if (e.session_id) hours[h].sessions.add(e.session_id);
  }
  return hours.map((h) => ({ hour: h.hour, pageViews: h.pageViews, sessions: h.sessions.size }));
}

export async function fetchReferrerStats(timeRange, limit = 25) {
  const startDate = getStartDateForTimeRange(timeRange);
  try {
    const data = await rpcJson('get_analytics_referrer_stats', {
      p_start_date: startDate.toISOString(),
      p_limit: limit,
    });
    if (Array.isArray(data)) {
      return data.map((row) => ({
        host: row.host || 'direct',
        source: row.source || 'direct',
        sessions: Number(row.sessions) || 0,
      }));
    }
  } catch {
    /* fallback */
  }

  const { sessions } = await loadEventsBundle(timeRange);
  const counts = {};
  for (const s of sessions) {
    const host = parseReferrerHost(s.referrer);
    const key = `${host}||${s.source || 'direct'}`;
    if (!counts[key]) counts[key] = { host, source: s.source || 'direct', sessions: 0 };
    counts[key].sessions += 1;
  }
  return Object.values(counts)
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, limit);
}

export async function fetchSessionList(timeRange, limit = 75) {
  const startDate = getStartDateForTimeRange(timeRange);
  try {
    const data = await rpcJson('get_analytics_sessions', {
      p_start_date: startDate.toISOString(),
      p_limit: limit,
    });
    if (Array.isArray(data)) {
      return data.map((row) => ({
        id: row.id,
        startedAt: row.startedAt,
        lastAt: row.lastAt,
        pageViews: Number(row.pageViews) || 0,
        gameViews: Number(row.gameViews) || 0,
        searches: Number(row.searches) || 0,
        comments: Number(row.comments) || 0,
        duration: Number(row.duration) || 0,
        landingPage: row.landingPage || '/',
        exitPage: row.exitPage || row.landingPage || '/',
        referrer: row.referrer || 'direct',
        device: row.device || 'unknown',
        source: row.source || 'direct',
        userId: row.userId || null,
        userEmail: row.userEmail || null,
        userAgent: row.userAgent || null,
        utmSource: row.utmSource || null,
        pages: Array.isArray(row.pages) ? row.pages : [],
        bounced: Boolean(row.bounced),
      }));
    }
  } catch {
    /* fallback */
  }

  const { sessions } = await loadEventsBundle(timeRange);
  return sessions
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .slice(0, limit);
}

export async function fetchPageViewStatsAdmin(timeRange, games = [], toolLinks = {}) {
  const startDate = getStartDateForTimeRange(timeRange);
  try {
    const data = await rpcJson('get_analytics_page_stats', {
      p_start_date: startDate.toISOString(),
      p_limit: 50,
    });
    if (Array.isArray(data) && data.length) {
      return data.map((row) => ({
        path: row.path,
        views: Number(row.views) || 0,
        label: resolvePageLabel(row.path, games, toolLinks),
      }));
    }
  } catch {
    /* fallback */
  }

  const { events } = await loadEventsBundle(timeRange);
  const counts = {};
  for (const row of events) {
    if (row.event_type !== 'page_view') continue;
    const page = row.event_data?.page || '/';
    counts[page] = (counts[page] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([path, views]) => ({ path, views, label: resolvePageLabel(path, games, toolLinks) }))
    .sort((a, b) => b.views - a.views);
}

export async function fetchTopGamesAdmin(timeRange, games = [], limit = 10) {
  const startDate = getStartDateForTimeRange(timeRange);
  try {
    const data = await rpcJson('get_analytics_top_games_stats', {
      p_start_date: startDate.toISOString(),
      p_limit: limit,
    });
    if (Array.isArray(data) && data.length) {
      return data.map((row) => {
        const gameId = Number(row.id);
        const game = games.find((g) => g.id === gameId);
        return {
          id: gameId,
          name: game?.name || `Oyun #${gameId}`,
          image: game?.image || '',
          views: Number(row.views) || 0,
          comments: Number(row.comments) || 0,
        };
      });
    }
  } catch {
    /* fallback */
  }

  const { events } = await loadEventsBundle(timeRange);
  const viewCounts = {};
  const commentCounts = {};
  for (const row of events) {
    if (!row.game_id) continue;
    if (row.event_type === 'game_view') viewCounts[row.game_id] = (viewCounts[row.game_id] || 0) + 1;
    if (row.event_type === 'comment_submit') {
      commentCounts[row.game_id] = (commentCounts[row.game_id] || 0) + 1;
    }
  }
  const ids = new Set([...Object.keys(viewCounts), ...Object.keys(commentCounts)]);
  return [...ids]
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
}

export async function fetchSearchStatsAdmin(timeRange, limit = 15) {
  const startDate = getStartDateForTimeRange(timeRange);
  try {
    const data = await rpcJson('get_analytics_search_stats', {
      p_start_date: startDate.toISOString(),
      p_limit: limit,
    });
    if (Array.isArray(data)) {
      return data.map((row) => ({ term: row.term, count: Number(row.count) || 0 }));
    }
  } catch {
    /* fallback */
  }

  const { events } = await loadEventsBundle(timeRange);
  const counts = {};
  for (const row of events) {
    if (row.event_type !== 'search') continue;
    const term = (row.event_data?.search_term || '').trim().toLowerCase();
    if (!term || term.length < 2) continue;
    counts[term] = (counts[term] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function fetchShareStatsAdmin(timeRange, limit = 8) {
  const startDate = getStartDateForTimeRange(timeRange);
  try {
    const data = await rpcJson('get_analytics_share_stats', {
      p_start_date: startDate.toISOString(),
      p_limit: limit,
    });
    if (Array.isArray(data)) {
      return data.map((row) => ({ platform: row.platform, count: Number(row.count) || 0 }));
    }
  } catch {
    /* fallback */
  }

  const { events } = await loadEventsBundle(timeRange);
  const counts = {};
  for (const row of events) {
    if (row.event_type !== 'share_click') continue;
    const platform = (row.event_data?.platform || 'bilinmeyen').toLowerCase();
    counts[platform] = (counts[platform] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function fetchFunnelStatsAdmin(timeRange) {
  const startDate = getStartDateForTimeRange(timeRange);
  try {
    const data = await rpcJson('get_analytics_funnel_stats', {
      p_start_date: startDate.toISOString(),
    });
    if (data && typeof data === 'object') {
      return {
        homeViews: Number(data.homeViews) || 0,
        gameViews: Number(data.gameViews) || 0,
        comments: Number(data.comments) || 0,
        shares: Number(data.shares) || 0,
        homeToGame: Number(data.homeToGame) || 0,
        gameToComment: Number(data.gameToComment) || 0,
      };
    }
  } catch {
    /* fallback */
  }

  const { events } = await loadEventsBundle(timeRange);
  let homeViews = 0;
  let gameViews = 0;
  let comments = 0;
  let shares = 0;
  for (const row of events) {
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
    homeToGame: homeViews ? Math.min(Math.round((gameViews / homeViews) * 100), 100) : 0,
    gameToComment: gameViews ? Math.min(Math.round((comments / gameViews) * 100), 100) : 0,
  };
}

export async function fetchTodayVsYesterday() {
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startYesterday.getDate() - 1);

  const countDistinctSessions = async (start, end) => {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('session_id')
      .gte('created_at', start.toISOString())
      .lt('created_at', end.toISOString())
      .not('session_id', 'is', null);
    if (error) throw error;
    return new Set((data || []).map((r) => r.session_id)).size;
  };

  const countPageViews = async (start, end) => {
    const { count, error } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view')
      .gte('created_at', start.toISOString())
      .lt('created_at', end.toISOString());
    if (error) throw error;
    return count || 0;
  };

  try {
    const [todaySessions, yesterdaySessions, todayViews, yesterdayViews] = await Promise.all([
      countDistinctSessions(startToday, now),
      countDistinctSessions(startYesterday, startToday),
      countPageViews(startToday, now),
      countPageViews(startYesterday, startToday),
    ]);
    return { todaySessions, yesterdaySessions, todayViews, yesterdayViews };
  } catch (err) {
    console.error('Today vs yesterday failed:', err);
    return { todaySessions: 0, yesterdaySessions: 0, todayViews: 0, yesterdayViews: 0 };
  }
}

export function buildExportPayload(analytics) {
  return {
    exportedAt: new Date().toISOString(),
    summary: {
      totalPageViews: analytics.totalPageViews,
      uniqueSessions: analytics.uniqueSessions,
      totalComments: analytics.totalComments,
      totalSearches: analytics.totalSearches,
      totalShares: analytics.totalShares,
      avgTimeOnSite: analytics.avgTimeOnSite,
      bounceRate: analytics.bounceRate,
      avgPagePerSession: analytics.avgPagePerSession,
      deviceStats: analytics.deviceStats,
      trafficSources: analytics.trafficSources,
      liveVisitors: analytics.liveVisitors,
      today: analytics.todayStats,
    },
    daily: analytics.dailyStats,
    hourly: analytics.hourlyStats,
    referrers: analytics.referrerStats,
    sessions: analytics.sessions,
    pages: analytics.pageViewStats,
    games: analytics.topGames,
    searches: analytics.searchStats,
    shares: analytics.shareStats,
    funnel: analytics.funnel,
    chart: analytics.chartData,
  };
}
