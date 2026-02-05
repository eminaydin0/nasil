import { Link } from 'react-router-dom';
import { Trophy, Users, Dices, Grid3X3, Wrench, ArrowRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

const tools = [
  {
    href: '/araclar/101-yazboz',
    icon: Grid3X3,
    color: 'orange',
    title: '101 Okey Yazboz',
    description: 'Yüzbir oyunu için otomatik ceza hesaplama',
    isNew: true
  },
  {
    href: '/araclar/okey-sayaci',
    icon: Trophy,
    color: 'red',
    title: 'Okey Puan Sayacı',
    description: 'Düşmeli okey için otomatik puan hesaplama'
  },
  {
    href: '/araclar/zar-at',
    icon: Dices,
    color: 'blue',
    title: 'Zar Atma Aracı',
    description: 'Çoklu zar atma ve sonuç görüntüleme'
  },
  {
    href: '/araclar/takim-olusturucu',
    icon: Users,
    color: 'emerald',
    title: 'Takım Oluşturucu',
    description: 'Oyuncuları rastgele takımlara ayırma'
  }
];

const colorMap = {
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'group-hover:bg-orange-100', hoverText: 'group-hover:text-orange-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600', hover: 'group-hover:bg-red-100', hoverText: 'group-hover:text-red-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'group-hover:bg-blue-100', hoverText: 'group-hover:text-blue-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'group-hover:bg-emerald-100', hoverText: 'group-hover:text-emerald-600' }
};

export default function ToolsSection() {
  return (
    <section className="relative">
      <SectionHeader
        title="Oyun Araçları"
        icon={Wrench}
        iconColor="text-purple-600"
        iconBg="bg-purple-50"
        link="/araclar"
        linkText="Tüm Araçlar"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const colors = colorMap[tool.color];
          
          return (
            <Link 
              key={tool.href}
              to={tool.href}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Yeni badge */}
              {tool.isNew && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full uppercase">
                  Yeni
                </span>
              )}

              {/* İkon */}
              <div className={`inline-flex p-3 ${colors.bg} ${colors.hover} rounded-xl mb-4 transition-colors duration-300`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
              
              {/* Başlık */}
              <h3 className={`font-bold text-gray-900 mb-2 ${colors.hoverText} transition-colors`}>
                {tool.title}
              </h3>
              
              {/* Açıklama */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {tool.description}
              </p>

              {/* Hover arrow */}
              <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight size={16} className={colors.text} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
