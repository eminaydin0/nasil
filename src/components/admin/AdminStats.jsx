import { BarChart3, Eye, MessageCircle, Star, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

function AdminStats({ stats }) {
  const [engagementScore, setEngagementScore] = useState(0);
  
  useEffect(() => {
    // Calculate engagement score based on stats
    const calculateScore = () => {
      if (!stats || !stats.totalViews) return 0;
      
      // Factors for engagement:
      // 1. Comments per view (max 20%)
      const commentRatio = stats.totalComments / Math.max(stats.totalViews, 1);
      const commentScore = Math.min(commentRatio * 100, 20);
      
      // 2. Average rating (max 30%)
      const ratingScore = (parseFloat(stats.avgRating || 0) / 5) * 30;
      
      // 3. Total activity (max 30%)
      const activityScore = Math.min((stats.totalViews / 1000) * 30, 30);
      
      // 4. Games count (max 20%)
      const gamesScore = Math.min((stats.totalGames / 50) * 20, 20);
      
      return Math.round(commentScore + ratingScore + activityScore + gamesScore);
    };
    
    setEngagementScore(calculateScore());
  }, [stats]);
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="p-2.5 sm:p-3 bg-blue-50 rounded-xl w-fit mb-3 sm:mb-4">
          <BarChart3 className="text-blue-600" size={22} />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalGames || 0}</div>
        <div className="text-xs sm:text-sm text-gray-500 mt-0.5">Toplam Oyun</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="p-2.5 sm:p-3 bg-green-50 rounded-xl w-fit mb-3 sm:mb-4">
          <Eye className="text-green-600" size={22} />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900">{(stats.totalViews || 0).toLocaleString('tr-TR')}</div>
        <div className="text-xs sm:text-sm text-gray-500 mt-0.5">Görüntülenme</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="p-2.5 sm:p-3 bg-purple-50 rounded-xl w-fit mb-3 sm:mb-4">
          <MessageCircle className="text-purple-600" size={22} />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalComments || 0}</div>
        <div className="text-xs sm:text-sm text-gray-500 mt-0.5">Toplam Yorum</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="p-2.5 sm:p-3 bg-amber-50 rounded-xl w-fit mb-3 sm:mb-4">
          <Star className="text-amber-600" size={22} />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.avgRating || '0.0'}</div>
        <div className="text-xs sm:text-sm text-gray-500 mt-0.5">Ortalama Puan</div>
      </div>

      <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl shadow-md p-5 sm:p-6 border-0 hover:shadow-lg transition-shadow">
        <div className="p-2.5 sm:p-3 bg-white/20 rounded-xl w-fit mb-3 sm:mb-4">
          <TrendingUp className="text-white" size={22} />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white">{engagementScore}/100</div>
        <div className="text-xs sm:text-sm text-white/90 mt-0.5">Engagement</div>
        <div className="mt-3 w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(engagementScore, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
