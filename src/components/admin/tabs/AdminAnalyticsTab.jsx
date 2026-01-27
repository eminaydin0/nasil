import { Download, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import AnalyticsDashboard from '../AnalyticsDashboard';
import { exportAnalyticsData } from '../../../utils/analytics';

export default function AdminAnalyticsTab({ games, stats }) {
  return (
    <div className="space-y-6">
      {/* Analytics Actions */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Engagement Score</div>
              <div className="text-xs text-gray-500">Kullanıcı etkileşim puanı</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {Math.round(
              Math.min(
                ((stats.totalComments / Math.max(stats.totalViews, 1)) * 100 * 0.2) +
                ((parseFloat(stats.avgRating || 0) / 5) * 30) +
                (Math.min((stats.totalViews / 1000) * 30, 30)) +
                (Math.min((stats.totalGames / 50) * 20, 20)),
                100
              )
            )}/100
          </div>
        </div>
        <button
          onClick={() => {
            exportAnalyticsData();
            toast.success('Analytics verileri dışa aktarıldı!', { icon: '📊' });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Download size={18} />
          <span>Analytics İndir</span>
        </button>
      </div>
      
      <AnalyticsDashboard games={games} />
    </div>
  );
}
