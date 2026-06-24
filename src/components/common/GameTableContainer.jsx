import { RotateCcw } from 'lucide-react';

export default function GameTableContainer({
  onReset,
  children,
  headerActions,
  className = '',
}) {
  const showToolbar = onReset || headerActions;

  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
      {showToolbar ? (
        <div className="flex items-center justify-end gap-2 border-b border-warm-100 px-4 py-3 sm:px-6">
          {headerActions}
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              title="Sıfırla"
              aria-label="Sıfırla"
              className="inline-flex items-center gap-1.5 rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
            >
              <RotateCcw size={16} aria-hidden />
              Sıfırla
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="min-w-0">{children}</div>
    </div>
  );
}
