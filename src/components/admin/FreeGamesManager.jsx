import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Loader2,
  Gift,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { syncFreeGamesFromApi, getLastSyncLog } from '../../lib/freeGamesSync';
import { GAMERPOWER_FILTERS } from '../../lib/gamerPower';
import { formatGiveawayEndDate } from '../../lib/gamerPower';
import { Button } from '../ui';
import { AdminToolbar, AdminFilterSelect } from './adminUi';

function FreeGamesManager() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [platformFilter, setPlatformFilter] = useState('all');

  const loadGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('free_games')
        .select('*')
        .order('synced_at', { ascending: false });

      if (error) throw error;
      setGames(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Ücretsiz oyunlar yüklenemedi. SQL tablosu oluşturuldu mu?');
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLastSync = async () => {
    const log = await getLastSyncLog();
    setLastSync(log);
  };

  useEffect(() => {
    loadGames();
    loadLastSync();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const query = GAMERPOWER_FILTERS[platformFilter] || GAMERPOWER_FILTERS.all;
      const { count } = await syncFreeGamesFromApi(query);
      toast.success(`${count} ücretsiz oyun güncellendi!`);
      await loadGames();
      await loadLastSync();
    } catch (err) {
      console.error(err);
      toast.error(
        err.message?.includes('Failed to fetch')
          ? 'API erişilemedi (CORS). Edge Function kullanın veya ağ bağlantısını kontrol edin.'
          : `Senkronizasyon hatası: ${err.message}`
      );
    } finally {
      setSyncing(false);
    }
  };

  const activeCount = games.filter((g) => g.is_active).length;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <AdminToolbar
        filters={
          <AdminFilterSelect
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            aria-label="Platform filtresi"
          >
            <option value="all">Tüm platformlar</option>
            <option value="pc">PC</option>
            <option value="steam">Steam</option>
            <option value="epic">Epic Games</option>
            <option value="gog">GOG</option>
          </AdminFilterSelect>
        }
        actions={
          <Button
            type="button"
            variant="primary"
            size="md"
            iconLeft={syncing ? undefined : RefreshCw}
            loading={syncing}
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? 'Güncelleniyor…' : 'Ücretsiz Oyunları Güncelle'}
          </Button>
        }
      />

      {lastSync && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            lastSync.status === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          {lastSync.status === 'success' ? (
            <CheckCircle2 size={20} className="shrink-0" />
          ) : (
            <AlertCircle size={20} className="shrink-0" />
          )}
          <div>
            <p className="font-bold">Son senkronizasyon</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs opacity-90">
              <Clock size={13} />
              {new Date(lastSync.created_at).toLocaleString('tr-TR')} — {lastSync.synced_count}{' '}
              kayıt — {lastSync.message}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 text-sm">
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-800">
          {activeCount} aktif
        </span>
        <span className="rounded-full bg-warm-100 px-3 py-1 font-bold text-warm-700">
          {games.length} toplam kayıt
        </span>
        <a
          href="/ucretsiz-oyunlar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-orange-600 hover:underline"
        >
          Sitede gör
          <ExternalLink size={14} />
        </a>
      </div>

      {games.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-warm-200 bg-white py-16 text-center">
          <Gift className="mx-auto mb-3 text-warm-300" size={40} />
          <p className="font-semibold text-warm-700">Henüz veri yok</p>
          <p className="mt-1 text-sm text-warm-500">
            Önce <code className="text-xs">create-free-games-table.sql</code> çalıştırın, sonra
            güncelle butonuna basın.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-warm-100 bg-cream-50 text-xs font-bold uppercase tracking-wide text-warm-500">
                <tr>
                  <th className="px-4 py-3">Oyun</th>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Değer</th>
                  <th className="px-4 py-3">Bitiş</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {games.slice(0, 50).map((game) => (
                  <tr key={game.id} className="hover:bg-cream-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {game.image && (
                          <img
                            src={game.image}
                            alt=""
                            className="h-10 w-16 rounded object-cover"
                          />
                        )}
                        <span className="line-clamp-2 font-semibold text-warm-900">
                          {game.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-warm-600">{game.platform}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{game.worth}</td>
                    <td className="px-4 py-3 text-warm-500">
                      {formatGiveawayEndDate(game.end_date)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          game.is_active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-warm-100 text-warm-600'
                        }`}
                      >
                        {game.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={game.open_giveaway_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-orange-600 hover:underline"
                      >
                        Mağaza
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-warm-200 bg-cream-50 p-4 text-xs text-warm-600">
        <p className="font-bold text-warm-800">Otomasyon (ileri seviye)</p>
        <p className="mt-1">
          Perşembe 18:00 için Supabase Edge Function + pg_cron kurulumu:{' '}
          <code>supabase/functions/sync-free-games</code> dosyasına bakın.
        </p>
      </div>
    </div>
  );
}

export default FreeGamesManager;
