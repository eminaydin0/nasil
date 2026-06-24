import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  AnalyticsToolbar,
  AnalyticsOverviewSection,
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
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          {activeSection === 'overview' && (
            <AnalyticsOverviewSection analytics={analytics} stats={stats} />
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
            <AnalyticsTrafficSection analytics={analytics} timeRange={timeRange} />
          )}
        </>
      )}
    </div>
  );
}
