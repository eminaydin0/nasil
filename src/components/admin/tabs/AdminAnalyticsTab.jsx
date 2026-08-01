import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  AnalyticsToolbar,
  AnalyticsOverviewSection,
  AnalyticsDailySection,
  AnalyticsVisitorsSection,
  AnalyticsTrendSection,
  AnalyticsPageViewsSection,
  AnalyticsTopGamesSection,
  AnalyticsSearchSection,
  AnalyticsInsightsSection,
  AnalyticsTrafficSection,
  useAnalyticsData,
} from '../analytics';

export default function AdminAnalyticsTab({ games, stats }) {
  const [timeRange, setTimeRange] = useState('7days');
  const [activeSection, setActiveSection] = useState('overview');
  const { analytics, loading } = useAnalyticsData(games, timeRange);

  return (
    <div className="space-y-6">
      <AnalyticsToolbar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        analytics={analytics}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-orange-500" />
        </div>
      ) : analytics.loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center text-sm text-rose-700">
          {analytics.loadError}
        </div>
      ) : (
        <>
          {activeSection === 'overview' && (
            <AnalyticsOverviewSection analytics={analytics} stats={stats} />
          )}
          {activeSection === 'daily' && (
            <AnalyticsDailySection
              dailyStats={analytics.dailyStats}
              hourlyStats={analytics.hourlyStats}
              todayStats={analytics.todayStats}
              timeRange={timeRange}
            />
          )}
          {activeSection === 'visitors' && (
            <AnalyticsVisitorsSection sessions={analytics.sessions} games={games} />
          )}
          {activeSection === 'trends' && (
            <AnalyticsTrendSection
              chartData={analytics.chartData}
              timeRange={timeRange}
              comparison={analytics.comparison}
            />
          )}
          {activeSection === 'pages' && (
            <AnalyticsPageViewsSection pageViewStats={analytics.pageViewStats} />
          )}
          {activeSection === 'games' && (
            <AnalyticsTopGamesSection topGames={analytics.topGames} />
          )}
          {activeSection === 'searches' && (
            <AnalyticsSearchSection searchStats={analytics.searchStats} />
          )}
          {activeSection === 'insights' && (
            <AnalyticsInsightsSection
              funnel={analytics.funnel}
              shareStats={analytics.shareStats}
              liveVisitors={analytics.liveVisitors}
            />
          )}
          {activeSection === 'traffic' && (
            <AnalyticsTrafficSection
              analytics={analytics}
              timeRange={timeRange}
              referrerStats={analytics.referrerStats}
            />
          )}
        </>
      )}
    </div>
  );
}
