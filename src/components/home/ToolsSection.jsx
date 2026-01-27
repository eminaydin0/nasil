import { Link } from 'react-router-dom';
import { Trophy, Users, Dices, Grid3X3, PencilLine } from 'lucide-react';

export default function ToolsSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <PencilLine className="text-purple-500" />
          Oyun Araçları
        </h2>
        <a href="/araclar" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
          Tüm Araçları Gör →
        </a>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          to="/araclar/101-yazboz"
          className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Grid3X3 className="text-pink-600 w-6 h-6" />
            </div>
            <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full">Yeni</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">101 Okey Yazboz</h3>
          <p className="text-gray-600 text-sm">Yüzbir oyunu için otomatik ceza hesaplama</p>
        </Link>

        <Link 
          to="/araclar/okey-puan-sayaci"
          className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trophy className="text-red-600 w-6 h-6" />
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">Okey Puan Sayacı</h3>
          <p className="text-gray-600 text-sm">Düşmeli okey için otomatik puan hesaplama</p>
        </Link>

        <Link 
          to="/araclar/zar-at"
          className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Dices className="text-blue-600 w-6 h-6" />
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Zar Atma Aracı</h3>
          <p className="text-gray-600 text-sm">Çoklu zar atma ve sonuç görüntüleme</p>
        </Link>

        <Link 
          to="/araclar/takim-olusturucu"
          className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="text-green-600 w-6 h-6" />
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Takım Oluşturucu</h3>
          <p className="text-gray-600 text-sm">Oyuncuları rastgele takımlara ayırma</p>
        </Link>
      </div>
    </section>
  );
}
