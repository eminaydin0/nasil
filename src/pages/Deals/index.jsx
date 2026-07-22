import { useState } from 'react';
import { Tag, RefreshCw } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import DealCard from '../../components/deals/DealCard';
import { useDeals } from '../../hooks/useDeals';
import { DEAL_STORES } from '../../lib/cheapShark';
import { PAGE_SEO } from '../../constants/seo';

const SORT_OPTIONS = [
  { value: 'Deal Rating', label: 'Önerilen' },
  { value: 'Savings', label: 'En çok indirim' },
  { value: 'Price', label: 'En ucuz' },
  { value: 'Metacritic', label: 'En yüksek puan' },
];

function DealsPage() {
  const [storeID, setStoreID] = useState('');
  const [sortBy, setSortBy] = useState('Deal Rating');
  const { deals, loading, error, refetch } = useDeals({ storeID, sortBy });

  const breadcrumbs = [{ name: 'Oyun İndirimleri', url: null }];

  return (
    <div className="min-h-screen overflow-x-clip bg-cream-50 py-6 sm:py-12">
      <SEO
        title={PAGE_SEO.deals.title}
        description={PAGE_SEO.deals.description}
        keywords={PAGE_SEO.deals.keywords}
        url="/indirimler"
      />

      <div className="container mx-auto min-w-0 px-3 sm:px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="mb-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="self-start rounded-xl bg-rose-50 p-3">
              <Tag className="text-rose-600" size={32} aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-warm-900 sm:text-3xl">Oyun İndirimleri</h1>
              <p className="text-sm text-warm-600 sm:text-base">
                {loading
                  ? 'İndirimler yükleniyor…'
                  : `${deals.length} güncel fırsat · Steam, Epic, GOG ve daha fazlası`}
              </p>
            </div>
          </div>

          {/* Filtreler */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
              {DEAL_STORES.map((store) => (
                <button
                  key={store.id || 'all'}
                  type="button"
                  onClick={() => setStoreID(store.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
                    storeID === store.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-warm-700 ring-1 ring-warm-200 hover:ring-orange-300'
                  }`}
                >
                  {store.label}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="shrink-0 rounded-xl border border-warm-200 bg-white px-3 py-2 text-sm font-semibold text-warm-800 focus:border-orange-400 focus:outline-none"
              aria-label="Sıralama"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonLoader key={i} type="game-card" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <p className="font-semibold text-amber-900">İndirimler yüklenemedi</p>
            <p className="mt-1 text-sm text-amber-800">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white"
            >
              <RefreshCw size={16} />
              Tekrar dene
            </button>
          </div>
        ) : deals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-warm-200 bg-white py-16 text-center">
            <Tag className="mx-auto mb-3 text-warm-300" size={48} />
            <p className="font-bold text-warm-800">Bu filtreye uygun indirim bulunamadı</p>
            <p className="mt-2 text-sm text-warm-500">Farklı bir mağaza veya sıralama deneyin.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-warm-500">
          Fiyatlar ABD doları ($) cinsindendir. Kaynak:{' '}
          <a
            href="https://www.cheapshark.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-orange-600 hover:underline"
          >
            CheapShark
          </a>
          . Fiyat ve stok durumu mağazaya göre değişebilir.
        </p>
      </div>
    </div>
  );
}

export default DealsPage;
