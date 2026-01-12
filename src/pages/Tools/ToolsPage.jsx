import SEO from '../../components/common/SEO';
import { Dices, Trophy, PencilLine, Users, ArrowRight, Grid3X3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ToolCard = ({ title, description, icon: Icon, color, link, badge }) => (
  <Link 
    to={link}
    className="group bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-8 h-8" />
      </div>
      {badge && (
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          {badge}
        </span>
      )}
    </div>
    
    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
      {title}
    </h3>
    
    <p className="text-gray-500 text-sm mb-6 grow">
      {description}
    </p>
    
    <div className="flex items-center text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors mt-auto">
      Aracı Kullan
      <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

export default function ToolsPage() {
  const tools = [
    {
      title: '101 Okey Yazboz',
      description: 'Yüzbir oyunu için ceza puanlarını ve bitişleri otomatik hesaplayan gelişmiş yazboz.',
      icon: Grid3X3,
      color: 'bg-pink-100 text-pink-600',
      link: '/araclar/101-yazboz',
      badge: 'Yeni'
    },
    {
      title: 'Okey Puan Sayacı',
      description: 'Kağıt kalem derdine son. Düşmeli okey için otomatik ceza ve puan hesaplama aracı.',
      icon: Trophy,
      color: 'bg-red-100 text-red-600',
      link: '/araclar/okey-sayaci',
      badge: 'Popüler'
    },
    {
      title: 'Batak & King Yazboz',
      description: 'İhaleli batak, eşli batak veya King oyunları için skor tablosu. Otomatik toplama özelliği.',
      icon: PencilLine,
      color: 'bg-indigo-100 text-indigo-600',
      link: '/araclar/batak-yazboz'
    },
    {
      title: 'Takım Oluşturucu',
      description: 'Arkadaş grubunuz için adil kura çekimi yapın. İsimleri girin, takımları otomatik kurun.',
      icon: Users,
      color: 'bg-green-100 text-green-600',
      link: '/araclar/takim-olusturucu'
    },
    {
      title: 'Zar At',
      description: 'Zarlar kaybolduysa üzülmeyin. Tek veya çift zar atma simülasyonu.',
      icon: Dices,
      color: 'bg-orange-100 text-orange-600',
      link: '/araclar/zar-at'
    },
    {
      title: 'Basit Skor Tablosu',
      description: 'Herhangi bir oyun veya yarışma için basit, manuel puan tutucu.',
      icon: Trophy,
      color: 'bg-blue-100 text-blue-600',
      link: '/araclar/skor-tablosu'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO 
        title="Oyun Araçları - Okey, Batak Puan Hesaplama" 
        description="Oyun keyfinizi artıracak dijital araçlar. Okey puan tablosu, Batak yazboz, Zar atma ve Takım kurma araçları."
        url="/araclar"
      />

      <div className="bg-gray-900 py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-black text-white text-center mb-6">
            Oyun Araçları
          </h1>
          <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto">
            Oyun geceleriniz için ihtiyacınız olan tüm dijital yardımcılar. <br/>Kağıt kalemi bırakın, oyuna odaklanın.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" >
          {tools.map((tool, idx) => (
            <ToolCard key={idx} {...tool} />
          ))}

          {/* Coming Soon Card */}
          <div className="bg-gray-100 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-70">
            <h3 className="text-lg font-bold text-gray-500 mb-2">Daha Fazlası Yakında</h3>
            <p className="text-sm text-gray-400">
              Yeni araç önerileriniz için bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
