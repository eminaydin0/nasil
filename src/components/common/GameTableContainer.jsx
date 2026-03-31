import { RotateCcw } from 'lucide-react';

export default function GameTableContainer({ 
  title, 
  icon: IconComponent, 
  onReset,
  children,
  headerActions,
  className = ''
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden flex flex-col ${className}`}>
      <div className="bg-white border-b border-orange-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div className="p-2.5 bg-orange-50 rounded-xl">
                <IconComponent className="text-orange-600 w-5 h-5" />
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            {onReset && (
              <button 
                onClick={onReset}
                className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                title="Sıfırla"
              >
                <RotateCcw size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
