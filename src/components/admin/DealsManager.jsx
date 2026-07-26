import { useState } from 'react';
import { RefreshCw, Loader2, Tag, ExternalLink } from 'lucide-react';
import { useDeals } from '../../hooks/useDeals';
import { DEAL_STORES, formatUsd } from '../../lib/cheapShark';
import { Button } from '../ui';
import { AdminToolbar, AdminFilterSelect } from './adminUi';

const SORT_OPTIONS = [
  { value: 'Deal Rating', label: 'Önerilen' },
  { value: 'Savings', label: 'En çok indirim' },
  { value: 'Price', label: 'En ucuz' },
  { value: 'Metacritic', label: 'En yüksek puan' },
];

function DealsManager() {
  const [storeID, setStoreID] = useState('');
  const [sortBy, setSortBy] = useState('Deal Rating');
  const { deals, loading, error, refetch } = useDeals({ storeID, sortBy });

  return (
    <div className="space-y-5">
      <AdminToolbar
        filters={
          <>
            <AdminFilterSelect
              value={storeID}
              onChange={(e) => setStoreID(e.target.value)}
              aria-label="Mağaza filtresi"
            >
              {DEAL_STORES.map((store) => (
                <option key={store.id || 'all'} value={store.id}>
                  {store.label}
                </option>
              ))}
            </AdminFilterSelect>
            <AdminFilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sıralama"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </AdminFilterSelect>
          </>
        }
        actions={
          <>
            <a
              href="/indirimler"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-warm-200 bg-cream-50 px-3.5 text-sm font-semibold text-warm-800 transition-colors hover:bg-warm-100"
            >
              Sitede gör
              <ExternalLink size={14} />
            </a>
            <Button
              type="button"
              variant="primary"
              size="md"
              iconLeft={loading ? undefined : RefreshCw}
              loading={loading}
              onClick={refetch}
              disabled={loading}
            >
              {loading ? 'Yükleniyor…' : 'Yenile'}
            </Button>
          </>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-900">
          İndirimler yüklenemedi: {error}
        </div>
      ) : deals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-warm-200 bg-white py-16 text-center">
          <Tag className="mx-auto mb-3 text-warm-300" size={40} />
          <p className="font-semibold text-warm-700">Bu filtreye uygun indirim yok</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-warm-100 bg-cream-50 text-xs font-bold uppercase tracking-wide text-warm-500">
                <tr>
                  <th className="px-4 py-3">Oyun</th>
                  <th className="px-4 py-3">Mağaza</th>
                  <th className="px-4 py-3">İndirim</th>
                  <th className="px-4 py-3">Fiyat</th>
                  <th className="px-4 py-3">Puan</th>
                  <th className="px-4 py-3 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-cream-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {deal.image && (
                          <img src={deal.image} alt="" className="h-10 w-16 rounded object-cover" />
                        )}
                        <span className="line-clamp-2 font-semibold text-warm-900">{deal.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-warm-600">{deal.storeName}</td>
                    <td className="px-4 py-3">
                      {deal.savings > 0 ? (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                          -%{deal.savings}
                        </span>
                      ) : (
                        <span className="text-warm-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-orange-600">
                        {deal.salePrice === 0 ? 'Ücretsiz' : formatUsd(deal.salePrice)}
                      </span>
                      {deal.normalPrice > deal.salePrice && (
                        <span className="ml-1.5 text-xs text-warm-400 line-through">
                          {formatUsd(deal.normalPrice)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-warm-600">
                      {deal.metacritic != null
                        ? `MC ${deal.metacritic}`
                        : deal.steamRatingPercent != null
                          ? `%${deal.steamRatingPercent} Steam`
                          : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={deal.url}
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
    </div>
  );
}

export default DealsManager;
