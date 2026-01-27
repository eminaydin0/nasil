import { Lightbulb } from 'lucide-react';

export default function GameContent({ game }) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Description */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Oyun Hakkında</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{game.description}</p>
      </div>

      {/* Rules */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Oyun Kuralları</h2>
        <div className="space-y-3">
          {game.rules.map((rule, index) => (
            <div key={index} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-gray-900 text-white rounded-lg flex items-center justify-center font-semibold text-xs">
                {index + 1}
              </span>
              <p className="text-gray-600 text-sm pt-0.5">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">İpuçları</h2>
        <div className="space-y-2">
          {game.tips.map((tip, index) => (
            <div key={index} className="flex gap-2 p-3 bg-gray-50 rounded-lg">
              <Lightbulb className="shrink-0 text-gray-700" size={18} />
              <p className="text-gray-700 text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
