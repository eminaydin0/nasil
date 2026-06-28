import { Gamepad2, Users, MessageCircle, LayoutGrid } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSiteStats } from '../../hooks/useSiteStats';

const stats = [
  { id: 'games', label: 'Oyun Rehberi', icon: Gamepad2, accent: 'from-orange-500 to-red-500', bg: 'bg-orange-50' },
  { id: 'users', label: 'Aktif Kullanıcı', icon: Users, accent: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
  { id: 'comments', label: 'Kullanıcı Yorumu', icon: MessageCircle, accent: 'from-rose-500 to-red-500', bg: 'bg-rose-50' },
  { id: 'categories', label: 'Kategori', icon: LayoutGrid, accent: 'from-orange-400 to-amber-500', bg: 'bg-cream-200' },
];

/**
 * Counter - 0'dan target sayıya rolling animasyon (IntersectionObserver tetikli)
 */
function Counter({ target, duration = 1400 }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const startTs = performance.now();
    const startVal = 0;
    const endVal = Number(target) || 0;

    let raf;
    const step = (now) => {
      const elapsed = Math.min(1, (now - startTs) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setValue(Math.round(startVal + (endVal - startVal) * eased));
      if (elapsed < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return <span ref={ref}>{value}</span>;
}

function StatsSection() {
  const { stats: counts } = useSiteStats();

  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border border-warm-200/70 bg-white shadow-soft-lg sm:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.04),transparent_60%)]" />

          <div className="relative grid grid-cols-2 divide-x divide-y divide-warm-100 md:grid-cols-4 md:divide-y-0">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const count = counts[stat.id];
              return (
                <div
                  key={stat.id}
                  className="group flex flex-col items-center gap-2 p-3.5 text-center transition-colors duration-300 hover:bg-cream-100/40 sm:flex-row sm:items-center sm:gap-4 sm:p-6 sm:text-left md:gap-5 md:p-8"
                >
                  <div
                    className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.bg} shadow-soft transition-transform duration-500 ease-spring group-hover:-rotate-3 group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl`}
                  >
                    <Icon className="h-5 w-5 text-warm-800 sm:h-6 sm:w-6" aria-hidden="true" />
                    <span
                      className={`absolute inset-0 rounded-xl bg-gradient-to-br sm:rounded-2xl ${stat.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-15`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-baseline justify-center gap-0.5 leading-none sm:justify-start">
                      <span className="text-2xl font-extrabold tabular-nums tracking-tight text-warm-900 sm:text-4xl md:text-5xl">
                        <Counter target={count} />
                      </span>
                      <span
                        className={`bg-gradient-to-r text-lg font-extrabold sm:text-2xl md:text-3xl ${stat.accent} bg-clip-text text-transparent`}
                      >
                        +
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[11px] font-medium text-warm-500 sm:mt-2 sm:text-sm">
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
