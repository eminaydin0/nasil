import { Lightbulb, BookOpen, ListOrdered, Sparkles } from 'lucide-react';

export default function GameContent({ game }) {
  const rules = Array.isArray(game?.rules) ? game.rules : [];
  const tips = Array.isArray(game?.tips) ? game.tips : [];

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Oyun Hakkında */}
      <article className="bg-white rounded-2xl shadow-soft border border-warm-200/70 p-6 md:p-8">
        <header className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-50 text-orange-600 rounded-xl shadow-soft">
            <BookOpen size={18} aria-hidden="true" />
          </span>
          <h2 className="text-2xl md:text-[1.75rem] font-extrabold text-warm-900 tracking-tight leading-tight">
            Oyun Hakkında
          </h2>
        </header>
        <p className="text-warm-700 text-[15px] md:text-base leading-[1.75] tracking-[-0.005em]">
          {game.description}
        </p>
      </article>

      {/* Oyun Kuralları */}
      {rules.length > 0 && (
        <article className="bg-white rounded-2xl shadow-soft border border-warm-200/70 p-6 md:p-8">
          <header className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-rose-50 text-rose-600 rounded-xl shadow-soft">
              <ListOrdered size={18} aria-hidden="true" />
            </span>
            <h2 className="text-2xl md:text-[1.75rem] font-extrabold text-warm-900 tracking-tight leading-tight">
              Oyun Kuralları
            </h2>
          </header>

          <ol className="space-y-3.5">
            {rules.map((rule, index) => (
              <li key={index} className="flex gap-3.5 group">
                {/* Numara çipi - gradient orange */}
                <span className="shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-extrabold text-sm shadow-warm-glow tabular-nums transition-transform duration-300 ease-spring group-hover:scale-105">
                  {index + 1}
                </span>
                <p className="text-warm-700 text-[15px] leading-[1.65] pt-1 tracking-[-0.005em]">
                  {rule}
                </p>
              </li>
            ))}
          </ol>
        </article>
      )}

      {/* İpuçları */}
      {tips.length > 0 && (
        <article className="bg-white rounded-2xl shadow-soft border border-warm-200/70 p-6 md:p-8">
          <header className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-amber-50 text-amber-600 rounded-xl shadow-soft">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <h2 className="text-2xl md:text-[1.75rem] font-extrabold text-warm-900 tracking-tight leading-tight">
              İpuçları
            </h2>
          </header>

          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="flex gap-3 p-4 bg-cream-100 border border-cream-300/60 rounded-xl transition-all duration-300 ease-spring hover:bg-cream-200/60 hover:border-amber-200"
              >
                <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 bg-white border border-amber-200 rounded-lg shadow-soft text-amber-600">
                  <Lightbulb size={18} aria-hidden="true" />
                </span>
                <p className="text-warm-700 text-[15px] leading-[1.65] pt-1.5 tracking-[-0.005em]">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}
