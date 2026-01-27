import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import { Dices, Trophy, PencilLine, Users, ArrowRight, Grid3X3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ToolCard = ({ title, description, icon: Icon, color, link, badge }) => (
  <Link 
    to={link}
    className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} group-hover:scale-105 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      {badge && (
        <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {badge}
        </span>
      )}
    </div>
    
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
      {title}
    </h3>
    
    <p className="text-gray-600 text-sm mb-4 grow leading-relaxed">
      {description}
    </p>
    
    <div className="flex items-center text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mt-auto">
      <span>Aracı Kullan</span>
      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
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
      title: 'Halısaha Takım Oluşturucu',
      description: '5v5 / 6v6 / 7v7 formatlarında hızlı takım kurma aracı. Halısaha maçları için ideal.',
      icon: Users,
      color: 'bg-yellow-100 text-yellow-600',
      link: '/araclar/halisaha-takim-olusturucu'
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
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Oyun Araçları - Okey, Batak Puan Hesaplama" 
        description="Oyun keyfinizi artıracak dijital araçlar. Okey puan tablosu, Batak yazboz, Zar atma ve Takım kurma araçları."
        url="/araclar"
      />

      {/* Header Section - GameDetail Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Icon Section */}
            <div className="md:col-span-1">
              <div className="aspect-video w-full bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                <div className="relative z-10 p-4 bg-white/90 backdrop-blur-sm rounded-lg border border-white/20">
                  <PencilLine className="text-orange-600" size={48} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-3">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-lg">
                  Oyun Araçları
                </span>
                <span className="flex items-center text-gray-500 text-xs">
                  {tools.length} araç mevcut
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Oyun Araçları</h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Oyun geceleriniz için ihtiyacınız olan tüm dijital yardımcılar. Kağıt kalemi bırakın, oyuna odaklanın.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid - HomePage Style */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PencilLine className="text-orange-600" />
            Tüm Araçlar
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, idx) => (
            <ToolCard key={idx} {...tool} />
          ))}

          {/* Coming Soon Card */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-orange-300 transition-colors duration-300 group">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-base font-bold text-gray-700 mb-1">Daha Fazlası Yakında</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Yeni araç önerileriniz için bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
