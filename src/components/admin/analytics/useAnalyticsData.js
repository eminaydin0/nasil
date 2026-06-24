import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  fetchPageViewStats,
  fetchTopGamesByPeriod,
  fetchSearchStats,
  fetchChartData,
  fetchLiveVisitors,
  fetchFunnelStats,
  fetchShareStats,
  fetchPeriodComparison,
} from '../../../utils/analytics';
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
};

function getStartDate(timeRange) {
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
}

function getLocalStorageFallback() {
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
}

export function useAnalyticsData(games, timeRange) {
  const [analytics, setAnalytics] = useState(EMPTY_ANALYTICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const startDate = getStartDate(timeRange);
        const toolLinks = Object.fromEntries(SITE_TOOLS.map((t) => [t.link, t.title]));

        const [
          rpcResult,
          topGames,
          pageViewStats,
          chartData,
          searchStats,
          shareStats,
          funnel,
          liveVisitors,
          comparison,
        ] = await Promise.all([
          supabase.rpc('get_dashboard_stats', { p_start_date: startDate.toISOString() }),
          fetchTopGamesByPeriod(timeRange, games, 10),
          fetchPageViewStats(timeRange, games, toolLinks),
          fetchChartData(timeRange),
          fetchSearchStats(timeRange),
          fetchShareStats(timeRange),
          fetchFunnelStats(timeRange),
          fetchLiveVisitors(),
          fetchPeriodComparison(timeRange),
        ]);

        let coreStats = {};
        if (!rpcResult.error && rpcResult.data) {
          const stats = rpcResult.data;
          coreStats = {
            totalPageViews: stats.totalPageViews || 0,
            totalComments: stats.totalComments || 0,
            totalShares: stats.totalShares || 0,
            totalSearches: stats.totalSearches || 0,
            uniqueSessions: stats.uniqueSessions || 0,
            avgTimeOnSite: stats.avgTimeOnSite || 0,
            bounceRate: stats.bounceRate || 0,
            deviceStats: stats.deviceStats || { desktop: 0, mobile: 0, tablet: 0 },
            trafficSources:
              stats.trafficSources || { direct: 0, search: 0, social: 0, referral: 0 },
            avgPagePerSession:
              stats.uniqueSessions > 0
                ? ((stats.totalPageViews || 0) / stats.uniqueSessions).toFixed(1)
                : 0,
          };
        } else {
          coreStats = getLocalStorageFallback();
        }

        if (!cancelled) {
          setAnalytics({
            ...EMPTY_ANALYTICS,
            ...coreStats,
            topGames,
            pageViewStats,
            chartData,
            searchStats,
            shareStats,
            funnel,
            liveVisitors,
            comparison,
          });
        }
      } catch (err) {
        console.error('Analytics error:', err);
        if (!cancelled) setAnalytics(EMPTY_ANALYTICS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [games, timeRange]);

  return { analytics, loading };
}
