import { Gamepad2, Users, MessageCircle, LayoutGrid } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const stats = [
  { id: 'games', label: 'Oyun Rehberi', icon: Gamepad2 },
  { id: 'users', label: 'Aktif Kullanıcı', icon: Users },
  { id: 'comments', label: 'Kullanıcı Yorumu', icon: MessageCircle },
  { id: 'categories', label: 'Kategori', icon: LayoutGrid },
];

function StatsSection() {
  const [counts, setCounts] = useState({
    games: 0,
    users: 0,
    comments: 0,
    categories: 6
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { count: gameCount } = await supabase
        .from('games')
        .select('*', { count: 'exact', head: true });
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      const { count: commentCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true });

      setCounts({
        games: gameCount || 50,
        users: userCount || 100,
        comments: commentCount || 200,
        categories: 6
      });
    } catch (error) {
      console.error('Stats error:', error);
      setCounts({ games: 50, users: 100, comments: 200, categories: 6 });
    }
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const count = counts[stat.id];
              return (
                <div
                  key={stat.id}
                  className="flex items-center gap-4 p-6 md:p-8 group"
                >
                  {/* İkon */}
                  <div className="flex-shrink-0 p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  {/* Sayı + Etiket */}
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">
                        {count}
                      </span>
                      <span className="text-lg md:text-xl font-bold text-orange-500">+</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
