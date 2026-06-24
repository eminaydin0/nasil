import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../common/SEO';
import Breadcrumb from '../common/Breadcrumb';
import { TOOL_FEATURES } from '../../constants/tools';
import { ToolFeaturesCard, RelatedToolsCard, RelatedToolsStrip } from '../tools/ToolExtras';
import { buildToolSeoMeta, buildToolStructuredData } from '../../lib/seoEngine';

/**
 * Araç alt sayfası iskeleti — /araclar listesi ile aynı ölçek ve dil
 */
export default function ToolLayout({
  title,
  description,
  icon: Icon,
  badge,
  children,
  helpContent,
  seoTitle,
  seoDescription,
  seoUrl,
}) {
  const breadcrumbs = [
    { name: 'Oyun Araçları', url: '/araclar' },
    { name: title, url: null },
  ];

  const toolSeo = useMemo(
    () => buildToolSeoMeta(seoUrl, { seoTitle, seoDescription, title, description, seoUrl }),
    [seoUrl, seoTitle, seoDescription, title, description]
  );

  const toolSchema = useMemo(
    () => buildToolStructuredData(seoUrl, { seoTitle, seoDescription, title, description, seoUrl }),
    [seoUrl, seoTitle, seoDescription, title, description]
  );

  return (
    <div className="min-h-screen bg-cream-50 py-8 sm:py-12">
      <SEO
        title={toolSeo.title}
        description={toolSeo.description}
        keywords={toolSeo.keywords}
        url={toolSeo.url}
        structuredData={toolSchema}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Başlık */}
        <div className="mb-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start">
            {Icon && (
              <div className="shrink-0 self-start rounded-xl bg-orange-100 p-3">
                <Icon className="text-orange-600" size={32} aria-hidden />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-warm-900 sm:text-3xl">{title}</h1>
                {badge ? (
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                    {badge}
                  </span>
                ) : null}
              </div>
              {description ? (
                <p className="mt-1 text-sm leading-relaxed text-warm-600 sm:text-base">
                  {description}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {TOOL_FEATURES.map(({ label }) => (
                  <span
                    key={label}
                    className="rounded-full border border-warm-200/80 bg-white px-2.5 py-1 text-xs font-medium text-warm-600"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Link
            to="/araclar"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
          >
            <ArrowLeft size={16} aria-hidden />
            Tüm araçlara dön
          </Link>
        </div>

        {/* İçerik + yan panel */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="min-w-0 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-warm-200/70 bg-white shadow-soft">
              {children}
            </div>

            {helpContent ? (
              <section className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="mb-4 text-sm font-bold text-warm-900">Yardım & ipuçları</h2>
                <div className="text-sm leading-relaxed text-warm-600">{helpContent}</div>
              </section>
            ) : null}
          </div>

          <aside className="hidden space-y-4 lg:block">
            <ToolFeaturesCard />
            {seoUrl ? <RelatedToolsCard currentLink={seoUrl} /> : null}
          </aside>
        </div>

        {/* Mobilde diğer araçlar */}
        {seoUrl ? (
          <div className="lg:hidden">
            <RelatedToolsStrip currentLink={seoUrl} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
