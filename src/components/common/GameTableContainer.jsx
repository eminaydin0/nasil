import { RotateCcw } from 'lucide-react';

export default function GameTableContainer({
  title,
  icon: IconComponent,
  onReset,
  children,
  headerActions,
  className = '',
  subtitle,
}) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[inherit] bg-gradient-to-b from-white to-cream-50/60 ${className}`}
    >
      <div className="relative border-b border-warm-200/70 bg-white/95 px-4 py-4 sm:px-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 opacity-95" aria-hidden />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {IconComponent && (
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-500/15 to-red-500/20 ring-1 ring-orange-500/25">
                <IconComponent className="h-[22px] w-[22px] text-orange-600" aria-hidden />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-display truncate text-lg font-bold tracking-tight text-charcoal-900 sm:text-xl">
                {title}
              </h3>
              {subtitle ? (
                <p className="mt-0.5 text-xs font-medium text-warm-500 sm:text-[13px]">{subtitle}</p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                title="Sıfırla"
                aria-label="Sıfırla"
                className="rounded-xl border border-warm-200 bg-white p-2.5 text-warm-400 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 active:scale-95"
              >
                <RotateCcw size={18} aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
