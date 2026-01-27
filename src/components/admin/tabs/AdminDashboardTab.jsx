import AdminStats from '../AdminStats';
import TopGames from '../TopGames';

export default function AdminDashboardTab({ stats, sortedGames }) {
  return (
    <div className="space-y-8">
      <AdminStats stats={stats} />
      <TopGames sortedGames={sortedGames} />
    </div>
  );
}
