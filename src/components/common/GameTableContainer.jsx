import { RotateCcw } from 'lucide-react';

export default function GameTableContainer({ 
  title, 
  icon: IconComponent, 
  iconColor = 'orange',
  onReset,
  children,
  headerActions,
  className = ''
}) {
  // Icon color classes
  const iconColorClasses = {
    orange: { text: 'text-orange-600', bg: 'bg-orange-50' },
    pink: { text: 'text-pink-600', bg: 'bg-pink-50' },
    red: { text: 'text-red-600', bg: 'bg-red-50' },
    blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
    green: { text: 'text-green-600', bg: 'bg-green-50' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-50' },
    indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50' },
    yellow: { text: 'text-yellow-600', bg: 'bg-yellow-50' }
  };
  
  const colorClass = iconColorClasses[iconColor] || iconColorClasses.orange;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div className={`p-2.5 ${colorClass.bg} rounded-lg`}>
                <IconComponent className={`${colorClass.text} w-5 h-5`} />
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            {onReset && (
              <button 
                onClick={onReset}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Sıfırla"
              >
                <RotateCcw size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

