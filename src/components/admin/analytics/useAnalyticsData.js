import { useState, useEffect } from 'react';
import {
  fetchChartData,
  fetchLiveVisitors,
  fetchPeriodComparison,
} from '../../../utils/analytics';
import {
  fetchDashboardCore,
  fetchDailyStats,
  fetchHourlyStats,
  fetchReferrerStats,
  fetchSessionList,
  fetchPageViewStatsAdmin,
  fetchTopGamesAdmin,
  fetchSearchStatsAdmin,
  fetchShareStatsAdmin,
  fetchFunnelStatsAdmin,
  fetchTodayVsYesterday,
} from '../../../utils/analyticsAdmin';
import { SITE_TOOLS } from '../../../constants/tools';

const EMPTY_ANALYTICS = {
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
  pageViewStats: [],
  chartData: [],
  searchStats: [],
  shareStats: [],
  funnel: { homeViews: 0, gameViews: 0, comments: 0, shares: 0, homeToGame: 0, gameToComment: 0 },
  liveVisitors: 0,
  comparison: { pageViews: null, sessions: null, comments: null, searches: null },
  dailyStats: [],
  hourlyStats: [],
  referrerStats: [],
  sessions: [],
  todayStats: {
    todaySessions: 0,
    yesterdaySessions: 0,
    todayViews: 0,
    yesterdayViews: 0,
  },
  dataSource: null,
  loadError: null,
};

export function useAnalyticsData(games, timeRange) {
  const [analytics, setAnalytics] = useState(EMPTY_ANALYTICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const toolLinks = Object.fromEntries(SITE_TOOLS.map((t) => [t.link, t.title]));

        const [
          core,
          topGames,
          pageViewStats,
          chartData,
          searchStats,
          shareStats,
          funnel,
          liveVisitors,
          comparison,
          dailyStats,
          hourlyStats,
          referrerStats,
          sessions,
          todayStats,
        ] = await Promise.all([
          fetchDashboardCore(timeRange),
          fetchTopGamesAdmin(timeRange, games, 10),
          fetchPageViewStatsAdmin(timeRange, games, toolLinks),
          fetchChartData(timeRange),
          fetchSearchStatsAdmin(timeRange),
          fetchShareStatsAdmin(timeRange),
          fetchFunnelStatsAdmin(timeRange),
          fetchLiveVisitors(),
          fetchPeriodComparison(timeRange),
          fetchDailyStats(timeRange),
          fetchHourlyStats(timeRange),
          fetchReferrerStats(timeRange),
          fetchSessionList(timeRange, 100),
          fetchTodayVsYesterday(),
        ]);

        if (!cancelled) {
          setAnalytics({
            ...EMPTY_ANALYTICS,
            ...core,
            topGames,
            pageViewStats,
            chartData,
            searchStats,
            shareStats,
            funnel,
            liveVisitors,
            comparison,
            dailyStats,
            hourlyStats,
            referrerStats,
            sessions,
            todayStats,
            dataSource: core.source || null,
            loadError: null,
          });
        }
      } catch (err) {
        console.error('Analytics error:', err);
        if (!cancelled) {
          setAnalytics({
            ...EMPTY_ANALYTICS,
            loadError: err?.message || 'Analitik verisi yüklenemedi',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const liveTimer = setInterval(async () => {
      try {
        const [liveVisitors, todayStats] = await Promise.all([
          fetchLiveVisitors(),
          fetchTodayVsYesterday(),
        ]);
        if (!cancelled) {
          setAnalytics((prev) => ({ ...prev, liveVisitors, todayStats }));
        }
      } catch {
        /* ignore live refresh errors */
      }
    }, 60_000);

    return () => {
      cancelled = true;
      clearInterval(liveTimer);
    };
  }, [games, timeRange]);

  return { analytics, loading };
}
