import { Gift } from 'lucide-react';
import { SectionHeader } from '../ui';
import FreeGameCard from '../freeGames/FreeGameCard';
import SkeletonLoader from '../common/SkeletonLoader';
import { useFreeGames } from '../../hooks/useFreeGames';

function FreeGamesSection({ limit = 8 }) {
  const { games, loading } = useFreeGames({ limit });

  if (!loading && games.length === 0) return null;

  return (
    <section
      className="border-t border-warm-200/60 py-8 md:py-16"
      aria-labelledby="free-games-title"
    >
      <SectionHeader
        title="Bedava Oyunlar"
        subtitle="Steam · Epic · GOG"
        icon={Gift}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
        link="/ucretsiz-oyunlar"
        linkText="Tüm kampanyalar"
      />

      {loading ? (
        <div className="home-scroll-row -mx-3 flex gap-3.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 md:gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="home-scroll-item w-[min(82vw,300px)] shrink-0 sm:w-auto sm:shrink"
            >
              <SkeletonLoader type="game-card" />
            </div>
          ))}
        </div>
      ) : (
        <div className="home-scroll-row -mx-3 flex gap-3.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 md:gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="home-scroll-item w-[min(82vw,300px)] shrink-0 sm:w-auto sm:shrink"
            >
              <FreeGameCard game={game} compact />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FreeGamesSection;
