import { Users, MapPin } from 'lucide-react';

export default function GameInfo({ game }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Users className="text-gray-700" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Oyuncu Sayısı</p>
            <p className="font-semibold text-gray-900 text-sm">{game.players}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <MapPin className="text-gray-700" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Kategori</p>
            <p className="font-semibold text-gray-900 text-sm">{game.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
