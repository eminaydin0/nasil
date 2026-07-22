import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../common/SEO';
import Breadcrumb from '../common/Breadcrumb';
import { TOOL_FEATURES } from '../../constants/tools';
import { ToolFeaturesCard, RelatedToolsCard, RelatedToolsStrip } from '../tools/ToolExtras';
import { buildToolSeoMeta, buildToolStructuredData } from '../../lib/seoEngine';
import { generateFAQSchema } from '../../constants/seo';

/**
 * Araç alt sayfası iskeleti — /araclar listesi ile aynı ölçek ve dil
 *
 * SEO içerik slotları:
 * - seoContent: aramada hedeflenen kelimeleri içeren indexlenebilir prose (JSX)
 * - faqItems: [{ question, answer }] — görünür SSS + FAQPage schema
 */
export default function ToolLayout({
  title,
  description,
  icon: Icon,
  badge,
  children,
  helpContent,
  seoContent,
  faqItems = [],
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

  const structuredData = useMemo(() => {
    const schema = buildToolStructuredData(seoUrl, {
      seoTitle,
      seoDescription,
      title,
      description,
      seoUrl,
    });
    const list = schema ? [schema] : [];
    if (faqItems.length > 0) list.push(generateFAQSchema(faqItems));
    return list;
  }, [seoUrl, seoTitle, seoDescription, title, description, faqItems]);

  return (
    <div className="min-h-screen overflow-x-clip bg-cream-50 py-6 sm:py-12">
      <SEO
        title={toolSeo.title}
        description={toolSeo.description}
        keywords={toolSeo.keywords}
        url={toolSeo.url}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto min-w-0 px-3 sm:px-4">
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
          <div className="min-w-0 space-y-6 overflow-x-clip">
            <div className="min-w-0 overflow-x-clip rounded-2xl border border-warm-200/70 bg-white shadow-soft">
              {children}
            </div>

            {helpContent ? (
              <section className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="mb-4 text-sm font-bold text-warm-900">Yardım & ipuçları</h2>
                <div className="text-sm leading-relaxed text-warm-600">{helpContent}</div>
              </section>
            ) : null}

            {seoContent ? (
              <section className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                <div className="prose-tool max-w-none space-y-4 text-sm leading-relaxed text-warm-700 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-warm-900 [&_h2:first-child]:mt-0 [&_h3]:mb-1 [&_h3]:mt-4 [&_h3]:font-bold [&_h3]:text-warm-900 [&_a]:font-semibold [&_a]:text-orange-600 hover:[&_a]:text-orange-700 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                  {seoContent}
                </div>
              </section>
            ) : null}

            {faqItems.length > 0 ? (
              <section className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="mb-4 text-lg font-bold text-warm-900">Sıkça Sorulan Sorular</h2>
                <div className="divide-y divide-warm-200/70">
                  {faqItems.map((item) => (
                    <details key={item.question} className="group py-3">
                      <summary className="cursor-pointer list-none font-semibold text-warm-900 marker:content-none [&::-webkit-details-marker]:hidden">
                        {item.question}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-warm-600">{item.answer}</p>
                    </details>
                  ))}
                </div>
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
