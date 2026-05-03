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
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl border border-warm-200/70 shadow-soft-lg overflow-hidden relative">
          {/* Yumuşak iç vinyetleme */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.04),transparent_60%)] pointer-events-none" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-warm-100">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const count = counts[stat.id];
              return (
                <div key={stat.id} className="group flex items-center gap-5 p-6 md:p-8 transition-colors duration-300 hover:bg-cream-100/40">
                  {/* İkon - dairesel sıcak zemin */}
                  <div className={`shrink-0 relative inline-flex items-center justify-center w-14 h-14 ${stat.bg} rounded-2xl shadow-soft transition-transform duration-500 ease-spring group-hover:-rotate-3 group-hover:scale-105`}>
                    <Icon className="w-6 h-6 text-warm-800" aria-hidden="true" />
                    <span className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5 leading-none">
                      <span className="text-4xl md:text-5xl font-extrabold text-warm-900 tracking-tight tabular-nums">
                        <Counter target={count} />
                      </span>
                      <span className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`}>+</span>
                    </div>
                    <p className="text-sm font-medium text-warm-500 mt-2 truncate">{stat.label}</p>
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
