import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import { Dices, Trophy, PencilLine, Users, ArrowRight, Grid3X3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ToolCard = ({ title, description, icon: Icon, color, link, badge }) => (
  <Link 
    to={link}
    className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
  >
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8" />
        </div>
        {badge && (
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors leading-tight">
        {title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-6 grow leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mt-auto">
        <span>Aracı Kullan</span>
        <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
      </div>
    </div>
  </Link>
);

export default function ToolsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20">
      <SEO 
        title="Oyun Araçları - Okey, Batak Puan Hesaplama" 
        description="Oyun keyfinizi artıracak dijital araçlar. Okey puan tablosu, Batak yazboz, Zar atma ve Takım kurma araçları."
        url="/araclar"
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-orange-500/20">
              <PencilLine size={16} />
              Dijital Oyun Yardımcıları
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Oyun <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Araçları</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Oyun geceleriniz için ihtiyacınız olan tüm dijital yardımcılar. 
              <br className="hidden md:block" />
              Kağıt kalemi bırakın, oyuna odaklanın.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Trophy size={16} className="text-orange-400" />
                <span className="text-white">Puan Hesaplama</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Dices size={16} className="text-purple-400" />
                <span className="text-white">Zar & Kura</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Users size={16} className="text-blue-400" />
                <span className="text-white">Takım Oluşturma</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tools.map((tool, idx) => (
            <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <ToolCard {...tool} />
            </div>
          ))}

          {/* Coming Soon Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-orange-300 transition-colors duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Daha Fazlası Yakında</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Yeni araç önerileriniz için bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
