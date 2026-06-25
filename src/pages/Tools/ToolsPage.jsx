import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { ArrowRight, Wrench, Zap, Smartphone, Gift, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PAGE_SEO } from '../../constants/seo';
import {
  SITE_TOOLS,
  TOOL_HIGHLIGHTS,
  groupToolsByCategory,
} from '../../constants/tools';

const colorMap = {
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', accent: 'from-orange-500 to-red-500' },
  red: { bg: 'bg-red-50', text: 'text-red-600', accent: 'from-red-500 to-rose-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', accent: 'from-amber-500 to-orange-500' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', accent: 'from-rose-500 to-pink-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', accent: 'from-emerald-500 to-teal-600' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', accent: 'from-sky-500 to-blue-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', accent: 'from-indigo-500 to-violet-600' },
};

const HIGHLIGHT_ICONS = [Zap, Gift, Smartphone, Clock];

function ToolCard({ title, description, icon: Icon, link, badge, color = 'orange' }) {
  const c = colorMap[color] || colorMap.orange;

  return (
    <Link
      to={link}
      className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-warm-200/70 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-soft-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:p-6"
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${c.accent} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-10`}
      />

      {badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-bold text-white">
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

  const grouped = groupToolsByCategory(SITE_TOOLS);
  const breadcrumbs = [{ name: 'Oyun Araçları', url: null }];

  return (
    <div className="min-h-screen overflow-x-clip bg-cream-50 py-6 sm:py-12">
      <SEO
        title={PAGE_SEO.tools.title}
        description={PAGE_SEO.tools.description}
        keywords={PAGE_SEO.tools.keywords}
        url="/araclar"
      />

      <div className="container mx-auto min-w-0 px-3 sm:px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Giriş */}
        <div className="mb-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="self-start rounded-xl bg-orange-100 p-3">
              <Wrench className="text-orange-600" size={32} aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-warm-900 sm:text-3xl">Oyun Araçları</h1>
              <p className="text-sm text-warm-600 sm:text-base">{SITE_TOOLS.length} ücretsiz araç · kayıt gerektirmez</p>
            </div>
          </div>

          <div className="rounded-2xl border border-warm-200/70 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm leading-relaxed text-warm-600 sm:text-base">
              Okey yazbozundan zar atmaya, skor tablosundan takım kurmaya kadar masa başında ihtiyaç
              duyduğunuz sayaç ve yazboz araçları. Mobil uyumlu, hızlı ve tamamen ücretsiz.
            </p>
          </div>
        </div>

        {/* Öne çıkanlar */}
        <div className="mb-10 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:grid-cols-4">
          {TOOL_HIGHLIGHTS.map(({ label, sub }, i) => {
            const Icon = HIGHLIGHT_ICONS[i];
            return (
              <div
                key={label}
                className="rounded-xl border border-warm-200/70 bg-white px-4 py-3 shadow-soft"
              >
                <Icon className="mb-2 h-5 w-5 text-orange-600" aria-hidden />
                <p className="text-sm font-bold text-warm-900">{label}</p>
                <p className="text-xs text-warm-500">{sub}</p>
              </div>
            );
          })}
        </div>

        {/* Kategorilere göre araçlar */}
        {grouped.map(({ key, label, items }) => (
          <section key={key} className="mb-10">
            <h2 className="mb-4 text-lg font-extrabold text-warm-900">{label}</h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {items.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
          </section>
        ))}

        {/* Alt CTA */}
        <div className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div>
            <h2 className="text-lg font-extrabold text-warm-900">Oyun kurallarını da öğren</h2>
            <p className="mt-1 text-sm text-warm-600">
              Araçları kullanırken kurallarda takılırsan arşivimizde 50+ geleneksel oyun rehberi var.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-0 sm:shrink-0">
            <Link
              to="/oyunlar"
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Oyunları keşfet
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-1.5 rounded-xl border border-warm-200 bg-cream-50 px-5 py-2.5 text-sm font-semibold text-warm-700 transition-colors hover:bg-white"
            >
              Araç öner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
