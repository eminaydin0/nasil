import { useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGameRating } from '../../hooks/useGameRating';

/**
 * Yorumdan bağımsız hızlı yıldız puanlama bileşeni.
 *
 * variant:
 *   - 'card' (varsayılan): tam panel, içeriği tam açıklamalı
 *   - 'compact': sadece yıldızlar + ortalama (header'da kullanılır)
 */
export default function QuickRating({ gameId, gameName, variant = 'card', className = '' }) {
  const { count, average, userRating, loading, submitting, submitRating } = useGameRating(gameId);
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = async (rating) => {
    if (submitting || loading) return;
    const success = await submitRating(rating);
    if (success) {
      if (userRating > 0) {
        toast.success(`Puanın güncellendi: ${rating}/5`, { icon: '⭐' });
      } else {
        toast.success(`Teşekkürler! ${rating}/5 puan verdin.`, { icon: '⭐' });
      }
    } else {
      toast.error('Puan kaydedilemedi, lütfen tekrar dene.');
    }
  };

  const displayValue = hoverValue || userRating;
  const averageDisplay = average > 0 ? average.toFixed(1) : '—';

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 ${className}`}
        aria-label={`${gameName} ortalama puan ${averageDisplay} üzerinden 5, ${count} oy`}
      >
        <div className="flex items-center" role="img" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={16}
              className={
                n <= Math.round(average)
                  ? 'text-accent-400 fill-accent-400'
                  : 'text-warm-300 fill-warm-100'
              }
            />
          ))}
        </div>
        <span className="text-sm font-bold text-warm-800 tabular-nums">{averageDisplay}</span>
        <span className="text-xs text-warm-500 tabular-nums">({count})</span>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="quick-rating-baslik"
      className={`relative overflow-hidden bg-gradient-to-br from-cream-100 via-white to-amber-50 rounded-2xl shadow-soft p-6 md:p-7 border border-amber-200/50 ${className}`}
    >
      {/* yumuşak amber aura */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="min-w-0">
          <h2 id="quick-rating-baslik" className="text-xl md:text-2xl font-extrabold text-warm-900 mb-1 tracking-tight">
            Bu oyunu beğendin mi?
          </h2>
          <p className="text-sm text-warm-600">
            {count > 0
              ? `${count} kişi puan verdi · Ortalama `
              : 'İlk puanı sen ver, diğer oyunculara yardımcı ol.'}
            {count > 0 && (
              <span className="font-bold text-amber-700 tabular-nums">{averageDisplay} / 5</span>
            )}
          </p>
        </div>

        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHoverValue(0)}
          role="radiogroup"
          aria-label={`${gameName} için 1 ile 5 arasında puan ver`}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const isActive = n <= displayValue;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={userRating === n}
                aria-label={`${n} yıldız`}
                disabled={submitting || loading}
                onMouseEnter={() => setHoverValue(n)}
                onFocus={() => setHoverValue(n)}
                onClick={() => handleClick(n)}
                className={`p-1.5 rounded-xl transition-all duration-300 ease-spring focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  submitting || loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-110 hover:-translate-y-0.5 cursor-pointer'
                }`}
              >
                <Star
                  size={32}
                  strokeWidth={1.5}
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'text-accent-400 fill-accent-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.45)]'
                      : 'text-warm-300 fill-warm-100'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {userRating > 0 && (
        <p className="relative mt-4 text-xs font-semibold text-amber-700">
          Senin puanın: <span className="tabular-nums">{userRating}</span> / 5 — değiştirmek için yeniden tıkla.
        </p>
      )}
    </section>
  );
}
