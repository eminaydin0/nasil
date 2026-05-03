import { Link } from 'react-router-dom';
import { Trophy, Users, Dices, Grid3X3, Wrench, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../ui';

/**
 * ToolsSection - sıcak tonlara uyumlu araç kartları.
 * Renkler warm-orange/amber/rose ekseninde tutuluyor.
 */
const tools = [
  {
    href: '/araclar/101-yazboz',
    icon: Grid3X3,
    color: 'orange',
    title: '101 Okey Yazboz',
    description: 'Yüzbir oyunu için otomatik ceza hesaplama',
    isNew: true,
  },
  {
    href: '/araclar/okey-sayaci',
    icon: Trophy,
    color: 'red',
    title: 'Okey Puan Sayacı',
    description: 'Düşmeli okey için otomatik puan hesaplama',
  },
  {
    href: '/araclar/zar-at',
    icon: Dices,
    color: 'amber',
    title: 'Zar Atma Aracı',
    description: 'Çoklu zar atma ve sonuç görüntüleme',
  },
  {
    href: '/araclar/takim-olusturucu',
    icon: Users,
    color: 'rose',
    title: 'Takım Oluşturucu',
    description: 'Oyuncuları rastgele takımlara ayırma',
  },
];

const colorMap = {
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    accent: 'from-orange-500 to-red-500',
    glow: 'group-hover:shadow-orange-200/70',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    accent: 'from-red-500 to-rose-600',
    glow: 'group-hover:shadow-red-200/70',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    accent: 'from-amber-500 to-orange-500',
    glow: 'group-hover:shadow-amber-200/70',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    accent: 'from-rose-500 to-pink-600',
    glow: 'group-hover:shadow-rose-200/70',
  },
};

export default function ToolsSection() {
  return (
    <section className="relative">
      <SectionHeader
        title="Oyun Araçları"
        subtitle="Hazır kullanım"
        icon={Wrench}
        iconColor="text-orange-600"
        iconBg="bg-orange-50"
        link="/araclar"
        linkText="Tüm Araçlar"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const c = colorMap[tool.color];

          return (
            <Link
              key={tool.href}
              to={tool.href}
              className={`group relative bg-white rounded-2xl p-6 border border-warm-200/70 shadow-soft transition-all duration-500 ease-spring hover:-translate-y-0.5 hover:shadow-soft-lg ${c.glow} focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2`}
            >
              {/* Yumuşak orange aura - hover */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${c.accent} opacity-0 group-hover:opacity-15 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none`} />

              {tool.isNew && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-warm-glow">
                  Yeni
                </span>
              )}

              <div className={`relative inline-flex items-center justify-center w-12 h-12 ${c.bg} rounded-xl mb-4 transition-transform duration-500 ease-spring group-hover:-rotate-3 group-hover:scale-105`}>
                <Icon className={`w-6 h-6 ${c.text}`} aria-hidden="true" />
              </div>

              <h3 className="font-extrabold text-warm-900 mb-1.5 text-base tracking-tight transition-colors duration-300 group-hover:text-warm-950">
                {tool.title}
              </h3>

              <p className="text-warm-500 text-sm leading-relaxed">{tool.description}</p>

              <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full bg-warm-50 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 ease-spring`}>
                <ArrowRight size={16} className={c.text} aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
