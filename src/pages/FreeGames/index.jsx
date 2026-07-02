import { Link } from 'react-router-dom';
import { Gift, RefreshCw } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import FreeGameCard from '../../components/freeGames/FreeGameCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useFreeGames } from '../../hooks/useFreeGames';

import { PAGE_SEO } from '../../constants/seo';

function FreeGamesPage() {
  const { games, loading, error, refetch } = useFreeGames();

  const breadcrumbs = [{ name: 'Bedava Oyunlar', url: null }];

  return (
    <div className="min-h-screen overflow-x-clip bg-cream-50 py-6 sm:py-12">
      <SEO
        title={PAGE_SEO.freeGames.title}
        description={PAGE_SEO.freeGames.description}
        keywords={PAGE_SEO.freeGames.keywords}
        url="/ucretsiz-oyunlar"
      />

      <div className="container mx-auto min-w-0 px-3 sm:px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="mb-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="self-start rounded-xl bg-emerald-50 p-3">
              <Gift className="text-emerald-600" size={32} aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-warm-900 sm:text-3xl">Bedava Oyunlar</h1>
              <p className="text-sm text-warm-600 sm:text-base">
                {loading
                  ? 'Kampanyalar yükleniyor…'
                  : `${games.length} aktif kampanya · Steam, Epic, GOG`}
              </p>
            </div>
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
            <p className="font-semibold text-amber-900">Liste yüklenemedi</p>
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
        ) : games.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-warm-200 bg-white py-16 text-center">
            <Gift className="mx-auto mb-3 text-warm-300" size={48} />
            <p className="font-bold text-warm-800">Henüz ücretsiz oyun kaydı yok</p>
            <p className="mt-2 text-sm text-warm-500">
              Admin panelinden güncelle butonuna basın.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm font-bold text-orange-600 hover:underline"
            >
              Ana sayfaya dön
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
            {games.map((game) => (
              <FreeGameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-warm-500">
          Kaynak:{' '}
          <a
            href="https://www.gamerpower.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-orange-600 hover:underline"
          >
            GamerPower
          </a>
          . Kampanya süreleri mağazaya göre değişebilir.
        </p>
      </div>
    </div>
  );
}

export default FreeGamesPage;
