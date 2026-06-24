import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import {
  Dices,
  Trophy,
  PencilLine,
  Users,
  ArrowRight,
  Grid3X3,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PAGE_SEO } from '../../constants/seo';

const colorMap = {
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', accent: 'from-orange-500 to-red-500' },
  red: { bg: 'bg-red-50', text: 'text-red-600', accent: 'from-red-500 to-rose-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', accent: 'from-amber-500 to-orange-500' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', accent: 'from-rose-500 to-pink-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', accent: 'from-emerald-500 to-teal-600' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', accent: 'from-sky-500 to-blue-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', accent: 'from-indigo-500 to-violet-600' },
};

function ToolCard({ title, description, icon: Icon, link, badge, color = 'orange' }) {
  const c = colorMap[color] || colorMap.orange;

  return (
    <Link
      to={link}
      className="group relative flex h-full flex-col rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-soft-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${c.accent} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-10`}
      />

      {badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          {badge}
        </span>
      ) : null}

      <div
        className={`relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} transition-transform duration-300 group-hover:scale-105`}
      >
        <Icon className={`h-6 w-6 ${c.text}`} aria-hidden />
      </div>

      <h3 className="mb-1.5 text-base font-extrabold tracking-tight text-warm-900 group-hover:text-orange-700">
        {title}
      </h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-warm-600">{description}</p>

      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600">
        Araca git
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export default function ToolsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tools = [
    {
      title: '101 Okey Yazboz',
      description: 'Yüzbir oyunu için ceza puanları, el geçmişi ve otomatik toplamlar.',
      icon: Grid3X3,
      link: '/araclar/101-yazboz',
      badge: 'Yeni',
      color: 'orange',
    },
    {
      title: 'Okey Puan Sayacı',
      description: 'Düşmeli okeyde ceza puanlarını kaybetmeyin. Normal ve okey çift bitiş seçenekleri.',
      icon: Trophy,
      link: '/araclar/okey-sayaci',
      color: 'red',
    },
    {
      title: 'Batak & King Yazboz',
      description: 'İhaleli batak veya king için tur bazlı yazboz. Toplamlar otomatik hesaplanır.',
      icon: PencilLine,
      link: '/araclar/batak-yazboz',
      color: 'amber',
    },
    {
      title: 'Takım Oluşturucu',
      description: 'İsimleri yazın — takımlar adil şekilde rastgele dağılsın.',
      icon: Users,
      link: '/araclar/takim-olusturucu',
      color: 'rose',
    },
    {
      title: 'Halısaha Takım Oluşturucu',
      description: '5v5, 6v6 veya 7v7. Forma renkleriyle sahada iki takım oluşturun.',
      icon: Users,
      link: '/araclar/halisaha-takim-olusturucu',
      color: 'emerald',
    },
    {
      title: 'Zar At',
      description: 'Tek veya çift zar, animasyonlu atışlar ve sonuç geçmişi.',
      icon: Dices,
      link: '/araclar/zar-at',
      color: 'sky',
    },
    {
      title: 'Basit Skor Tablosu',
      description: 'Her oyuna uyumlu nötr tablo; isimleri düzenleyin, sıralama güncellensin.',
      icon: Trophy,
      link: '/araclar/skor-tablosu',
      color: 'indigo',
    },
  ];

  const breadcrumbs = [{ name: 'Oyun Araçları', url: null }];

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <SEO
        title={PAGE_SEO.tools.title}
        description={PAGE_SEO.tools.description}
        keywords={PAGE_SEO.tools.keywords}
        url="/araclar"
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Giriş — Tüm Oyunlar ile aynı ölçek */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3">
              <Wrench className="text-orange-600" size={32} aria-hidden />
            </div>
            <div>
              <h1 className="text-3xl font-black text-warm-900">Oyun Araçları</h1>
              <p className="text-warm-600">{tools.length} ücretsiz araç · kayıt gerektirmez</p>
            </div>
          </div>

          <div className="rounded-2xl border border-warm-200/70 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm leading-relaxed text-warm-600 sm:text-base">
              Okey yazbozundan zar atmaya, skor tablosundan takım kurmaya kadar masa başında ihtiyaç
              duyduğunuz sayaç ve yazboz araçları. Mobil uyumlu, hızlı ve tamamen ücretsiz.
            </p>
          </div>
        </div>

        {/* Araç listesi */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.link} {...tool} />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-warm-500">
          Aradığın aracı bulamadın mı?{' '}
          <Link to="/iletisim" className="font-semibold text-orange-600 hover:text-orange-700">
            Bize yaz, ekleyelim
          </Link>
        </p>
      </div>
    </div>
  );
}
