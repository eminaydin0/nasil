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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BarChart3 className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalGames || 0}</div>
        <div className="text-sm text-gray-600">Toplam Oyun</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Eye className="text-green-600" size={24} />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{(stats.totalViews || 0).toLocaleString('tr-TR')}</div>
        <div className="text-sm text-gray-600">Toplam Görüntülenme</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <MessageCircle className="text-purple-600" size={24} />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalComments || 0}</div>
        <div className="text-sm text-gray-600">Toplam Yorum</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Star className="text-yellow-600" size={24} />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{stats.avgRating || '0.0'}</div>
        <div className="text-sm text-gray-600">Ortalama Puan</div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl shadow-sm p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <TrendingUp className="text-white" size={24} />
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{engagementScore}/100</div>
        <div className="text-sm text-white/90">Engagement Score</div>
        <div className="mt-2 w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${engagementScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
